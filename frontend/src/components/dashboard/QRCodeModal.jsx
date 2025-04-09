import React from 'react';
import { QRCode } from 'react-qr-code';
import LoadingSpinner from '../common/LoadingSpinner';

const QRCodeModal = ({ qrCodeUrl, isLoading, error, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Link QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div className="flex items-center justify-center p-4 min-h-[200px]">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-red-600">Error generating QR code: {error}</div>}
          {qrCodeUrl && !isLoading && !error && (
            <QRCode 
              value={qrCodeUrl} 
              size={256} 
              level={"M"}  // Changed from H to M for more capacity
              includeMargin={true}
            />
          )}
          {!qrCodeUrl && !isLoading && !error && (
            <p className="text-gray-500">QR Code not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;