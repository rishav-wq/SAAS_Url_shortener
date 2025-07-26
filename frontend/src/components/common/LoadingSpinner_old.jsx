// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    // src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        <svg
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        
        {/* Pulse effect for larger sizes */}
        {(size === 'lg' || size === 'xl') && (
          <div className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} opacity-20 animate-ping rounded-full`} />
        )}
      </div>
    </div>
  );
};

// Skeleton loader component for content placeholders
export const SkeletonLoader = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="mb-3 last:mb-0">
          <div className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`} />
        </div>
      ))}
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ message = 'Loading...', show = true }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
      <div className="text-center">
        <LoadingSpinner size="xl" color="blue" />
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
        <p className="mt-2 text-sm text-gray-500">This might take a moment...</p>
      </div>
    </div>
  );
};

// Button loading state
export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  return (
    <LoadingSpinner 
      size={size} 
      color="white" 
      className={`mr-2 ${className}`} 
    />
  );
};

export default LoadingSpinner;
  );
};

export default LoadingSpinner;