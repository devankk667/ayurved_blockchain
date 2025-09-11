import React from 'react';
import { ShieldCheck } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const QualityCertifications = ({ qualityTests }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ShieldCheck className="w-5 h-5 text-purple-600 mr-2" />
        Quality Certifications
      </h3>
      <div className="space-y-4">
        {qualityTests.map((test, index) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${
            test.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">{test.testType}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                test.passed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {test.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-600">Certification ID:</span> <span className="font-mono">{test.certificationId}</span></p>
              <p><span className="text-gray-600">Test Date:</span> {formatDate(test.testDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualityCertifications;
