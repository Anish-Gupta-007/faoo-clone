const { getStorefrontClient } = require('./client');

async function getCollections(first = 20) {
  try {
    const query = `
      query getCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              image {
                url
                altText
              }
            }
          }
        }
      }
    `;

    const { data, errors } = await getStorefrontClient().request(query, {
      variables: { first: parseInt(first, 10) || 20 }
    });

    if (errors && errors.length) {
      throw new Error(errors[0].message);
    }

    const collections = data.collections.edges.map(edge => edge.node);
    return collections;
  } catch (err) {
    throw err;
  }
}

async function getCollectionByHandle(handle) {
  try {
    const query = `
      query getCollectionByHandle($handle: String!) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                tags
                description
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      quantityAvailable
                      selectedOptions {
                        name
                        value
                      }
                      price {
                        amount
                        currencyCode
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

    const { data, errors } = await getStorefrontClient().request(query, {
      variables: { handle }
    });

    if (errors && errors.length) {
      throw new Error(errors[0].message);
    }

    const node = data.collection;
    if (!node) {
      return null;
    }
    
    if (node.products) {
      node.products = node.products.edges.map(prodEdge => {
        const prod = prodEdge.node;
        if (prod.images) {
          prod.images = prod.images.edges.map(imgEdge => imgEdge.node);
        }
        if (prod.variants) {
          prod.variants = prod.variants.edges.map(varEdge => varEdge.node);
        }
        return prod;
      });
    }

    return node;
  } catch (err) {
    throw err;
  }
}

module.exports = { getCollections, getCollectionByHandle };
