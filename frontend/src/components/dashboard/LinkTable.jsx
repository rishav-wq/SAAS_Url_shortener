// src/components/dashboard/LinksTable.js
import React from 'react';
import { format } from 'date-fns'; // For formatting dates nicely (npm install date-fns)

const LinksTable = ({ links, pagination, onPageChange, onShowStats, onShowQR }) => {

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  // Function to truncate long URLs for display
  const truncateUrl = (url, length = 50) => {
    if (url.length <= length) return url;
    return url.substring(0, length) + '...';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Short Link</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Original URL</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Clicks</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Created</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => (
            <tr key={link._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                  {/* Display the path part nicely */}
                  {link.shortUrl.replace(/^https?:\/\//, '')}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 <span title={link.originalUrl} className="text-sm text-gray-700">
                    {truncateUrl(link.originalUrl)}
                 </span>
              </td>
               <td className="px-6 py-4 text-sm text-center text-gray-900">{link.totalClicks}</td>
               <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                   {format(new Date(link.createdAt), 'MMM d, yyyy')} {/* Format date */}
               </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {link.isExpired ? (
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">Expired</span>
                ) : link.expiresAt ? (
                   <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full" title={`Expires: ${format(new Date(link.expiresAt), 'Pp')}`}>
                      Expires Soon
                   </span>
                ) : (
                   <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Active</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                <button onClick={() => onShowStats(link._id)} className="mr-2 text-indigo-600 hover:text-indigo-900" title="View Stats">📊</button>
                <button onClick={() => onShowQR(link._id)} className="text-purple-600 hover:text-purple-900" title="Show QR Code">📱</button>
                {/* Add Delete/Edit buttons later if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
         <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-700">
               Showing page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalLinks} results)
            </div>
             <div>
                <button
                    onClick={handlePrevPage}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                     onClick={handleNextPage}
                     disabled={pagination.currentPage === pagination.totalPages}
                     className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     Next
                 </button>
             </div>
         </div>
       )}
    </div>
  );
};

export default LinksTable;