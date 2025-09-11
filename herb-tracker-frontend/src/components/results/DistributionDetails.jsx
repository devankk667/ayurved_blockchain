import React from 'react';
import { Truck } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const DistributionDetails = ({ distribution }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Truck className="w-5 h-5 text-orange-600 mr-2" />
        Distribution Tracking
      </h3>
      {distribution.map((dist, index) => (
        <div key={index} className="border-l-4 border-orange-500 pl-4 mb-6 last:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tracking ID</p>
              <p className="font-semibold font-mono">{dist.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ship Date</p>
              <p className="font-semibold">{formatDate(dist.shipDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Delivery</p>
              <p className="font-semibold">{formatDate(dist.expectedDelivery)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Temperature Controlled</p>
              <p className={`font-semibold ${dist.temperatureControlled ? 'text-green-600' : 'text-gray-600'}`}>
                {dist.temperatureControlled ? '✓ Yes' : '✗ No'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Transport Conditions</p>
              <p className="font-semibold">{dist.transportConditions}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributionDetails;
