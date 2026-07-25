// src/backend/routes/webhooks.js
'use strict';

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Verify Shopify webhook HMAC-SHA256 signature.
 * The raw request body Buffer must be used — JSON-parsed bodies will fail.
 */
function verifyShopifyHmac(rawBody, hmacHeader) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] SHOPIFY_WEBHOOK_SECRET is not set');
    return false;
  }
  if (!hmacHeader) return false;

  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(hmacHeader)
    );
  } catch {
    return false;
  }
}

/** SHA-256 hex hash — used for Meta CAPI user_data normalisation. */
function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

/** Pull a value from note_attributes by key (defensive). */
function getNoteAttr(noteAttributes, key) {
  if (!Array.isArray(noteAttributes)) return undefined;
  const entry = noteAttributes.find((a) => a && a.name === key);
  return entry?.value || undefined;
}

// ---------------------------------------------------------------------------
// GA4 Measurement Protocol purchase event
// ---------------------------------------------------------------------------
async function fireGa4Purchase(order, gaClientId) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.warn('[webhook/ga4] NEXT_PUBLIC_GA_MEASUREMENT_ID or GA4_API_SECRET missing — skipping');
    return;
  }

  const lineItems = (order.line_items || []).map((item) => ({
    item_id: String(item.product_id || item.variant_id || ''),
    item_name: item.title || item.name || '',
    item_variant: item.variant_title || undefined,
    price: parseFloat(item.price || '0'),
    quantity: item.quantity || 1,
  }));

  const payload = {
    client_id: gaClientId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: String(order.id || order.order_number || ''),
          value: parseFloat(order.total_price || '0'),
          currency: order.currency || 'INR',
          tax: parseFloat(order.total_tax || '0'),
          shipping: parseFloat(order.total_shipping_price_set?.shop_money?.amount || '0'),
          coupon: (order.discount_codes || []).map((d) => d.code).join(',') || undefined,
          items: lineItems,
        },
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn(`[webhook/ga4] MP collect responded ${res.status}: ${text}`);
  } else {
    console.log(`[webhook/ga4] purchase event sent for order ${order.id}`);
  }
}

// ---------------------------------------------------------------------------
// Meta Conversions API purchase event
// ---------------------------------------------------------------------------
async function fireMetaCapiPurchase(order, noteAttributes, req) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const capiToken = process.env.FB_CAPI_TOKEN;

  if (!pixelId || !capiToken) {
    console.warn('[webhook/meta] NEXT_PUBLIC_FB_PIXEL_ID or FB_CAPI_TOKEN missing — skipping');
    return;
  }

  // User data — hash PII per Meta requirements
  const email = order.email || order.customer?.email;
  const phone = order.phone || order.customer?.phone
    || order.billing_address?.phone || order.shipping_address?.phone;

  const fbp = getNoteAttr(noteAttributes, 'fbp');
  const fbc = getNoteAttr(noteAttributes, 'fbc');

  // Client IP & UA from original webhook request headers
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || undefined;
  const userAgent = req.headers['user-agent'] || undefined;

  const userData = {
    ...(email ? { em: sha256(email) } : {}),
    ...(phone ? { ph: sha256(phone.replace(/\D/g, '')) } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(clientIp ? { client_ip_address: clientIp } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
  };

  const contents = (order.line_items || []).map((item) => ({
    id: String(item.product_id || item.variant_id || ''),
    quantity: item.quantity || 1,
    item_price: parseFloat(item.price || '0'),
  }));

  const eventPayload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency: order.currency || 'INR',
          value: parseFloat(order.total_price || '0'),
          content_ids: contents.map((c) => c.id),
          content_type: 'product',
          contents,
          order_id: String(order.id || ''),
          num_items: contents.reduce((s, c) => s + c.quantity, 0),
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${capiToken}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn(`[webhook/meta] CAPI responded ${res.status}: ${text}`);
  } else {
    const json = await res.json().catch(() => ({}));
    console.log(`[webhook/meta] Purchase event sent for order ${order.id}`, json);
  }
}

// ---------------------------------------------------------------------------
// POST /webhooks/shopify/orders-paid
//
// express.raw({ type: '*/*' }) is applied per-route so that the raw Buffer is
// available for HMAC verification. The global express.json() middleware in
// server.js is NOT applied to this path because this route is registered
// before express.json() in the middleware chain.
// ---------------------------------------------------------------------------
router.post(
  '/shopify/orders-paid',
  express.raw({ type: '*/*' }),
  async (req, res) => {
    // 1. Respond 200 immediately to prevent Shopify retries while we fire events
    //    (do NOT close the connection yet — we need to do the downstream calls).
    //    Instead we use a flag and respond at the end, but we still respond before
    //    throwing so Shopify never sees our internal errors.

    // 2. HMAC verification
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const rawBody = req.body; // Buffer from express.raw()

    if (!verifyShopifyHmac(rawBody, hmacHeader)) {
      console.warn('[webhook] Invalid HMAC — rejecting request');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Respond 200 immediately so Shopify won't retry
    res.status(200).json({ success: true });

    // 3. Parse order payload
    let order;
    try {
      order = JSON.parse(rawBody.toString('utf8'));
    } catch (err) {
      console.error('[webhook] Failed to parse order payload:', err.message);
      return; // already responded 200
    }

    const noteAttributes = order.note_attributes || [];
    const gaClientId = getNoteAttr(noteAttributes, 'ga_client_id');

    // 4. Fire GA4 purchase event (skip if no client_id)
    if (!gaClientId) {
      console.warn(`[webhook/ga4] No ga_client_id in note_attributes for order ${order.id} — skipping GA4`);
    } else {
      try {
        await fireGa4Purchase(order, gaClientId);
      } catch (err) {
        console.error('[webhook/ga4] Unexpected error:', err.message || err);
      }
    }

    // 5. Fire Meta CAPI purchase event (always attempt)
    try {
      await fireMetaCapiPurchase(order, noteAttributes, req);
    } catch (err) {
      console.error('[webhook/meta] Unexpected error:', err.message || err);
    }
  }
);

module.exports = router;
