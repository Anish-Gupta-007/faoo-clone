const { getStorefrontClient } = require('./client');

async function getBlogs(first = 20) {
  const query = `
    query getBlogs($first: Int!) {
      metaobjects(type: "blogs", first: $first) {
        edges {
          node {
            handle
            type
            fields {
              key
              value
              reference {
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
    variables: { first: parseInt(first, 10) || 20 }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  const edges = data?.metaobjects?.edges || [];
  return edges.map(edge => edge.node);
}

async function getBlogByHandle(handle) {
  const query = `
    query getBlogByHandle($handle: String!) {
      metaobject(handle: { handle: $handle, type: "blogs" }) {
        handle
        type
        fields {
          key
          value
          reference {
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
  `;

  const { data, errors } = await getStorefrontClient().request(query, {
    variables: { handle }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  return data?.metaobject || null;
}

module.exports = { getBlogs, getBlogByHandle };
