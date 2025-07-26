// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  company: { type: String },
  phone: { type: String },
  
  // Subscription Info
  currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  subscriptionStatus: { 
    type: String, 
    enum: ['free', 'trial', 'active', 'expired', 'cancelled'], 
    default: 'free' 
  },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  trialEndsAt: { type: Date },
  
  // Usage Tracking
  usage: {
    linksCreated: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    currentMonthLinks: { type: Number, default: 0 },
    currentMonthClicks: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  
  // Settings
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    analyticsEmails: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    defaultLinkExpiry: { type: Number }, // in days
    timezone: { type: String, default: 'Asia/Kolkata' }
  },
  
  // Profile
  avatar: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  
  // Security
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user can create more links
userSchema.methods.canCreateLink = async function() {
  const Plan = mongoose.model('Plan');
  const currentPlan = await Plan.findById(this.currentPlan);
  
  if (!currentPlan) return this.usage.currentMonthLinks < 10; // Free tier limit
  
  return this.usage.currentMonthLinks < currentPlan.features.maxLinks;
};

// Method to get user's plan limits
userSchema.methods.getPlanLimits = async function() {
  const Plan = mongoose.model('Plan');
  const currentPlan = await Plan.findById(this.currentPlan);
  
  if (!currentPlan) {
    return {
      maxLinks: 10,
      maxClicks: 100,
      customDomain: false,
      analytics: 'basic',
      apiAccess: false
    };
  }
  
  return currentPlan.features;
};

const User = mongoose.model('User', userSchema);
export default User;
