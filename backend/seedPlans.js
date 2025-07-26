import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/Plan.js';
import User from './models/User.js';
import connectDB from './utils/db.js';

dotenv.config();

const seedPlans = async () => {
  try {
    await connectDB();

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Create plans
    const plans = [
      {
        name: 'free',
        displayName: 'Free',
        price: 0,
        currency: 'INR',
        interval: 'month',
        features: {
          maxLinks: 10,
          maxClicks: 100,
          customDomain: false,
          analytics: 'basic',
          apiAccess: false,
          teamMembers: 1,
          passwordProtection: false,
          linkExpiration: false,
          customBranding: false,
          prioritySupport: false
        }
      },
      {
        name: 'starter',
        displayName: 'Starter',
        price: 299, // ₹299 per month
        currency: 'INR',
        interval: 'month',
        features: {
          maxLinks: 100,
          maxClicks: 5000,
          customDomain: false,
          analytics: 'advanced',
          apiAccess: true,
          teamMembers: 1,
          passwordProtection: true,
          linkExpiration: true,
          customBranding: false,
          prioritySupport: false
        }
      },
      {
        name: 'professional',
        displayName: 'Professional',
        price: 599, // ₹599 per month
        currency: 'INR',
        interval: 'month',
        features: {
          maxLinks: 1000,
          maxClicks: 25000,
          customDomain: true,
          analytics: 'advanced',
          apiAccess: true,
          teamMembers: 5,
          passwordProtection: true,
          linkExpiration: true,
          customBranding: true,
          prioritySupport: true
        }
      },
      {
        name: 'enterprise',
        displayName: 'Enterprise',
        price: 1499, // ₹1499 per month
        currency: 'INR',
        interval: 'month',
        features: {
          maxLinks: -1, // Unlimited
          maxClicks: -1, // Unlimited
          customDomain: true,
          analytics: 'enterprise',
          apiAccess: true,
          teamMembers: -1, // Unlimited
          passwordProtection: true,
          linkExpiration: true,
          customBranding: true,
          prioritySupport: true
        }
      }
    ];

    await Plan.insertMany(plans);
    console.log('Plans seeded successfully');

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@linkshortener.com' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@linkshortener.com',
        password: 'admin123', // Will be hashed
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isEmailVerified: true,
        subscriptionStatus: 'active'
      });
      await admin.save();
      console.log('Admin user created');
    }

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedPlans();
