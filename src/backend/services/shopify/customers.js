const { customerAccountClient } = require('./client');

async function getCustomer(accessToken) {
  const query = `
    query {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          id
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              zoneCode
              country
              zip
              phoneNumber
            }
          }
        }
      }
    }
  `;

  const { data } = await customerAccountClient(query, {}, accessToken);
  if (!data?.customer) return null;

  // Map to the shape our controller expects
  const customer = data.customer;
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.emailAddress?.emailAddress,
    phone: customer.phoneNumber?.phoneNumber,
    defaultAddress: customer.defaultAddress,
    addresses: customer.addresses?.edges?.map(edge => {
      const node = edge.node;
      return {
        id: node.id,
        firstName: node.firstName,
        lastName: node.lastName,
        address1: node.address1,
        address2: node.address2,
        city: node.city,
        province: node.zoneCode, // zoneCode maps to province
        country: node.country,
        zip: node.zip,
        phone: node.phoneNumber
      };
    }) || []
  };
}

async function updateCustomerProfile(accessToken, { firstName, lastName, phone }) {
  const mutation = `
    mutation customerUpdate($customer: CustomerUpdateInput!) {
      customerUpdate(input: $customer) {
        customer {
          id
          firstName
          lastName
          phoneNumber {
            phoneNumber
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await customerAccountClient(mutation, {
    customer: {
      firstName,
      lastName,
      // Cannot easily update phone number via customerAccount API without SMS verification, omitting phone for safety unless explicitly needed by API
    }
  }, accessToken);

  if (data.customerUpdate?.userErrors?.length) {
    throw new Error(data.customerUpdate.userErrors[0].message);
  }

  return data.customerUpdate.customer;
}

async function customerAddressCreate(accessToken, addressInput) {
  const mutation = `
    mutation customerAddressCreate($address: CustomerAddressInput!) {
      customerAddressCreate(address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          zoneCode
          country
          zip
          phoneNumber
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Map address input to CustomerAccount API format
  const mappedAddress = {
    firstName: addressInput.firstName,
    lastName: addressInput.lastName,
    address1: addressInput.address1,
    address2: addressInput.address2,
    city: addressInput.city,
    zoneCode: addressInput.province,
    territoryCode: 'IN', // Assuming India, Customer Account API uses territoryCode instead of country
    zip: addressInput.zip,
    phoneNumber: addressInput.phone
  };

  const { data } = await customerAccountClient(mutation, {
    address: mappedAddress
  }, accessToken);

  if (data.customerAddressCreate?.userErrors?.length) {
    throw new Error(data.customerAddressCreate.userErrors[0].message);
  }

  const node = data.customerAddressCreate.customerAddress;
  return {
    id: node.id,
    firstName: node.firstName,
    lastName: node.lastName,
    address1: node.address1,
    address2: node.address2,
    city: node.city,
    province: node.zoneCode,
    country: node.country,
    zip: node.zip,
    phone: node.phoneNumber
  };
}

async function customerAddressUpdate(accessToken, addressId, addressInput) {
  const mutation = `
    mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
      customerAddressUpdate(addressId: $addressId, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          zoneCode
          country
          zip
          phoneNumber
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const mappedAddress = {
    firstName: addressInput.firstName,
    lastName: addressInput.lastName,
    address1: addressInput.address1,
    address2: addressInput.address2,
    city: addressInput.city,
    zoneCode: addressInput.province,
    territoryCode: 'IN',
    zip: addressInput.zip,
    phoneNumber: addressInput.phone
  };

  // Ensure ID format
  const formattedId = addressId.includes('gid://') ? addressId : `gid://shopify/CustomerAddress/${addressId}`;

  const { data } = await customerAccountClient(mutation, {
    addressId: formattedId,
    address: mappedAddress
  }, accessToken);

  if (data.customerAddressUpdate?.userErrors?.length) {
    throw new Error(data.customerAddressUpdate.userErrors[0].message);
  }

  const node = data.customerAddressUpdate.customerAddress;
  return {
    id: node.id,
    firstName: node.firstName,
    lastName: node.lastName,
    address1: node.address1,
    address2: node.address2,
    city: node.city,
    province: node.zoneCode,
    country: node.country,
    zip: node.zip,
    phone: node.phoneNumber
  };
}

async function customerAddressDelete(accessToken, addressId) {
  const mutation = `
    mutation customerAddressDelete($addressId: ID!) {
      customerAddressDelete(addressId: $addressId) {
        deletedAddressId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedId = addressId.includes('gid://') ? addressId : `gid://shopify/CustomerAddress/${addressId}`;

  const { data } = await customerAccountClient(mutation, {
    addressId: formattedId
  }, accessToken);

  if (data.customerAddressDelete?.userErrors?.length) {
    throw new Error(data.customerAddressDelete.userErrors[0].message);
  }

  return true;
}

async function customerDefaultAddressUpdate(accessToken, addressId) {
  const mutation = `
    mutation customerDefaultAddressUpdate($addressId: ID!) {
      customerDefaultAddressUpdate(addressId: $addressId) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedId = addressId.includes('gid://') ? addressId : `gid://shopify/CustomerAddress/${addressId}`;

  const { data } = await customerAccountClient(mutation, {
    addressId: formattedId
  }, accessToken);

  if (data.customerDefaultAddressUpdate?.userErrors?.length) {
    throw new Error(data.customerDefaultAddressUpdate.userErrors[0].message);
  }

  return true;
}

module.exports = {
  getCustomer,
  updateCustomerProfile,
  customerAddressCreate,
  customerAddressUpdate,
  customerAddressDelete,
  customerDefaultAddressUpdate
};
