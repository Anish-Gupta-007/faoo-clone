const { getAdminClient } = require('./client');

/**
 * Looks up a Shopify order by its name (e.g. #1001).
 * @param {string} orderName - The name or number of the order.
 * @returns {Promise<object|null>} The mapped order details or null if not found.
 */
async function getOrderByName(orderName) {
  if (!orderName) {
    return null;
  }

  // Normalize orderName: if it doesn't start with "#", add "#" prefix
  const normalizedName = orderName.startsWith('#') ? orderName : `#${orderName}`;

  const query = `
    query GetOrderByName($query: String!) {
      orders(first: 1, query: $query) {
        edges {
          node {
            id
            name
            createdAt
            fulfillmentStatus
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    price
                    image {
                      url
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

  const { data, errors } = await getAdminClient().request(query, {
    variables: { query: `name:${normalizedName}` }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  const edges = data?.orders?.edges || [];
  if (edges.length === 0) {
    return null;
  }

  const order = edges[0].node;

  return {
    orderId: order.name,
    orderStatus: order.fulfillmentStatus || 'Unfulfilled',
    createdAt: order.createdAt,
    items: order.lineItems.edges.map(edge => ({
      productName: edge.node.title,
      size: edge.node.variant?.title || 'N/A',
      productId: {
        media: [{ url: edge.node.variant?.image?.url || '' }]
      },
      quantity: edge.node.quantity
    }))
  };
}

module.exports = { getOrderByName };
