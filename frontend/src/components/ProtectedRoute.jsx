// src/components/common/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    // Redirect to login, saving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the child component if logged in
};

export default ProtectedRoute;