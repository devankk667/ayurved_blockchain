import React from 'react';
import { Leaf, CheckCircle } from 'lucide-react';
import ProgressBar from './results/ProgressBar';
import FarmOrigin from './results/FarmOrigin';
import ProcessingDetails from './results/ProcessingDetails';
import DistributionDetails from './results/DistributionDetails';
import QualityCertifications from './results/QualityCertifications';
import RealTimeMonitoring from './results/RealTimeMonitoring';

const ResultsTab = ({ batchData }) => {
  if (!batchData) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <Leaf className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
        <p className="text-gray-500">Scan a batch ID to view herb details</p>
      </div>
    );
  }

  const { batch, processing, distribution, qualityTests, iotData, stageInfo } = batchData;

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{batch.herbName}</h2>
            <p className="text-gray-600">{batch.herbVariety}</p>
            <p className="text-sm text-gray-500">Batch ID: {batch.batchId}</p>
          </div>
          <div className={`p-3 rounded-full ${stageInfo.bg}`}>
            <stageInfo.icon className={`w-8 h-8 ${stageigo.color}`} />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700 font-semibold">Verified Authentic</span>
          {batch.isOrganic && (
            <span className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Organic Certified
            </span>
          )}
        </div>

        <ProgressBar currentStage={batch.currentStage} />
      </div>

      {/* Details Sections */}
      <FarmOrigin batch={batch} />
      {processing && processing.length > 0 && <ProcessingDetails processing={processing} />}
      {distribution && distribution.length > 0 && <DistributionDetails distribution={distribution} />}
      {qualityTests && qualityTests.length > 0 && <QualityCertifications qualityTests={qualityTests} />}
      {iotData && iotData.length > 0 && <RealTimeMonitoring iotData={iotData} />}
    </div>
  );
};

export default ResultsTab;
