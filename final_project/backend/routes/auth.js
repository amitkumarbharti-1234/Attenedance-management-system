const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(Date.now());
        // console.log(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verified: false,
            verificationCode,
            verificationCodeExpires: Date.now() + (60 * 60 * 1000)
        });

        console.log(Date.now());
        console.log('👤 New user created:', user);

        await user.save();

        console.log(`📧 Sending verification email to ${email}...`);
        await sendEmail(user.email, 'Verify Your Email', `Your verification code is: ${verificationCode}`);
        console.log('✅ Email sent!');

        // res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.',  User: user });
        res.status(201).json({user: user});

    } catch (error) {
        console.error('❌ Error in register route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/verify-email', async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'User is already verified. Please log in.' });
        }

        // Convert incoming verificationCode to number for comparison.
        const numericCode = Number(verificationCode);
        if (user.verificationCode !== numericCode || Date.now() > user.verificationCodeExpires) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        user.verified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        console.log(`✅ User ${email} verified successfully!`);

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: 'Email verified successfully!', token, user });

    } catch (error) {
        console.error('❌ Error in verify-email route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate OTP
        // Skip OTP and return token + role
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

res.status(200).json({
    message: 'Login successful',
    token,
    role: user.role
});


    } catch (error) {
        console.error('❌ Error in login route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.post('/verify-login-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Convert incoming otp to number for comparison.
        const numericOTP = Number(otp);

        if (!user.verificationCode || user.verificationCode !== numericOTP || Date.now() > user.verificationCodeExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Clear OTP after successful verification
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Determine dashboard redirection
        let dashboardUrl = '';
        if (user.role === 'teacher') {
            dashboardUrl = '/teacher-dashboard';
        } else if (user.role === 'student') {
            dashboardUrl = '/student-dashboard';
        }

        res.json({ message: 'Login successful', token, dashboardUrl });

    } catch (error) {
        console.error('❌ Error in verify-login-otp route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
