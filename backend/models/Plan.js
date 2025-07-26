import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  price: { type: Number, required: true }, // in cents
  currency: { type: String, default: 'usd' },
  interval: { type: String, enum: ['month', 'year'], default: 'month' },
  features: {
    maxLinks: { type: Number, default: 100 },
    maxClicks: { type: Number, default: 1000 },
    customDomain: { type: Boolean, default: false },
    analytics: { type: String, enum: ['basic', 'advanced', 'enterprise'], default: 'basic' },
    apiAccess: { type: Boolean, default: false },
    teamMembers: { type: Number, default: 1 },
    passwordProtection: { type: Boolean, default: false },
    linkExpiration: { type: Boolean, default: false },
    customBranding: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
