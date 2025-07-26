// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLinks, fetchLinkStats, fetchQRCode, clearSelectedLinkData } from '../features/links/linksSlice';
import CreateLinkForm from '../components/dashboard/CreateLinkForm';
import LinksTable from '../components/dashboard/LinkTable';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import QRCodeModal from '../components/dashboard/QRCodeModal';
import DomainSetup from '../components/dashboard/DomainSetup';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/layout/Layout.jsx';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    links,
    status: linksStatus,
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
    dispatch(fetchLinks());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchLinks({ page: newPage, search: searchTerm }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchLinks({ page: 1, search: searchTerm }));
  };

  const handleShowStats = (linkId) => {
    setSelectedLinkId(linkId);
    dispatch(fetchLinkStats(linkId));
    setShowStatsModal(true);
  };

  const handleShowQR = (linkId) => {
    setSelectedLinkId(linkId);
    dispatch(fetchQRCode(linkId));
    setShowQRModal(true);
  };

  const closeModal = () => {
    setShowStatsModal(false);
    setShowQRModal(false);
    setSelectedLinkId(null);
    dispatch(clearSelectedLinkData());
  };

  // Calculate statistics
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter(link => !link.expiresAt || new Date(link.expiresAt) > new Date()).length;
  const topLink = links.reduce((top, link) => (link.clicks || 0) > (top.clicks || 0) ? link : top, { clicks: 0 });

  const stats = [
    {
      title: 'Total Links',
      value: totalLinks.toLocaleString(),
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      change: '+23%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Active Links',
      value: activeLinks.toLocaleString(),
      change: '+8%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      title: 'Top Performer',
      value: topLink.clicks > 0 ? `${topLink.clicks} clicks` : 'No data',
      change: topLink.customAlias || 'N/A',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (linksStatus === 'loading' && links.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userInfo?.name || userInfo?.email || 'User'}! 👋
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Here's what's happening with your links today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {userInfo?.subscription?.plan?.name || 'Free'} Plan
                </span>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Domain Configuration Component */}
        <DomainSetup />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${getChangeColor(stat.changeType)}`}>
                      {stat.changeType === 'increase' && '↗ '}
                      {stat.changeType === 'decrease' && '↘ '}
                      {stat.change}
                    </span>
                    {stat.changeType !== 'neutral' && <span className="text-xs text-gray-500 ml-2">vs last month</span>}
                  </div>
                </div>
                <div className={`flex-shrink-0 p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create Link Form */}
          <div className="lg:col-span-1">
            <CreateLinkForm />
            
            {/* Quick Actions Card */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Bulk Import</div>
                      <div className="text-xs text-gray-500">Import multiple URLs at once</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="bg-green-50 p-2 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Export Analytics</div>
                      <div className="text-xs text-gray-500">Download detailed reports</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Links and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics Charts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
                    <p className="text-sm text-gray-600">Click performance over time</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AnalyticsCharts statsData={selectedLinkStats} />
              </div>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Links</h3>
                    <p className="text-sm text-gray-600">Manage and track all your shortened links</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search links..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {linksStatus === 'loading' && (
                  <div className="flex justify-center p-6">
                    <LoadingSpinner />
                  </div>
                )}
                {linksStatus === 'failed' && (
                  <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    Error loading links: {linksError}
                  </div>
                )}
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
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No links yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first short link.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStatsModal && selectedLinkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Link Analytics</h3>
              <button 
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {statsStatus === 'loading' && (
                <div className="flex justify-center p-8">
                  <LoadingSpinner />
                </div>
              )}
              {statsStatus === 'failed' && (
                <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  Error loading stats: {statsError}
                </div>
              )}
              {statsStatus === 'succeeded' && selectedLinkStats && (
                <AnalyticsCharts statsData={selectedLinkStats} />
              )}
            </div>
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
    </Layout>
  );
};

export default DashboardPage;