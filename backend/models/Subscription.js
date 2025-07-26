import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending_payment', 'cancelled', 'expired', 'trialing'], 
    default: 'pending_payment' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  nextBillingDate: { type: Date },
  paymentHistory: [{
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    amount: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed', 'pending'] }
  }],
  trialEndsAt: { type: Date }, // For trial periods
  autoRenew: { type: Boolean, default: true },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
