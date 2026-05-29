const { createStorefrontApiClient } = require('@shopify/storefront-api-client');
const { createAdminApiClient } = require('@shopify/admin-api-client');

// Lazy-initialised singletons — prevents crashes at module-load time when
// env vars haven't been injected yet (e.g. during Next.js compilation).
let _storefrontClient = null;
let _adminClient = null;

function getStorefrontClient() {
  if (!_storefrontClient) {
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!storeDomain || !storefrontAccessToken) {
      throw new Error(
        `Shopify Storefront client misconfigured — SHOPIFY_STORE_DOMAIN="${storeDomain}", SHOPIFY_STOREFRONT_ACCESS_TOKEN="${storefrontAccessToken ? '***' : undefined}"`
      );
    }
    _storefrontClient = createStorefrontApiClient({
      storeDomain,
      publicAccessToken: storefrontAccessToken,
      apiVersion: '2026-04',
    });
  }
  return _storefrontClient;
}

function getAdminClient() {
  if (!_adminClient) {
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    if (!storeDomain || !adminAccessToken) {
      throw new Error(
        `Shopify Admin client misconfigured — SHOPIFY_STORE_DOMAIN="${storeDomain}", SHOPIFY_ADMIN_ACCESS_TOKEN="${adminAccessToken ? '***' : undefined}"`
      );
    }
    _adminClient = createAdminApiClient({
      storeDomain,
      accessToken: adminAccessToken,
      apiVersion: '2026-04',
    });
  }
  return _adminClient;
}

const CUSTOMER_API_ENDPOINT = 'https://shopify.com/100271948085/account/graphql';

async function customerAccountClient(query, variables, accessToken) {
  const response = await fetch(CUSTOMER_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Customer Account API error: ${response.status} ${text}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Customer Account API GraphQL error: ${json.errors[0].message}`);
  }
  return json;
}

module.exports = { getStorefrontClient, getAdminClient, customerAccountClient };
