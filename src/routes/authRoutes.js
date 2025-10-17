const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failure' }),
  authController.googleCallback
);

router.get('/google/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth/google?error=auth_failed`);
});

// Get current user (protected route)
router.get('/me', authenticateJWT, authController.getMe);

module.exports = router;
