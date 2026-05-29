const { getStorefrontClient } = require('./client');

async function getAnnouncements() {
  try {
    const query = `
      query GetAnnouncements {
        metaobjects(type: "announcement", first: 20) {
          edges {
            node {
              id
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    const { data, errors } = await getStorefrontClient().request(query);

    if (errors && errors.length) {
      console.error("[Shopify] GraphQL Errors in getAnnouncements:", errors);
      throw new Error(errors[0].message);
    }

    const edges = data?.metaobjects?.edges || [];
    const announcements = edges.map(edge => {
      const node = edge.node;
      const fields = node.fields || [];
      
      const textField = fields.find(f => f.key === 'text');
      const couponField = fields.find(f => f.key === 'coupon_code');
      const activeField = fields.find(f => f.key === 'active');

      return {
        id: node.id,
        text: textField ? textField.value : '',
        couponCode: couponField ? couponField.value : null,
        active: activeField ? activeField.value === 'true' : false
      };
    });

    return announcements.filter(a => a.active === true);
  } catch (err) {
    console.error("[Shopify] Exception in getAnnouncements:", err.message);
    throw err;
  }
}

module.exports = { getAnnouncements };
