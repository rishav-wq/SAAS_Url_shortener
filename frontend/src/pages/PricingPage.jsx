import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState('month');
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/payments/plans');
      setPlans(response.data.data);
    } catch (error) {
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId) => {
    if (!userInfo) {
      navigate('/login', { state: { from: { pathname: '/pricing' } } });
      return;
    }
    navigate(`/checkout/${planId}`);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `₹${price}`;
  };

  const getFeatureText = (feature, value) => {
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'number') {
      if (value === -1) return 'Unlimited';
      return value.toLocaleString();
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Simple Navigation */}
      {!userInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">LinkShortener Pro</h2>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your link shortening needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('month')}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('year')}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'year'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                20% off
              </span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {plans.map((plan, index) => {
            const isPopular = plan.name === 'professional';
            const price = billingCycle === 'year' ? Math.floor(plan.price * 12 * 0.8) : plan.price;
            
            return (
              <div
                key={plan._id}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  isPopular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`px-6 ${isPopular ? 'pt-12 pb-8' : 'py-8'}`}>
                  {/* Plan Header */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.displayName}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {formatPrice(price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500">
                          /{billingCycle === 'year' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'year' && plan.price > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ₹{Math.floor(plan.price * 12 * 0.2)} annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mt-8 space-y-4">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">
                        {plan.features.maxLinks === -1 ? 'Unlimited' : plan.features.maxLinks} links/month
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">
                        {plan.features.maxClicks === -1 ? 'Unlimited' : plan.features.maxClicks.toLocaleString()} clicks/month
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-3 ${plan.features.customDomain ? 'text-green-500' : 'text-gray-300'}`}>
                        {plan.features.customDomain ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700">Custom domain</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">
                        {plan.features.analytics.charAt(0).toUpperCase() + plan.features.analytics.slice(1)} analytics
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-3 ${plan.features.apiAccess ? 'text-green-500' : 'text-gray-300'}`}>
                        {plan.features.apiAccess ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700">API access</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">
                        {plan.features.teamMembers === -1 ? 'Unlimited' : plan.features.teamMembers} team member{plan.features.teamMembers !== 1 ? 's' : ''}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-3 ${plan.features.passwordProtection ? 'text-green-500' : 'text-gray-300'}`}>
                        {plan.features.passwordProtection ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700">Password protection</span>
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-3 ${plan.features.customBranding ? 'text-green-500' : 'text-gray-300'}`}>
                        {plan.features.customBranding ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700">Custom branding</span>
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-3 ${plan.features.prioritySupport ? 'text-green-500' : 'text-gray-300'}`}>
                        {plan.features.prioritySupport ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-700">Priority support</span>
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => handleSelectPlan(plan._id)}
                      className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                        isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : plan.price === 0
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept UPI payments, bank transfers, net banking, and all major credit/debit cards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change my plan anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Yes, all paid plans come with a 7-day free trial. No credit card required to start.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens if I exceed my limits?
                </h3>
                <p className="text-gray-600">
                  We'll notify you when you approach your limits. You can upgrade your plan or wait for the next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-6">
            Join thousands of businesses using LinkShortener Pro to track and optimize their links.
          </p>
          {!userInfo ? (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
