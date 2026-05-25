const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If account exists but is not verified, resend a fresh OTP
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        existingUser.otp = await bcrypt.hash(otp, 12);
        existingUser.otpExpiry = Date.now() + 10 * 60 * 1000;
        await existingUser.save();

        await sendEmail({
          email: existingUser.email,
          subject: 'CampusConnect Verification OTP',
          html: `<h1>Welcome to CampusConnect!</h1><p>Your verification OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`
        });

        return res.status(200).json({ message: 'OTP sent to email' });
      }
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 12);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.create({
      name, email, password: hashedPassword, role, department, otp: hashedOtp, otpExpiry
    });

    await sendEmail({
      email: user.email,
      subject: 'CampusConnect Verification OTP',
      html: `<h1>Welcome to CampusConnect!</h1><p>Your verification OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`
    });

    res.status(201).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select('+otp');
    
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid request or OTP expired' });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signToken(user._id, user.role, user.email);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 12);
      user.otp = hashedOtp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendEmail({
        email: user.email,
        subject: 'CampusConnect Verification OTP',
        html: `<p>Your new verification OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`
      });

      return res.status(403).json({ message: 'Account not verified. New OTP sent to email', requireOtp: true });
    }

    const token = signToken(user._id, user.role, user.email);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 12);
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      html: `<p>Your password reset OTP is <b>${otp}</b>.</p>`
    });
    res.status(200).json({ message: 'Reset OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+otp');

    if (!user || !user.otp || user.otpExpiry < Date.now() || !(await bcrypt.compare(otp, user.otp))) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
