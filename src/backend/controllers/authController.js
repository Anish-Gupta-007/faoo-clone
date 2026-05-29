const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');
const { User }    = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail   = require('../utils/sendEmail');
const asyncHandler = require('../middleware/asyncHandler');
const otpStore    = require('../utils/otpStore');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a 6-digit numeric OTP */
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

/** OTP TTL in seconds (10 minutes) */
const OTP_TTL = 600;

const otpHtml = (otp, title) => `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:8px;">
    <h2 style="color:#1a1a1a;margin-bottom:8px;">Faoo — ${title}</h2>
    <p style="color:#555;">Use the OTP below to proceed. It is valid for <strong>10 minutes</strong>.</p>
    <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#111;padding:24px 0;">${otp}</div>
    <p style="color:#999;font-size:13px;">Do not share this code with anyone.</p>
  </div>`;

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc   Register new customer — stores pending data in memory, sends OTP
 * @route  POST /api/v1/auth/register
 * @access PUBLIC
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    res.status(400);
    throw new Error('fullName, email, phone, and password are required');
  }

  // Check for verified existing accounts
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing?.isVerified) {
    res.status(409);
    throw new Error('Email or phone is already registered');
  }
  // Remove stale unverified record so a clean user can be created
  if (existing && !existing.isVerified) {
    await User.deleteOne({ _id: existing._id });
  }

  const otp          = generateOTP();
  const passwordHash = await bcrypt.hash(password, 12);

  // Store registration payload in memory until OTP verified
  otpStore.set(
    `otp:register:${email}`,
    JSON.stringify({ otp, fullName, email, phone, passwordHash }),
    OTP_TTL
  );

  await sendEmail({
    to:      email,
    subject: 'Verify your Faoo account',
    html:    otpHtml(otp, 'Email Verification'),
  });

  res.status(200).json({ success: true, message: 'OTP sent to email' });
});

/**
 * @desc   Verify OTP and complete registration
 * @route  POST /api/v1/auth/verify-otp
 * @access PUBLIC
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Email and OTP are required');
  }

  const raw = otpStore.get(`otp:register:${email}`);
  if (!raw) {
    res.status(400);
    throw new Error('OTP expired or not found. Please register again.');
  }

  const data = JSON.parse(raw);
  if (data.otp !== String(otp)) {
    res.status(400);
    throw new Error('Incorrect OTP');
  }

  // Create the verified user
  const user = await User.create({
    fullName:     data.fullName,
    email:        data.email,
    phone:        data.phone,
    passwordHash: data.passwordHash,
    isVerified:   true,
  });

  otpStore.del(`otp:register:${email}`);

  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken  = refreshToken;
  await user.save();

  res.status(201).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      _id:          user._id,
      fullName:     user.fullName,
      email:        user.email,
      phone:        user.phone,
      role:         user.role,
      isFirstOrder: user.isFirstOrder,
      profileIcon:  user.profileIcon,
    },
  });
});

/**
 * @desc   Login with email + password
 * @route  POST /api/v1/auth/login
 * @access PUBLIC
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).select('+passwordHash +refreshToken');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.isVerified) {
    res.status(403);
    throw new Error('Account not verified. Please complete OTP verification.');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken  = refreshToken;
  await user.save();

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      _id:          user._id,
      fullName:     user.fullName,
      email:        user.email,
      phone:        user.phone,
      role:         user.role,
      isFirstOrder: user.isFirstOrder,
      profileIcon:  user.profileIcon,
    },
  });
});

/**
 * @desc   Get new access token from refresh token
 * @route  POST /api/v1/auth/refresh-token
 * @access PUBLIC
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error('Refresh token is invalid or has been revoked');
  }

  const accessToken = generateAccessToken(user._id);
  res.status(200).json({ success: true, accessToken });
});

/**
 * @desc   Logout — clear refresh token
 * @route  POST /api/v1/auth/logout
 * @access AUTH
 */
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  res.status(200).json({ success: true, message: 'Logged out' });
});

/**
 * @desc   Send forgot-password OTP
 * @route  POST /api/v1/auth/forgot-password
 * @access PUBLIC
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });
  if (user) {
    const otp = generateOTP();
    otpStore.set(`otp:forgot:${email}`, otp, OTP_TTL);
    await sendEmail({
      to:      email,
      subject: 'Faoo — Password Reset OTP',
      html:    otpHtml(otp, 'Password Reset'),
    });
  }
  // Always return 200 to prevent email enumeration
  res.status(200).json({ success: true, message: 'If this email is registered, an OTP has been sent' });
});

/**
 * @desc   Reset password using OTP
 * @route  POST /api/v1/auth/reset-password
 * @access PUBLIC
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('email, otp, and newPassword are required');
  }

  const storedOtp = otpStore.get(`otp:forgot:${email}`);
  if (!storedOtp || storedOtp !== String(otp)) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await User.findOneAndUpdate({ email }, { passwordHash, refreshToken: '' });
  otpStore.del(`otp:forgot:${email}`);

  res.status(200).json({ success: true, message: 'Password reset successful' });
});

module.exports = { register, verifyOtp, login, refreshToken, logout, forgotPassword, resetPassword };
