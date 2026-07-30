const { getStorefrontClient } = require('./src/backend/services/shopify/client');

async function test() {
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
        const res = await getStorefrontClient().request(query);
        console.log(JSON.stringify(res, null, 2));
    } catch(e) {
        console.error(e);
    }
}

test();
