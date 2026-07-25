// src/app/webhooks/shopify/orders-paid/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function verifyShopifyHmac(rawBody: Buffer, hmacHeader: string | null): boolean {
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

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function getNoteAttr(noteAttributes: any[], key: string): string | undefined {
  if (!Array.isArray(noteAttributes)) return undefined;
  const entry = noteAttributes.find((a: any) => a && a.name === key);
  return entry?.value || undefined;
}

// ---------------------------------------------------------------------------
// GA4 Measurement Protocol — purchase
// ---------------------------------------------------------------------------
async function fireGa4Purchase(order: any, gaClientId: string): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.warn('[webhook/ga4] NEXT_PUBLIC_GA_MEASUREMENT_ID or GA4_API_SECRET missing — skipping');
    return;
  }

  const lineItems = (order.line_items || []).map((item: any) => ({
    item_id: String(item.product_id || item.variant_id || ''),
    item_name: item.title || item.name || '',
    ...(item.variant_title ? { item_variant: item.variant_title } : {}),
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
          shipping: parseFloat(
            order.total_shipping_price_set?.shop_money?.amount || '0'
          ),
          ...(
            (order.discount_codes || []).length > 0
              ? { coupon: (order.discount_codes as any[]).map((d: any) => d.code).join(',') }
              : {}
          ),
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
// Meta Conversions API — Purchase
// ---------------------------------------------------------------------------
async function fireMetaCapiPurchase(
  order: any,
  noteAttributes: any[],
  request: NextRequest
): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const capiToken = process.env.FB_CAPI_TOKEN;

  if (!pixelId || !capiToken) {
    console.warn('[webhook/meta] NEXT_PUBLIC_FB_PIXEL_ID or FB_CAPI_TOKEN missing — skipping');
    return;
  }

  const email: string | undefined = order.email || order.customer?.email;
  const rawPhone: string | undefined =
    order.phone || order.customer?.phone ||
    order.billing_address?.phone || order.shipping_address?.phone;
  const phone = rawPhone ? rawPhone.replace(/\D/g, '') : undefined;

  const fbp = getNoteAttr(noteAttributes, 'fbp');
  const fbc = getNoteAttr(noteAttributes, 'fbc');

  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  const userData: Record<string, string> = {
    ...(email ? { em: sha256(email) } : {}),
    ...(phone ? { ph: sha256(phone) } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(clientIp ? { client_ip_address: clientIp } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
  };

  const contents = (order.line_items || []).map((item: any) => ({
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
          content_ids: contents.map((c: any) => c.id),
          content_type: 'product',
          contents,
          order_id: String(order.id || ''),
          num_items: contents.reduce((s: number, c: any) => s + c.quantity, 0),
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
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Read raw body as Buffer — must happen before any other processing.
  //    request.arrayBuffer() gives us the untouched bytes for HMAC.
  let rawBuffer: Buffer;
  try {
    rawBuffer = Buffer.from(await request.arrayBuffer());
  } catch (err) {
    console.error('[webhook] Failed to read request body:', err);
    return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
  }

  // 2. Verify HMAC signature
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  if (!verifyShopifyHmac(rawBuffer, hmacHeader)) {
    console.warn('[webhook] Invalid HMAC — rejecting request');
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // 3. Parse order payload
  let order: any;
  try {
    order = JSON.parse(rawBuffer.toString('utf8'));
  } catch (err) {
    console.error('[webhook] Failed to parse order JSON:', err);
    // Still 200 — malformed payload isn't Shopify's fault to retry
    return NextResponse.json({ success: true });
  }

  const noteAttributes: any[] = order.note_attributes || [];
  const gaClientId = getNoteAttr(noteAttributes, 'ga_client_id');

  // 4. Fire GA4 + Meta CAPI in parallel, defensively
  //    We await both before returning 200 — Shopify's webhook timeout is
  //    typically 5 s; the two external HTTP calls are fast enough in practice.
  //    Promise.allSettled ensures one failure doesn't abort the other.
  await Promise.allSettled([
    gaClientId
      ? fireGa4Purchase(order, gaClientId).catch((err) =>
          console.error('[webhook/ga4] Unexpected error:', err?.message ?? err)
        )
      : Promise.resolve(
          console.warn(
            `[webhook/ga4] No ga_client_id in note_attributes for order ${order.id} — skipping GA4`
          )
        ),

    fireMetaCapiPurchase(order, noteAttributes, request).catch((err) =>
      console.error('[webhook/meta] Unexpected error:', err?.message ?? err)
    ),
  ]);

  // 5. Respond 200 — Shopify won't retry
  return NextResponse.json({ success: true });
}
