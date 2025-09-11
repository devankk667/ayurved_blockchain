import React from 'react';
import { Scan, Camera, AlertTriangle } from 'lucide-react';

const ScanTab = ({ scanInput, setScanInput, handleScan, loading, error }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
          <Scan className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Herbs</h2>
        <p className="text-gray-600">Scan QR code or enter Batch ID to verify authenticity</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
          <input
            id="batchId"
            type="text"
            placeholder="Enter Batch ID (e.g., ASH-2024-001)"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </>
          ) : (
            <>
              <Scan className="inline w-5 h-5 mr-2" />
              Verify Herb
            </>
          )}
        </button>
        <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center">
          <Camera className="inline w-5 h-5 mr-2" />
          Scan QR Code
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default ScanTab;
