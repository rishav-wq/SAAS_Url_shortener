import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';
import { generateInvoice } from '../utils/invoiceGenerator.js';
import { sendPaymentConfirmation } from '../utils/emailService.js';

// Get all available plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans', error: error.message });
  }
};

// Initiate payment for a plan
export const initiatePayment = async (req, res) => {
  try {
    const { planId, paymentMethod, duration = 1 } = req.body; // duration in months
    const userId = req.userId;

    // Validate plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Calculate amount based on duration
    const amount = plan.price * duration;
    
    // Create payment record
    const payment = new Payment({
      userId,
      planId,
      amount,
      paymentMethod,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
    });

    await payment.save();

    // Generate payment instructions based on method
    let paymentInstructions = {};
    
    switch (paymentMethod) {
      case 'upi':
        paymentInstructions = {
          upiId: 'your-business@upi', // Replace with your UPI ID
          amount: amount,
          transactionId: payment.transactionId,
          qrCode: `upi://pay?pa=your-business@upi&pn=LinkShortener&am=${amount}&tr=${payment.transactionId}&tn=Plan Payment`
        };
        break;
        
      case 'bank_transfer':
        paymentInstructions = {
          bankDetails: {
            accountNumber: '1234567890', // Replace with your account
            ifscCode: 'HDFC0001234',
            bankName: 'HDFC Bank',
            accountHolderName: 'Your Business Name',
            branch: 'Main Branch'
          },
          amount: amount,
          transactionId: payment.transactionId,
          note: `Payment for Plan: ${plan.displayName} - Ref: ${payment.transactionId}`
        };
        break;
        
      default:
        return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    res.json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        amount: amount,
        currency: 'INR',
        expiresAt: payment.expiresAt,
        instructions: paymentInstructions
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error initiating payment', error: error.message });
  }
};

// Upload payment proof
export const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { referenceNumber, upiTransactionId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Handle file upload (you can integrate with multer or cloudinary)
    let paymentProof = {};
    if (req.file) {
      paymentProof = {
        filename: req.file.filename,
        url: req.file.path,
        uploadedAt: new Date()
      };
    }

    // Update payment with proof and reference
    payment.referenceNumber = referenceNumber;
    payment.upiTransactionId = upiTransactionId;
    payment.paymentProof = paymentProof;
    payment.status = 'pending'; // Waiting for admin verification

    await payment.save();

    res.json({
      success: true,
      message: 'Payment proof uploaded successfully. We will verify and activate your subscription within 24 hours.',
      data: { paymentId: payment._id, status: payment.status }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading payment proof', error: error.message });
  }
};

// Verify payment (Admin only)
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, adminNotes } = req.body;

    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const payment = await Payment.findById(paymentId).populate('planId');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = status;
    payment.adminNotes = adminNotes;
    payment.verifiedBy = req.userId;
    payment.verifiedAt = new Date();

    if (status === 'success') {
      payment.paidAt = new Date();
      
      // Create or update subscription
      const existingSubscription = await Subscription.findOne({ userId: payment.userId });
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      if (existingSubscription) {
        existingSubscription.planId = payment.planId._id;
        existingSubscription.status = 'active';
        existingSubscription.endDate = endDate;
        existingSubscription.nextBillingDate = endDate;
        existingSubscription.paymentHistory.push({
          paymentId: payment._id,
          amount: payment.amount,
          status: 'success'
        });
        await existingSubscription.save();
      } else {
        const subscription = new Subscription({
          userId: payment.userId,
          planId: payment.planId._id,
          status: 'active',
          endDate: endDate,
          nextBillingDate: endDate,
          paymentHistory: [{
            paymentId: payment._id,
            amount: payment.amount,
            status: 'success'
          }]
        });
        await subscription.save();
      }

      // Update user's plan and status
      const userToUpdate = await User.findById(payment.userId);
      userToUpdate.currentPlan = payment.planId._id;
      userToUpdate.subscriptionStatus = 'active';
      await userToUpdate.save();

      // Generate invoice
      payment.invoiceNumber = `INV-${Date.now()}`;
      payment.invoiceUrl = await generateInvoice(payment);

      // Send confirmation email
      await sendPaymentConfirmation(userToUpdate.email, payment, payment.planId);
    }

    await payment.save();

    res.json({
      success: true,
      message: `Payment ${status === 'success' ? 'approved' : 'rejected'} successfully`,
      data: payment
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId })
      .populate('planId', 'displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPayments = await Payment.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPayments / limit),
          totalPayments
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment history', error: error.message });
  }
};

// Get current subscription
export const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    
    const subscription = await Subscription.findOne({ userId, status: 'active' })
      .populate('planId');

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          status: 'free',
          plan: null,
          features: {
            maxLinks: 10,
            maxClicks: 100,
            customDomain: false,
            analytics: 'basic'
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: subscription.status,
        plan: subscription.planId,
        endDate: subscription.endDate,
        nextBillingDate: subscription.nextBillingDate,
        features: subscription.planId.features
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subscription', error: error.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const { reason } = req.body;

    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'No active subscription found' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.autoRenew = false;

    await subscription.save();

    // Update user status (but keep plan active until end date)
    const user = await User.findById(userId);
    user.subscriptionStatus = 'cancelled';
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully. You can continue using premium features until the end of your billing period.',
      data: { endDate: subscription.endDate }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling subscription', error: error.message });
  }
};

// Admin: Get all payments for verification
export const getAllPayments = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('userId', 'email firstName lastName')
      .populate('planId', 'displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPayments = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPayments / limit),
          totalPayments
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};
