import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const SubscriptionCard = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayments, setShowPayments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
    fetchPaymentHistory();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/payments/subscription');
      setSubscription(response.data.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching subscription:', error);
      }
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get('/payments/history?limit=5');
      setPayments(response.data.data.payments);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching payment history:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    try {
      const reason = prompt('Please tell us why you\'re cancelling (optional):') || 'No reason provided';
      await api.post('/payments/cancel-subscription', { reason });
      alert('Subscription cancelled successfully. You can continue using premium features until the end of your billing period.');
      fetchSubscription();
    } catch (error) {
      alert('Error cancelling subscription: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Subscription</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </span>
      </div>

      {subscription.status === 'free' ? (
        <div className="text-center py-8">
          <div className="text-gray-600 mb-4">
            You're currently on the free plan
          </div>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <div>• {subscription.features.maxLinks} links per month</div>
            <div>• {subscription.features.maxClicks} clicks per month</div>
            <div>• Basic analytics</div>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-600">Current Plan</div>
              <div className="text-lg font-semibold">{subscription.plan?.displayName || 'Premium'}</div>
            </div>
            {subscription.endDate && (
              <div>
                <div className="text-sm text-gray-600">
                  {subscription.status === 'cancelled' ? 'Expires On' : 'Renews On'}
                </div>
                <div className="text-lg font-semibold">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mb-4">
            <div className="text-sm text-gray-600 mb-2">Plan Features</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• {subscription.features.maxLinks === -1 ? 'Unlimited' : subscription.features.maxLinks} links/month</div>
              <div>• {subscription.features.maxClicks === -1 ? 'Unlimited' : subscription.features.maxClicks.toLocaleString()} clicks/month</div>
              <div>• {subscription.features.analytics} analytics</div>
              <div>{subscription.features.customDomain ? '✓' : '✗'} Custom domain</div>
              <div>{subscription.features.apiAccess ? '✓' : '✗'} API access</div>
              <div>{subscription.features.passwordProtection ? '✓' : '✗'} Password protection</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleUpgrade}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Change Plan
            </button>
            {subscription.status === 'active' && (
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Payment History Section */}
      <div className="mt-6 border-t pt-4">
        <button
          onClick={() => setShowPayments(!showPayments)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-700">Payment History</span>
          <span className="text-gray-400">
            {showPayments ? '▼' : '▶'}
          </span>
        </button>

        {showPayments && (
          <div className="mt-4 space-y-3">
            {payments.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                No payment history found
              </div>
            ) : (
              payments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="text-sm font-medium">{payment.planId?.displayName || 'Plan Payment'}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()} • {payment.paymentMethod.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">₹{payment.amount}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status}
                    </div>
                  </div>
                </div>
              ))
            )}
            {payments.length > 0 && (
              <button
                onClick={() => navigate('/payments')}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
              >
                View All Payments
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
