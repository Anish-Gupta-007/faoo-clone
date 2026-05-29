const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { generateToken } = require('../utils/generateToken');

// Using the credentials provided by user
const SHOPIFY_CLIENT_ID = '8441b665-2ff0-4000-a4ed-4f3ab98d2198';
const SHOPIFY_AUTH_URL = 'https://shopify.com/authentication/100271948085/oauth/authorize';
const SHOPIFY_TOKEN_URL = 'https://shopify.com/authentication/100271948085/oauth/token';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const REDIRECT_URI = `${BACKEND_URL}/api/v1/auth/shopify/callback`;

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

/**
 * @desc   Redirect to Shopify Hosted Login (OAuth 2.0 PKCE)
 * @route  GET /api/v1/auth/shopify/authorize
 * @access PUBLIC
 */
const authorize = asyncHandler(async (req, res) => {
  // Generate PKCE code_verifier and code_challenge
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(codeVerifier));
  
  // Generate state for CSRF protection
  const state = base64URLEncode(crypto.randomBytes(16));

  // Set cookies for validation in callback
  res.cookie('shopify_oauth_state', state, { httpOnly: true, maxAge: 1000 * 60 * 10 }); // 10 minutes
  res.cookie('shopify_code_verifier', codeVerifier, { httpOnly: true, maxAge: 1000 * 60 * 10 });

  // Construct Shopify Authorize URL
  const authUrl = new URL(SHOPIFY_AUTH_URL);
  authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', 'openid email https://api.customers.com/auth/customer.graphql');
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
});

/**
 * @desc   Shopify OAuth Callback
 * @route  GET /api/v1/auth/shopify/callback
 * @access PUBLIC
 */
const callback = asyncHandler(async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(error_description || error)}`);
  }

  // Validate state
  const savedState = req.cookies.shopify_oauth_state;
  if (!state || state !== savedState) {
    return res.redirect(`${FRONTEND_URL}/login?error=InvalidState`);
  }

  const codeVerifier = req.cookies.shopify_code_verifier;
  if (!codeVerifier) {
    return res.redirect(`${FRONTEND_URL}/login?error=MissingVerifier`);
  }

  // Clear cookies
  res.clearCookie('shopify_oauth_state');
  res.clearCookie('shopify_code_verifier');

  // Exchange code for token
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: SHOPIFY_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier
  });

  const tokenResponse = await fetch(SHOPIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    console.error('Token exchange failed:', errText);
    return res.redirect(`${FRONTEND_URL}/login?error=TokenExchangeFailed`);
  }

  const tokenData = await tokenResponse.json();
  const { access_token, refresh_token, id_token, expires_in } = tokenData;

  // We need to extract user email from id_token (it's a JWT)
  let email, sub;
  if (id_token) {
    const decodedIdToken = jwt.decode(id_token);
    email = decodedIdToken.email || decodedIdToken.sub;
    sub = decodedIdToken.sub; // subject identifier
  }

  if (!email) {
    // If id_token doesn't have email, we could query customer account api
    // But typically openid scope returns id_token with email
    const customerReq = await fetch('https://shopify.com/100271948085/account/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        query: `query { customer { id emailAddress { emailAddress } firstName lastName } }`
      })
    });
    const customerData = await customerReq.json();
    email = customerData?.data?.customer?.emailAddress?.emailAddress;
    
    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=EmailNotFound`);
    }
  }

  // Sync with local User DB
  let user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    user = await User.create({
      fullName: 'Shopify Customer',
      email: email.toLowerCase(),
      phone: '0000000000', // placeholder
      passwordHash: 'oauth_managed',
      isVerified: true,
      shopifyAccessToken: access_token,
      shopifyRefreshToken: refresh_token,
      shopifyCustomerId: sub || ''
    });
  } else {
    user.shopifyAccessToken = access_token;
    user.shopifyRefreshToken = refresh_token;
    user.shopifyCustomerId = sub || user.shopifyCustomerId;
    await user.save();
  }

  // Generate standard backend JWT
  const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } = generateToken(user._id);
  user.refreshToken = jwtRefreshToken;
  await user.save();

  // Redirect to frontend and pass tokens (can be in url hash or secure cookie)
  // Standard OAuth pattern: pass via URL fragments or redirect to a special frontend route that consumes them.
  // We'll use a short-lived query param or a redirect to a specialized /auth-success page on frontend.
  const redirectUrl = new URL(`${FRONTEND_URL}/auth-success`);
  redirectUrl.searchParams.append('accessToken', jwtAccessToken);
  redirectUrl.searchParams.append('refreshToken', jwtRefreshToken);
  
  res.redirect(redirectUrl.toString());
});

module.exports = { authorize, callback };
