import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentInstructions, setPaymentInstructions] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [step, setStep] = useState(1); // 1: Plan details, 2: Payment method, 3: Payment instructions, 4: Upload proof
  const [duration, setDuration] = useState(1); // months
  const [proofFile, setProofFile] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchPlan();
  }, [planId, userInfo, navigate]);

  const fetchPlan = async () => {
    try {
      const response = await api.get('/payments/plans');
      const selectedPlan = response.data.data.find(p => p._id === planId);
      if (!selectedPlan) {
        setError('Plan not found');
        return;
      }
      setPlan(selectedPlan);
    } catch (error) {
      setError('Failed to load plan details');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await api.post('/payments/initiate', {
        planId,
        paymentMethod,
        duration
      });
      
      setPaymentInstructions(response.data.data.instructions);
      setPaymentId(response.data.data.paymentId);
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const uploadProof = async () => {
    if (!proofFile && !referenceNumber) {
      setError('Please provide payment proof or reference number');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      if (proofFile) formData.append('paymentProof', proofFile);
      if (referenceNumber) formData.append('referenceNumber', referenceNumber);
      if (paymentMethod === 'upi') formData.append('upiTransactionId', referenceNumber);

      const response = await api.post(`/payments/${paymentId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Payment proof uploaded successfully! We will verify and activate your subscription within 24 hours.');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !paymentInstructions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = plan ? plan.price * duration : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8 text-sm text-gray-600">
            <span>Plan Details</span>
            <span>Payment Method</span>
            <span>Payment</span>
            <span>Verification</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Step 1: Plan Details */}
          {step === 1 && plan && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Details</h2>
              
              <div className="border rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{plan.displayName}</h3>
                    <p className="text-gray-600">Perfect for growing businesses</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{plan.price}</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>✓ {plan.features.maxLinks === -1 ? 'Unlimited' : plan.features.maxLinks} links/month</div>
                  <div>✓ {plan.features.maxClicks === -1 ? 'Unlimited' : plan.features.maxClicks.toLocaleString()} clicks/month</div>
                  <div>✓ {plan.features.analytics} analytics</div>
                  <div>{plan.features.customDomain ? '✓' : '✗'} Custom domain</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Month - ₹{plan.price}</option>
                  <option value={3}>3 Months - ₹{plan.price * 3} (No discount)</option>
                  <option value={12}>12 Months - ₹{Math.floor(plan.price * 12 * 0.8)} (20% off)</option>
                </select>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{duration === 12 ? Math.floor(totalAmount * 0.8) : totalAmount}</span>
                </div>
                {duration === 12 && (
                  <div className="text-sm text-green-600">
                    You save ₹{Math.floor(totalAmount * 0.2)} with annual billing!
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-sm text-gray-600">Pay using any UPI app (GPay, PhonePe, Paytm, etc.)</div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Bank Transfer</div>
                      <div className="text-sm text-gray-600">Direct bank transfer using NEFT/RTGS/IMPS</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={initiatePayment}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Generate Payment Details'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Instructions */}
          {step === 3 && paymentInstructions && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Instructions</h2>
              
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Pay via UPI</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">UPI ID:</span>
                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{paymentInstructions.upiId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span>
                        <span className="ml-2 text-lg font-bold">₹{paymentInstructions.amount}</span>
                      </div>
                      <div>
                        <span className="font-medium">Reference:</span>
                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-sm">{paymentInstructions.transactionId}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-white rounded border text-center">
                      <div className="text-sm text-gray-600 mb-2">Scan QR Code to Pay</div>
                      <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
                        QR Code Here
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Bank Transfer Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Account Number:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{paymentInstructions.bankDetails.accountNumber}</span>
                    </div>
                    <div>
                      <span className="font-medium">IFSC Code:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{paymentInstructions.bankDetails.ifscCode}</span>
                    </div>
                    <div>
                      <span className="font-medium">Bank Name:</span>
                      <span className="ml-2">{paymentInstructions.bankDetails.bankName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Account Holder:</span>
                      <span className="ml-2">{paymentInstructions.bankDetails.accountHolderName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span>
                      <span className="ml-2 text-lg font-bold">₹{paymentInstructions.amount}</span>
                    </div>
                    <div>
                      <span className="font-medium">Reference Note:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-sm">{paymentInstructions.note}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please make the payment and then upload the payment proof in the next step. 
                  Your subscription will be activated within 24 hours after verification.
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                I have made the payment
              </button>
            </div>
          )}

          {/* Step 4: Upload Proof */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Payment Proof</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {paymentMethod === 'upi' ? 'UPI Transaction ID' : 'Bank Transaction Reference'}
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder={paymentMethod === 'upi' ? 'Enter UPI transaction ID' : 'Enter bank reference number'}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    Upload a screenshot of your payment confirmation for faster verification
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={uploadProof}
                    disabled={uploading || (!proofFile && !referenceNumber)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <LoadingSpinner size="sm" /> : 'Submit for Verification'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
