const { getStorefrontClient } = require('./client');

async function getProducts(first = 20, searchQuery = '') {
  const query = `
    query getProducts($first: Int!, $query: String) {
      products(first: $first, query: $query) {
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
  `;

  const { data, errors } = await getStorefrontClient().request(query, {
    variables: { 
      first: parseInt(first, 10) || 20,
      query: searchQuery || null
    }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  return data.products.edges.map(edge => {
    const node = edge.node;
    if (node.images) {
      node.images = node.images.edges.map(imgEdge => imgEdge.node);
    }
    if (node.variants) {
      node.variants = node.variants.edges.map(varEdge => varEdge.node);
    }
    return node;
  });
}

async function getProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
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
        metafields(identifiers: [
          { namespace: "custom", key: "focus_with_faoo" },
          { namespace: "custom", key: "focus_titles" },
          { namespace: "custom", key: "irl_images" },
          { namespace: "custom", key: "irl_handles" },
          { namespace: "custom", key: "fit_type" },
          { namespace: "custom", key: "usp" }
        ]) {
          namespace
          key
          value
          type
          references(first: 10) {
            edges {
              node {
                ... on MediaImage {
                  image {
                    url
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

  const { data, errors } = await getStorefrontClient().request(query, {
    variables: { handle }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  const node = data.product;
  if (!node) return null;
  
  if (node.images) {
    node.images = node.images.edges.map(imgEdge => imgEdge.node);
  }
  if (node.variants) {
    node.variants = node.variants.edges.map(varEdge => varEdge.node);
  }
  return node;
}

async function getProductsByIds(ids) {
  if (!ids || !ids.length) return [];
  
  const query = `
    query getProductsByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
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
  `;

  const { data, errors } = await getStorefrontClient().request(query, {
    variables: { ids }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  return (data.nodes || [])
    .filter(Boolean)
    .map(node => {
      if (node.images) {
        node.images = node.images.edges.map(imgEdge => imgEdge.node);
      }
      if (node.variants) {
        node.variants = node.variants.edges.map(varEdge => varEdge.node);
      }
      return node;
    });
}

module.exports = { getProducts, getProductByHandle, getProductsByIds };
