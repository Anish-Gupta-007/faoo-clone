const express = require('express');
const router  = express.Router();
const { getProfile, updateProfile, getAddresses, addAddress,
        updateAddress, deleteAddress, setDefaultAddress, getShopifyOrders } =
  require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // All user routes require auth

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

router.put('/addresses/:addressId/set-default', setDefaultAddress);

router.get('/shopify-orders', getShopifyOrders);

module.exports = router;
