// src/App.jsx
import React from 'react';
// Remove BrowserRouter import from here if wrapping in main.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    // Router is now wrapping this component in main.jsx
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={userInfo ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={userInfo ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </div>
  );
}

export default App;
