// src/components/dashboard/CreateLinkForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLink } from '../../features/links/linksSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateLinkForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);
  const [localSuccess, setLocalSuccess] = useState('');
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.links);
  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'loading' && originalUrl) {
      const linkData = { originalUrl };
      if (customAlias) linkData.customAlias = customAlias;
      if (expiresAt) linkData.expiresAt = new Date(expiresAt).toISOString();

      dispatch(createLink(linkData)).then(result => {
        if (createLink.fulfilled.match(result)) {
          setCreatedLink(result.payload);
          setOriginalUrl('');
          setCustomAlias('');
          setExpiresAt('');
          setShowAdvanced(false);
        }
      });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setLocalSuccess('Link copied to clipboard!');
      setTimeout(() => setLocalSuccess(''), 3000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Short Link</h2>
            <p className="text-sm text-gray-600 mt-1">Transform your long URLs into memorable short links</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white rounded-full px-3 py-1 text-xs font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-700">{userInfo?.subscription?.plan?.name || 'Free'} Plan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main URL Input */}
          <div>
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Original URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="url"
                id="originalUrl"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Enter the long URL you want to shorten</p>
          </div>

          {/* Advanced Options Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className={`mr-2 h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Advanced Options
            </button>
            <div className="text-xs text-gray-500">
              {customAlias && `Custom alias: ${customAlias}`}
              {expiresAt && ` • Expires: ${new Date(expiresAt).toLocaleDateString()}`}
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
              <div>
                <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Alias (Optional)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                    {window.location.origin.replace('http://', '').replace('https://', '')}/
                  </span>
                  <input
                    type="text"
                    id="customAlias"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-custom-link"
                    pattern="^[a-zA-Z0-9_-]+$"
                    title="Only letters, numbers, underscores, hyphens allowed"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Only letters, numbers, hyphens, and underscores allowed</p>
              </div>

              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Link will automatically expire after this date</p>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {status === 'failed' && error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <svg className="flex-shrink-0 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {typeof error === 'string' ? error : 'Failed to create link.'}
            </div>
          )}

          {localSuccess && (
            <div className="flex items-center p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
              <svg className="flex-shrink-0 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {localSuccess}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading' || !originalUrl}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {status === 'loading' ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Creating Link...</span>
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Create Short Link
              </>
            )}
          </button>
        </form>

        {/* Created Link Display */}
        {createdLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-green-800">✅ Link Created Successfully!</h3>
              <button
                onClick={() => setCreatedLink(null)}
                className="text-green-600 hover:text-green-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Short URL:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={createdLink.shortUrl}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white border border-green-300 rounded focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(createdLink.shortUrl)}
                    className="px-3 py-2 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Original URL:</label>
                <div className="text-sm text-green-600 break-all">{createdLink.originalUrl}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLinkForm;