import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendWelcomeEmail } from '../utils/emailService.js';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // Extended to 30 days
};

// Register new user
export const registerUser = async (req, res) => {
  const { email, password, firstName, lastName, company } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user with 7-day trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days free trial

    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      company: company || '',
      subscriptionStatus: 'trial',
      trialEndsAt: trialEndDate,
      isEmailVerified: false // In production, you'd send verification email
    });

    await user.save();

    // Send welcome email (optional - can be disabled if email not configured)
    try {
      await sendWelcomeEmail(user.email, user.firstName || 'User');
    } catch (emailError) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Welcome email not sent:', emailError.message);
      }
      // Don't fail registration if email fails
    }

    // Generate token and respond
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt: user.trialEndsAt,
      token,
      message: 'Registration successful! You have a 7-day free trial.'
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Registration Error:", error);
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      // Update last login
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();

      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        subscriptionStatus: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Login Error:", error);
    }
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('currentPlan', 'displayName features')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      subscriptionStatus: user.subscriptionStatus,
      currentPlan: user.currentPlan,
      trialEndsAt: user.trialEndsAt,
      usage: user.usage,
      preferences: user.preferences,
      createdAt: user.createdAt
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Get Profile Error:", error);
    }
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, company, preferences } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (company !== undefined) user.company = company;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        preferences: user.preferences
      }
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Update Profile Error:", error);
    }
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
