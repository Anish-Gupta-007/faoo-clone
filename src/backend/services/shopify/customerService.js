const axios = require('axios');

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const shopifyAdminApi = axios.create({
  baseURL: `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01`,
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

/**
 * Search for customer by email in Shopify
 */
async function findCustomerByEmail(email) {
  try {
    const response = await shopifyAdminApi.get('/customers/search.json', {
      params: {
        query: `email:${email}`,
      },
    });
    return response.data.customers[0] || null;
  } catch (error) {
    console.error('Error finding Shopify customer:', error.message);
    return null;
  }
}

/**
 * Create new customer in Shopify
 */
async function createCustomer(customerData) {
  try {
    const response = await shopifyAdminApi.post('/customers.json', {
      customer: {
        first_name: customerData.fullName.split(' ')[0] || '',
        last_name: customerData.fullName.split(' ').slice(1).join(' ') || '',
        email: customerData.email,
        phone: customerData.phone,
        verified_email: true,
        accepts_marketing: false,
      },
    });
    return response.data.customer;
  } catch (error) {
    console.error('Error creating Shopify customer:', error.message);
    throw error;
  }
}

/**
 * Get customer orders from Shopify
 */
async function getCustomerOrders(shopifyCustomerId) {
  try {
    const response = await shopifyAdminApi.get(`/customers/${shopifyCustomerId}/orders.json`);
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error.message);
    return [];
  }
}

/**
 * Sync local user with Shopify customer
 */
async function syncCustomerWithShopify(userData) {
  // First try to find existing customer
  let shopifyCustomer = await findCustomerByEmail(userData.email);

  if (!shopifyCustomer) {
    // Create new customer in Shopify
    shopifyCustomer = await createCustomer(userData);
  }

  return {
    shopifyCustomerId: shopifyCustomer.id.toString(),
    shopifyEmail: shopifyCustomer.email,
  };
}

module.exports = {
  findCustomerByEmail,
  createCustomer,
  getCustomerOrders,
  syncCustomerWithShopify,
};
