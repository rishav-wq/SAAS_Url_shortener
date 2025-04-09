// src/components/dashboard/CreateLinkForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLink } from '../../features/links/linksSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateLinkForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState(''); // Store as string for input type="datetime-local"
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.links); // Get status and error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'loading' && originalUrl) {
      const linkData = { originalUrl };
      if (customAlias) linkData.customAlias = customAlias;
      // Convert datetime-local string to ISO string for backend if date is provided
      if (expiresAt) linkData.expiresAt = new Date(expiresAt).toISOString();

      dispatch(createLink(linkData)).then(result => {
         // Optional: Clear form only on successful creation
         if (createLink.fulfilled.match(result)) {
             setOriginalUrl('');
             setCustomAlias('');
             setExpiresAt('');
             // Maybe show a success toast here
         } else {
             // Error is handled by the slice and displayed below,
             // but you could show a specific error toast here too.
         }
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">Create New Short Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Creation Error */}
        {status === 'failed' && error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {typeof error === 'string' ? error : 'Failed to create link.'}
          </div>
        )}

        {/* Original URL */}
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
            Original URL <span className="text-red-500">*</span>
          </label>
          <input
            id="originalUrl" type="url" required value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)} placeholder="https://example.com/my-long-url"
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Custom Alias (Optional) */}
        <div>
          <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
            Custom Alias (Optional)
          </label>
          <div className="flex mt-1 rounded-md shadow-sm">
               <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm">
                   {/* Dynamically get domain if needed, hardcode for now */}
                   {window.location.origin}/
               </span>
                <input
                    id="customAlias" type="text" value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)} placeholder="my-cool-link" pattern="^[a-zA-Z0-9_-]+$" title="Only letters, numbers, underscores, hyphens allowed"
                    className="flex-1 block w-full min-w-0 px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 />
          </div>

        </div>

        {/* Expiration Date (Optional) */}
        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
            Expiration Date (Optional)
          </label>
          <input
            id="expiresAt" type="datetime-local" value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit" disabled={status === 'loading' || !originalUrl}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? <LoadingSpinner size="sm" /> : 'Create Link'}
        </button>
      </form>
    </div>
  );
};

export default CreateLinkForm;