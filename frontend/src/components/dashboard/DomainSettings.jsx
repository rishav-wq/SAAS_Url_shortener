// src/components/dashboard/DomainSettings.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const DomainSettings = () => {
  const [settings, setSettings] = useState({
    currentDomain: 'shortlink.pro',
    customDomain: '',
    isCustomDomainEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDomainSettings();
  }, []);

  const fetchDomainSettings = async () => {
    try {
      // For now, show the default domain
      // In production, this would fetch user's custom domain settings
      setSettings({
        currentDomain: 'shortlink.pro',
        customDomain: '',
        isCustomDomainEnabled: userInfo?.subscription?.plan?.features?.customDomain || false
      });
    } catch (error) {
      setError('Failed to load domain settings');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // This would call an API to save custom domain settings
      // For now, just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSuccess('Domain settings saved successfully!');
    } catch (error) {
      setError('Failed to save domain settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Domain Settings</h3>
      
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Current Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Short Link Domain
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <code className="text-sm text-gray-800">
              https://mylinks.pro/your-link
            </code>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Your shortened links currently use this domain. You can use ANY domain you want!
          </p>
          
          {/* Domain Examples */}
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">✨ Popular Domain Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
              <div>
                <strong>Business:</strong>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• short.yourcompany.com</li>
                  <li>• links.mybusiness.io</li>
                  <li>• go.startup.co</li>
                </ul>
              </div>
              <div>
                <strong>Creative:</strong>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• s.ly, tiny.me, quick.link</li>
                  <li>• jump.to, hit.it, dash.co</li>
                  <li>• Any domain you own!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Domain Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Custom Domain
            </label>
            {!settings.isCustomDomainEnabled && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pro Feature
              </span>
            )}
          </div>
          
          <input
            type="text"
            value={settings.customDomain}
            onChange={(e) => setSettings({...settings, customDomain: e.target.value})}
            disabled={!settings.isCustomDomainEnabled}
            placeholder="yourdomain.com"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              !settings.isCustomDomainEnabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
          
          {!settings.isCustomDomainEnabled ? (
            <p className="mt-2 text-sm text-gray-500">
              Upgrade to Professional or Enterprise plan to use custom domains.
              <button 
                type="button"
                onClick={() => window.location.href = '/pricing'}
                className="ml-1 text-blue-600 hover:text-blue-500 underline"
              >
                View Plans
              </button>
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-500">
                Enter your custom domain (e.g., links.yourcompany.com)
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Setup Instructions:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Add a CNAME record pointing to: shortlink.pro</li>
                  <li>Verify domain ownership</li>
                  <li>SSL certificate will be automatically provisioned</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Development Mode Info */}
        <div className="border-t pt-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-amber-800">Development Mode</h4>
              <p className="text-sm text-amber-700">
                You're currently in development mode. Links will use localhost until you deploy to production 
                and configure the BASE_URL environment variable.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {settings.isCustomDomainEnabled && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Save Settings
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DomainSettings;
