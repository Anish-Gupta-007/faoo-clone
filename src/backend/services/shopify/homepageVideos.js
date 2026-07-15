const { getStorefrontClient } = require('./client');

async function getHomepageVideos() {
  try {
    const query = `
      query GetVideos {
        metaobjects(type: "homepage_video", first: 20) {
          edges {
            node {
              id
              fields {
                key
                value
                reference {
                  ... on MediaImage {
                    image {
                      url
                    }
                  }
                  ... on Video {
                    sources {
                      url
                      format
                    }
                  }
                  ... on GenericFile {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `;

    const { data, errors } = await getStorefrontClient().request(query);

    if (errors && errors.length) {
      console.error("[Shopify] GraphQL Errors in getHomepageVideos:", errors);
      throw new Error(errors[0].message);
    }

    const edges = data?.metaobjects?.edges || [];
    const videos = edges.map(edge => {
      const node = edge.node;
      const fields = node.fields || [];
      
      const videoField = fields.find(f => f.key === 'video');
      const productNameField = fields.find(f => f.key === 'product_name');

      let videoUrl = '';
      if (videoField && videoField.reference) {
          if (videoField.reference.sources) {
              const mp4 = videoField.reference.sources.find(s => s.format === 'mp4');
              videoUrl = mp4 ? mp4.url : videoField.reference.sources[0].url;
          } else if (videoField.reference.url) {
              videoUrl = videoField.reference.url;
          }
      }

      return {
        id: node.id,
        videoUrl: videoUrl,
        productName: productNameField ? productNameField.value : 'Product'
      };
    });

    return videos;
  } catch (err) {
    console.error("[Shopify] Exception in getHomepageVideos:", err.message);
    throw err;
  }
}

module.exports = { getHomepageVideos };
