const { customerAccountClient } = require('./client');

function mapFulfillmentStatus(status) {
  if (!status) return 'Pending';
  switch (status.toUpperCase()) {
    case 'FULFILLED': return 'Delivered';
    case 'IN_PROGRESS': return 'Processing';
    case 'PARTIALLY_FULFILLED': return 'Shipped';
    case 'RESTOCKED': return 'Cancelled';
    case 'UNFULFILLED': return 'Confirmed';
    default: return 'Pending';
  }
}

function mapFinancialStatus(status) {
  if (!status) return 'Pending';
  switch (status.toUpperCase()) {
    case 'PAID': return 'Paid';
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
    case 'VOIDED': return 'Refunded';
    default: return 'Pending';
  }
}

async function getOrders(accessToken, first = 20) {
  const query = `
    query getCustomerOrders($first: Int!) {
      customer {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              number
              totalPrice {
                amount
                currencyCode
              }
              financialStatus
              fulfillmentStatus
              processedAt
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await customerAccountClient(query, { 
    first: parseInt(first, 10) || 20 
  }, accessToken);

  if (!data?.customer?.orders) return [];

  return data.customer.orders.edges.map(edge => {
    const node = edge.node;
    const items = (node.lineItems?.edges || []).map(lineEdge => {
      const ln = lineEdge.node;
      return {
        _id: ln.title, // Customer API doesn't always expose variant easily
        productName: ln.title,
        quantity: ln.quantity,
        unitPrice: parseFloat(ln.price?.amount || "0"),
        subtotal: parseFloat(ln.price?.amount || "0") * ln.quantity,
      };
    });

    return {
      _id: node.id,
      orderId: `#${node.number}`,
      createdAt: node.processedAt,
      orderStatus: mapFulfillmentStatus(node.fulfillmentStatus),
      paymentStatus: mapFinancialStatus(node.financialStatus),
      totalAmount: parseFloat(node.totalPrice?.amount || "0"),
      items: items,
    };
  });
}

async function getOrderById(accessToken, orderId) {
  // We query the node directly, or fetch orders and filter. 
  // Node interface is supported in Customer Account API.
  const formattedId = orderId.includes('gid://') ? orderId : `gid://shopify/Order/${orderId}`;
  
  const query = `
    query getOrderById($id: ID!) {
      node(id: $id) {
        ... on Order {
          id
          number
          totalPrice {
            amount
            currencyCode
          }
          financialStatus
          fulfillmentStatus
          processedAt
          shippingAddress {
            firstName
            lastName
            address1
            city
            zoneCode
            country
            zip
            phoneNumber
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await customerAccountClient(query, { id: formattedId }, accessToken);

  const node = data?.node;
  if (!node) return null;

  const items = (node.lineItems?.edges || []).map(lineEdge => {
    const ln = lineEdge.node;
    return {
      _id: ln.title,
      productName: ln.title,
      quantity: ln.quantity,
      unitPrice: parseFloat(ln.price?.amount || "0"),
      subtotal: parseFloat(ln.price?.amount || "0") * ln.quantity,
    };
  });

  const addressSnapshot = node.shippingAddress ? {
    fullName: `${node.shippingAddress.firstName || ''} ${node.shippingAddress.lastName || ''}`.trim(),
    addressLine1: node.shippingAddress.address1,
    city: node.shippingAddress.city,
    state: node.shippingAddress.zoneCode || node.shippingAddress.country,
    pincode: node.shippingAddress.zip,
    phone: node.shippingAddress.phoneNumber,
  } : null;

  return {
    _id: node.id,
    orderId: `#${node.number}`,
    createdAt: node.processedAt,
    orderStatus: mapFulfillmentStatus(node.fulfillmentStatus),
    paymentStatus: mapFinancialStatus(node.financialStatus),
    paymentMethod: 'Shopify Payment', 
    shippingCharge: 0, 
    totalAmount: parseFloat(node.totalPrice?.amount || "0"),
    items: items,
    addressSnapshot: addressSnapshot
  };
}

module.exports = { getOrders, getOrderById };
