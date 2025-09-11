import React from 'react';
import { Thermometer } from 'lucide-react';

const RealTimeMonitoring = ({ iotData }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Thermometer className="w-5 h-5 text-indigo-600 mr-2" />
        Real-time Monitoring
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {iotData.map((data, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">{data.sensorType}</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.value} <span className="text-base font-normal text-gray-600">{data.unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(data.timestamp).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
