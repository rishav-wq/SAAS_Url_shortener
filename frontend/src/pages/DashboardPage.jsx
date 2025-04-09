// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLinks, fetchLinkStats, fetchQRCode, clearSelectedLinkData } from '../features/links/linksSlice';
import { logout } from '../features/auth/authSlice';
import CreateLinkForm from '../components/dashboard/CreateLinkForm';
import LinksTable from '../components/dashboard/LinkTable';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts'; // Create Later
import QRCodeModal from '../components/dashboard/QRCodeModal'; // Create Later
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    links,
    status: linksStatus, // Renamed to avoid conflict
    error: linksError,
    pagination,
    selectedLinkStats,
    selectedLinkQRCode,
    statsStatus,
    statsError
  } = useSelector((state) => state.links);

  // State for managing modals and selections
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial links on component mount
  useEffect(() => {
    dispatch(fetchLinks()); // Fetch page 1 initially
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login after logout
  };

  // --- Handlers for Table Actions ---
  const handlePageChange = (newPage) => {
    dispatch(fetchLinks({ page: newPage, search: searchTerm }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchLinks({ page: 1, search: searchTerm })); // Reset to page 1 on new search
  };

  const handleShowStats = (linkId) => {
    setSelectedLinkId(linkId);
    dispatch(fetchLinkStats(linkId)); // Fetch stats when requested
    setShowStatsModal(true);
  };

  const handleShowQR = (linkId) => {
    setSelectedLinkId(linkId);
    dispatch(fetchQRCode(linkId)); // Fetch QR code when requested
    setShowQRModal(true);
  };

  // Close modals and clear related redux state
  const closeModal = () => {
      setShowStatsModal(false);
      setShowQRModal(false);
      setSelectedLinkId(null);
      dispatch(clearSelectedLinkData()); // Clear stats/qr data in redux
  };

  return (
    <div className="container p-4 mx-auto md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div>
          <span className="mr-4 text-gray-600">Welcome, {userInfo?.email}!</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Create Link Form */}
      <div className="mb-8">
        <CreateLinkForm />
      </div>

      {/* Links Table & Search */}
      <div className="p-6 bg-white rounded-lg shadow-md">
         <h2 className="mb-4 text-xl font-semibold text-gray-700">Your Links</h2>
         {/* Search Form */}
         <form onSubmit={handleSearch} className="flex items-center mb-4 space-x-2">
            <input
                type="text"
                placeholder="Search by URL or Alias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Search
            </button>
         </form>

        {/* Loading/Error States for Table */}
        {linksStatus === 'loading' && (
            <div className="flex justify-center p-6"><LoadingSpinner /></div>
        )}
        {linksStatus === 'failed' && (
            <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">Error loading links: {linksError}</div>
        )}
        {/* Table Display */}
        {linksStatus === 'succeeded' && (
          <LinksTable
            links={links}
            pagination={pagination}
            onPageChange={handlePageChange}
            onShowStats={handleShowStats}
            onShowQR={handleShowQR}
          />
        )}
         {linksStatus === 'succeeded' && links.length === 0 && !linksError && (
            <p className="text-center text-gray-500">You haven't created any links yet.</p>
         )}
      </div>

      {/* Modals for Stats and QR Code */}
      {showStatsModal && selectedLinkId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
                 <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-medium">Link Analytics</h3>
                     <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">&times;</button>
                 </div>
                  {statsStatus === 'loading' && <div className="flex justify-center p-4"><LoadingSpinner /></div>}
                  {statsStatus === 'failed' && <div className="text-red-600">Error loading stats: {statsError}</div>}
                  {statsStatus === 'succeeded' && selectedLinkStats && (
                      <AnalyticsCharts statsData={selectedLinkStats} />
                  )}
              </div>
          </div>
      )}

      {showQRModal && selectedLinkId && (
          <QRCodeModal
              qrCodeUrl={selectedLinkQRCode}
              isLoading={statsStatus === 'loading'}
              error={statsStatus === 'failed' ? statsError : null}
              onClose={closeModal}
           />
      )}

    </div>
  );
};

export default DashboardPage;