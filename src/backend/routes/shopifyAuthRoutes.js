const express = require('express');
const router  = express.Router();
const { authorize, callback } = require('../controllers/shopifyAuthController');

router.get('/authorize', authorize);
router.get('/callback', callback);

module.exports = router;
