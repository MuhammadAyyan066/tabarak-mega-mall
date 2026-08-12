const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Email Transporter Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt for username:", username); // Check karne ke liye

        const user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user) {
            console.log("User not found in DB!");
            return res.status(400).json({ message: 'Invalid Username or Password!' });
        }

        const isMatch = await user.comparePassword(password);
        console.log("Password match status:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Username or Password!' });
        }
        
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(200).json({
            message: 'Login Successful',
            token,
            user: { fullName: user.fullName, username: user.username, email: user.email, phone: user.phone }
        });
    } catch (err) {
        console.error("CRITICAL LOGIN ERROR:", err); // Asal error yahan terminal par print hoga
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Send OTP to Email
exports.sendForgotPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No admin registered with this email address!' });
        }

        // Generate 6 Digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        await user.save();

        // Send Email
        const mailOptions = {
            from: `"Tabarak Mega Mall Security" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset OTP Code - Tabarak Mega Mall',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2>Password Reset Request</h2>
                    <p>Your 6-digit OTP security code is:</p>
                    <h1 style="color: #059669; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP verification code sent to your email successfully!' });

    } catch (err) {
        res.status(500).json({ message: 'Email sending failed!', error: err.message });
    }
};

// Verify OTP & Reset Password
exports.verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ 
            email, 
            resetOtp: otp, 
            resetOtpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or Expired OTP code!' });
        }

        user.password = newPassword;
        user.resetOtp = null;
        user.resetOtpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully! You can now login.' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};

// Update Profile Details
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, phone, username } = req.body;
        const user = await User.findById(req.admin.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.username = username || user.username;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully!', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};

// Seed Initial Admin
exports.registerInitialAdmin = async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            return res.status(200).json({ message: 'Admin account already exists!' });
        }

        const newAdmin = new User({
            fullName: 'Muhammad Ayyan',
            username: 'admin',
            email: 'admin@tabarak.com',
            password: 'tabarak123',
            phone: '03001234567'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Default Admin Account Created Successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};