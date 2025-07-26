import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  
  // Payment Details
  amount: { type: Number, required: true }, // in rupees
  currency: { type: String, default: 'INR' },
  
  // Payment Method
  paymentMethod: { 
    type: String, 
    enum: ['upi', 'bank_transfer', 'net_banking', 'card', 'wallet'], 
    required: true 
  },
  
  // UPI Details
  upiId: { type: String }, // For UPI payments
  upiTransactionId: { type: String }, // UPI transaction reference
  
  // Bank Transfer Details
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  
  // Transaction Details
  transactionId: { type: String, unique: true, sparse: true }, // Unique transaction ID
  referenceNumber: { type: String }, // Bank/UPI reference number
  
  // Payment Status
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'expired', 'cancelled'], 
    default: 'pending' 
  },
  
  // Payment Gateway Response
  gatewayResponse: {
    status: String,
    message: String,
    code: String,
    data: mongoose.Schema.Types.Mixed
  },
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who verified
  
  // Screenshots/Proof (for manual verification)
  paymentProof: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  
  // Timestamps
  paidAt: { type: Date },
  expiresAt: { type: Date }, // For pending payments
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Admin Notes
  adminNotes: { type: String },
  
  // Invoice Details
  invoiceNumber: { type: String, unique: true, sparse: true },
  invoiceUrl: { type: String }
});

// Indexes for efficient queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1, expiresAt: 1 });

// Update the updatedAt field on save
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionId && this.isNew) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
