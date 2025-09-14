const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes below this will be protected

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/resend-verification', resendVerification);

module.exports = router;