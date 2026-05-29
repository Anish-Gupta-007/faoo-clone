const { getAdminClient } = require('./client');

async function createReturn(orderId, lineItems) {
  const mutation = `
    mutation returnCreate($returnInput: ReturnInput!) {
      returnCreate(returnInput: $returnInput) {
        return {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const returnLineItems = lineItems.map(item => ({
    fulfillmentLineItemId: item.fulfillmentLineItemId,
    quantity: item.quantity,
    returnReason: item.returnReason,
    customerNote: item.customerNote
  }));

  const { data, errors } = await getAdminClient().request(mutation, {
    variables: {
      returnInput: {
        orderId,
        returnLineItems
      }
    }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  if (data.returnCreate.userErrors.length) {
    throw new Error(data.returnCreate.userErrors[0].message);
  }

  return data.returnCreate.return;
}

async function getReturnById(returnId) {
  const query = `
    query getReturnById($id: ID!) {
      return(id: $id) {
        id
        status
        refunds {
          id
          totalRefundedSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await getAdminClient().request(query, {
    variables: { id: returnId }
  });

  if (errors && errors.length) {
    throw new Error(errors[0].message);
  }

  return data.return;
}

module.exports = { createReturn, getReturnById };
