const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    sendForgotPasswordOtp, 
    verifyOtpAndResetPassword, 
    updateProfile, 
    registerInitialAdmin 
} = require('../controllers/authController');
const verifyAdminToken = require('../middleware/auth');

router.post('/login', loginAdmin);
router.post('/send-otp', sendForgotPasswordOtp);
router.post('/verify-reset', verifyOtpAndResetPassword);
router.put('/profile', verifyAdminToken, updateProfile);
router.post('/seed-admin', registerInitialAdmin);

module.exports = router;