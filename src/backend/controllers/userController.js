const { User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { 
  getCustomer, 
  updateCustomerProfile, 
  customerAddressCreate, 
  customerAddressUpdate, 
  customerAddressDelete, 
  customerDefaultAddressUpdate 
} = require('../services/shopify/customers');

/**
 * Helper to map Shopify address to frontend Address format
 */
function mapShopifyAddress(shopifyAddr, defaultAddressId) {
  if (!shopifyAddr) return null;
  return {
    _id: shopifyAddr.id,
    fullName: `${shopifyAddr.firstName || ''} ${shopifyAddr.lastName || ''}`.trim(),
    phone: shopifyAddr.phone || '',
    addressLine1: shopifyAddr.address1 || '',
    addressLine2: shopifyAddr.address2 || '',
    city: shopifyAddr.city || '',
    state: shopifyAddr.province || '',
    pincode: shopifyAddr.zip || '',
    country: shopifyAddr.country || 'India',
    isDefault: shopifyAddr.id === defaultAddressId
  };
}

/**
 * @desc   Get logged-in user profile
 * @route  GET /api/v1/user/profile
 * @access AUTH
 */
const getProfile = asyncHandler(async (req, res) => {
  const localUser = req.user;
  let shopifyCustomer = null;

  if (localUser.shopifyAccessToken) {
    try {
      shopifyCustomer = await getCustomer(localUser.shopifyAccessToken);
    } catch (err) {
      console.warn("Failed to fetch shopify customer:", err.message);
    }
  }
  
  if (!shopifyCustomer) {
    return res.status(200).json({ success: true, user: localUser });
  }

  const user = {
    _id: localUser._id,
    fullName: `${shopifyCustomer.firstName || ''} ${shopifyCustomer.lastName || ''}`.trim() || localUser.fullName,
    email: shopifyCustomer.email || localUser.email,
    phone: shopifyCustomer.phone || localUser.phone,
    profileIcon: localUser.profileIcon,
    role: localUser.role,
    isVerified: localUser.isVerified,
    isFirstOrder: localUser.isFirstOrder,
    wishlist: localUser.wishlist,
    createdAt: localUser.createdAt,
    shopifyCustomerId: shopifyCustomer.id
  };

  res.status(200).json({ success: true, user });
});

/**
 * @desc   Update profile (fullName, phone, profileIcon)
 * @route  PUT /api/v1/user/profile
 * @access AUTH
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, profileIcon } = req.body;
  const localUser = req.user;
  
  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;
  if (profileIcon !== undefined) updates.profileIcon = profileIcon;

  const updatedLocalUser = await User.findByIdAndUpdate(
    localUser._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-passwordHash -refreshToken');

  if (localUser.shopifyAccessToken) {
    const names = (fullName || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    
    try {
      await updateCustomerProfile(localUser.shopifyAccessToken, {
        firstName,
        lastName,
        phone
      });
    } catch (err) {
      console.warn("Shopify update failed", err.message);
    }
  }

  res.status(200).json({ success: true, user: updatedLocalUser });
});

/**
 * @desc   Get all saved addresses for the logged-in user
 * @route  GET /api/v1/user/addresses
 * @access AUTH
 */
const getAddresses = asyncHandler(async (req, res) => {
  const localUser = req.user;
  let shopifyCustomer = null;

  if (localUser.shopifyAccessToken) {
    try {
      shopifyCustomer = await getCustomer(localUser.shopifyAccessToken);
    } catch (err) {
      console.warn("Failed to fetch shopify customer:", err.message);
    }
  }

  if (!shopifyCustomer) {
    return res.status(200).json({ success: true, addresses: [] });
  }

  const defaultId = shopifyCustomer.defaultAddress?.id;
  const addresses = (shopifyCustomer.addresses || []).map(addr => mapShopifyAddress(addr, defaultId));
  
  addresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  res.status(200).json({ success: true, addresses });
});

/**
 * @desc   Add a new address
 * @route  POST /api/v1/user/addresses
 * @access AUTH
 */
const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    res.status(400);
    throw new Error('fullName, phone, addressLine1, city, state, and pincode are required');
  }

  const localUser = req.user;
  if (!localUser.shopifyAccessToken) {
    res.status(400);
    throw new Error('Not linked to Shopify');
  }

  const names = fullName.split(' ');
  const addressInput = {
    firstName: names[0] || '',
    lastName: names.slice(1).join(' ') || '',
    phone,
    address1: addressLine1,
    address2: addressLine2 || '',
    city,
    province: state,
    country: country || 'India',
    zip: pincode
  };

  const newAddress = await customerAddressCreate(localUser.shopifyAccessToken, addressInput);
  
  if (isDefault) {
    await customerDefaultAddressUpdate(localUser.shopifyAccessToken, newAddress.id);
  }

  res.status(201).json({ success: true, address: mapShopifyAddress(newAddress, isDefault ? newAddress.id : null) });
});

/**
 * @desc   Update an address
 * @route  PUT /api/v1/user/addresses/:addressId
 * @access AUTH
 */
const updateAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;
  const addressId = req.params.addressId;
  const localUser = req.user;

  if (!localUser.shopifyAccessToken) {
    res.status(400);
    throw new Error('Not linked to Shopify');
  }

  const addressInput = {};
  if (fullName) {
    const names = fullName.split(' ');
    addressInput.firstName = names[0] || '';
    addressInput.lastName = names.slice(1).join(' ') || '';
  }
  if (phone !== undefined) addressInput.phone = phone;
  if (addressLine1 !== undefined) addressInput.address1 = addressLine1;
  if (addressLine2 !== undefined) addressInput.address2 = addressLine2;
  if (city !== undefined) addressInput.city = city;
  if (state !== undefined) addressInput.province = state;
  if (pincode !== undefined) addressInput.zip = pincode;
  if (country !== undefined) addressInput.country = country;

  const updatedAddress = await customerAddressUpdate(localUser.shopifyAccessToken, addressId, addressInput);

  if (isDefault) {
    await customerDefaultAddressUpdate(localUser.shopifyAccessToken, updatedAddress.id);
  }

  const customer = await getCustomer(localUser.shopifyAccessToken);

  res.status(200).json({ success: true, address: mapShopifyAddress(updatedAddress, isDefault ? updatedAddress.id : customer?.defaultAddress?.id) });
});

/**
 * @desc   Delete an address
 * @route  DELETE /api/v1/user/addresses/:addressId
 * @access AUTH
 */
const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId;
  const localUser = req.user;

  if (!localUser.shopifyAccessToken) {
    res.status(400);
    throw new Error('Not linked to Shopify');
  }

  await customerAddressDelete(localUser.shopifyAccessToken, addressId);
  res.status(200).json({ success: true, message: 'Address deleted' });
});

/**
 * @desc   Set an address as the default
 * @route  PUT /api/v1/user/addresses/:addressId/set-default
 * @access AUTH
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId;
  const localUser = req.user;

  if (!localUser.shopifyAccessToken) {
    res.status(400);
    throw new Error('Not linked to Shopify');
  }

  await customerDefaultAddressUpdate(localUser.shopifyAccessToken, addressId);
  res.status(200).json({ success: true, message: 'Default address updated' });
});

module.exports = { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
