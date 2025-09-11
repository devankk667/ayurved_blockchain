import React from 'react';
import { Package, Thermometer } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ProcessingDetails = ({ processing }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Package className="w-5 h-5 text-blue-600 mr-2" />
        Processing Details
      </h3>
      {processing.map((proc, index) => (
        <div key={index} className="border-l-4 border-blue-500 pl-4 mb-6 last:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Process Method</p>
              <p className="font-semibold">{proc.processMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quality Grade</p>
              <p className="font-semibold text-green-600">{proc.qualityGrade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="font-semibold flex items-center">
                <Thermometer className="w-4 h-4 text-gray-400 mr-1" />
                {proc.temperature}°C
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">{proc.duration} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Output Quantity</p>
              <p className="font-semibold">{proc.outputQuantity}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Process Date</p>
              <p className="font-semibold">{formatDate(proc.processDate)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessingDetails;
