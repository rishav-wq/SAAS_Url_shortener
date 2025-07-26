import React, { useState } from 'react';
import DeploymentGuide from './DeploymentGuide';

const DomainSetup = () => {
  const [showSetup, setShowSetup] = useState(false);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            🚨 Links Not Shareable Yet
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Your links currently use localhost URLs which only work on your computer. 
              Deploy your app to get shareable links like <code className="bg-yellow-100 px-1 rounded">https://your-app.railway.app/abc123</code>
            </p>
          </div>
          <div className="mt-4">
            <div className="flex">
              <button
                onClick={() => setShowSetup(!showSetup)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 mr-3"
              >
                {showSetup ? 'Hide Deployment Guide' : '🚀 Show Deployment Guide'}
              </button>
              <a
                href="https://railway.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-yellow-800 underline hover:text-yellow-900 flex items-center"
              >
                Deploy Now (Free) →
              </a>
            </div>
          </div>
        </div>
      </div>

      {showSetup && (
        <div className="mt-6 border-t border-yellow-200 pt-6">
          <DeploymentGuide />
        </div>
      )}
    </div>
  );
};

export default DomainSetup;
