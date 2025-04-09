// src/components/auth/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import LoadingSpinner from '../common/LoadingSpinner'; // Import spinner

const LoginForm = () => {
  const [email, setEmail] = useState('intern@dacoid.com'); // Pre-fill for convenience
  const [password, setPassword] = useState('Test123'); // Pre-fill for convenience
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/dashboard'; // Where to redirect after login

  useEffect(() => {
    // Redirect if already logged in (e.g., if navigating back to /login)
    if (userInfo) {
      navigate(from, { replace: true });
    }
  }, [userInfo, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
          {typeof error === 'string' ? error : 'An unknown error occurred'}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="••••••••"
        />
      </div>

      {/* Submit Button with Loading State */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;