// src/App.jsx
import React from 'react';
// Remove BrowserRouter import from here if wrapping in main.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    // Router is now wrapping this component in main.jsx
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={userInfo ? <Navigate to="/dashboard" /> : <Navigate to="/pricing" />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={userInfo ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={userInfo ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route
          path="/checkout/:planId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
