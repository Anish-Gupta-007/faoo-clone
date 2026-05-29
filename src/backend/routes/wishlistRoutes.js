const express = require('express');
const router  = express.Router();
const { getWishlist, toggleWishlist, removeFromWishlist } =
  require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/',                  getWishlist);
router.post('/:productId',       toggleWishlist);
router.delete('/:productId',     removeFromWishlist);

module.exports = router;
