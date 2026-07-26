const { getStorefrontClient } = require('./client');

async function createCart(lines) {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    quantityAvailable
                    image {
                      url
                    }
                    product {
                      id
                      title
                      handle
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity
  }));

  const { data, errors } = await getStorefrontClient().request(mutation, {
    variables: {
      input: {
        lines: formattedLines
      }
    }
  });

  if (errors) {
    console.error("[Shopify] cartCreate GraphQL errors:", errors);
    throw new Error(errors.message || "Failed to create cart");
  }

  if (!data || !data.cartCreate) {
    throw new Error("Failed to create cart: Invalid response from Shopify");
  }

  if (data.cartCreate.userErrors && data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = data.cartCreate.cart;
  if (cart && cart.lines) {
    cart.lines = cart.lines.edges.map(edge => edge.node);
  }
  return cart;
}

async function getCart(cartId) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  quantityAvailable
                  image {
                    url
                  }
                  product {
                    id
                    title
                    handle
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
    variables: { cartId }
  });

  if (errors) {
    console.error("[Shopify] getCart GraphQL errors:", errors);
    throw new Error(errors.message || "Failed to get cart");
  }

  const cart = data.cart;
  if (!cart) return null;

  if (cart.lines) {
    cart.lines = cart.lines.edges.map(edge => edge.node);
  }
  return cart;
}

async function addToCart(cartId, lines) {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    quantityAvailable
                    image {
                      url
                    }
                    product {
                      id
                      title
                      handle
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity
  }));

  const { data, errors } = await getStorefrontClient().request(mutation, {
    variables: {
      cartId,
      lines: formattedLines
    }
  });

  if (errors) {
    console.error("[Shopify] cartLinesAdd GraphQL errors:", errors);
    throw new Error(errors.message || "Failed to add to cart");
  }

  if (!data || !data.cartLinesAdd) {
    console.error("[Shopify] cartLinesAdd missing data. Raw response:", { data, errors });
    throw new Error("Failed to add to cart: Invalid response from Shopify");
  }

  if (data.cartLinesAdd.userErrors && data.cartLinesAdd.userErrors.length) {
    console.error("[Shopify] cartLinesAdd userErrors:", data.cartLinesAdd.userErrors);
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  const cart = data.cartLinesAdd.cart;
  if (cart && cart.lines) {
    cart.lines = cart.lines.edges.map(edge => edge.node);
  }

  try {
    if (typeof window !== 'undefined' && typeof window.trackAddToCart === 'function') {
      window.trackAddToCart({ cart });
    }
  } catch (trackingErr) {
    console.error('[Shopify Tracking Error] Failed to track backend cart add:', trackingErr);
  }

  return cart;
}

async function removeFromCart(cartId, lineIds) {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    quantityAvailable
                    image {
                      url
                    }
                    product {
                      id
                      title
                      handle
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await getStorefrontClient().request(mutation, {
    variables: {
      cartId,
      lineIds
    }
  });

  if (errors) {
    console.error("[Shopify] cartLinesRemove GraphQL errors:", errors);
    throw new Error(errors.message || "Failed to remove from cart");
  }

  if (!data || !data.cartLinesRemove) {
    throw new Error("Failed to remove from cart: Invalid response from Shopify");
  }

  if (data.cartLinesRemove.userErrors && data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  const cart = data.cartLinesRemove.cart;
  if (cart && cart.lines) {
    cart.lines = cart.lines.edges.map(edge => edge.node);
  }
  return cart;
}

async function updateCartLine(cartId, lines) {
  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    quantityAvailable
                    image {
                      url
                    }
                    product {
                      id
                      title
                      handle
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    id: line.id,
    quantity: line.quantity
  }));

  const { data, errors } = await getStorefrontClient().request(mutation, {
    variables: {
      cartId,
      lines: formattedLines
    }
  });

  if (errors) {
    console.error("[Shopify] cartLinesUpdate GraphQL errors:", errors);
    throw new Error(errors.message || "Failed to update cart");
  }

  if (!data || !data.cartLinesUpdate) {
    throw new Error("Failed to update cart: Invalid response from Shopify");
  }

  if (data.cartLinesUpdate.userErrors && data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  const cart = data.cartLinesUpdate.cart;
  if (cart && cart.lines) {
    cart.lines = cart.lines.edges.map(edge => edge.node);
  }
  return cart;
}

async function applyDiscountCode(cartId, discountCode) {
  const mutation = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount { amount currencyCode }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const codes = discountCode ? [discountCode] : [];

  const { data, errors } = await getStorefrontClient().request(mutation, {
    variables: { cartId, discountCodes: codes }
  });

  if (errors) throw new Error(errors.message || "Failed to update discount codes");
  if (!data || !data.cartDiscountCodesUpdate) throw new Error("Invalid response from Shopify");
  if (data.cartDiscountCodesUpdate.userErrors.length) {
    throw new Error(data.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return data.cartDiscountCodesUpdate.cart;
}

module.exports = { createCart, getCart, addToCart, removeFromCart, updateCartLine, applyDiscountCode };
