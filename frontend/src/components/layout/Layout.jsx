// src/components/layout/Layout.jsx
import React from 'react';
import Header from '../common/Header.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
