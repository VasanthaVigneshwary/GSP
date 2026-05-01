const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    body('name', 'Name is required').trim().isLength({ min: 2, max: 50 }),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('passwordConfirm', 'Password confirmation is required').isLength({ min: 6 }),
    body('department', 'Department is required').notEmpty(),
    body('year', 'Year is required').notEmpty(),
  ],
  authController.signup
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists(),
  ],
  authController.login
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', authController.refreshToken);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getCurrentUser);

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', protect, authController.updateProfile);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', protect, authController.logout);

module.exports = router;
