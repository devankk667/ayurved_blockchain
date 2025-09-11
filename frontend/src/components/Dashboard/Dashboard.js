import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle, AlertCircle, ChevronRight, Clock, Droplet, Thermometer, Wind, Droplets } from 'lucide-react';
import Sidebar from '../Layout/Sidebar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);

  // Mock data for demonstration
  const mockBatchData = {
    batch: {
      batchId: 'ASH-2024-001',
      herbName: 'Ashwagandha',
      herbVariety: 'Withania somnifera',
      farmer: '0x742d35Cc6e64C5532E123B7B8B7A9E',
      farmLocation: 'Rajasthan, India',
      gpsCoordinates: '26.9124° N, 75.7873° E',
      plantingDate: '2024-01-15',
      harvestDate: '2024-06-20',
      quantity: 1000,
      soilCondition: 'Organic, pH 6.8',
      isOrganic: true,
      currentStage: 2, // 0: Farm, 1: Processing, 2: Distribution, 3: Retail, 4: Consumer
      isActive: true
    },
    processing: [{
      processor: '0x892f45Cc6e64C5532E987B7B8B7B1A',
      processDate: '2024-06-25',
      processMethod: 'Traditional Sun Drying',
      temperature: 35,
      duration: 72,
      qualityGrade: 'Premium A+',
      certificationHash: 'QmX7Y9Z2...',
      outputQuantity: 850
    }],
    distribution: [{
      distributor: '0x123a45Cc6e64C5532E456B7B8B7C2D',
      destination: '0x456b78Dd7e75D6643F789C8C9C8D3E',
      shipDate: '2024-07-01',
      expectedDelivery: '2024-07-05',
      transportConditions: 'Temperature controlled, Humidity <60%',
      temperatureControlled: true,
      trackingId: 'TRK-ASH-2024-001'
    }],
    qualityTests: [{
      tester: '0x789c12Ee8f86E7754G890D9D0D9E4F',
      testDate: '2024-06-22',
      testType: 'Heavy Metal Analysis',
      passed: true,
      testResults: 'QmA8B9C3...',
      certificationId: 'AYUSH-QC-2024-567'
    }],
    iotData: [
      { sensorType: 'Temperature', value: '22.5', unit: '°C', timestamp: '1720002600' },
      { sensorType: 'Humidity', value: '45', unit: '%', timestamp: '1720002600' },
      { sensorType: 'GPS', value: '26.9124,75.7873', unit: 'coordinates', timestamp: '1720002600' }
    ]
  };

  const fetchBatchData = async (batchId) => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBatchData(mockBatchData);
      setActiveTab('track');
      setShowScanModal(false);
    } catch (err) {
      setError('Failed to fetch batch data. Please check the Batch ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = () => {
    if (!scanInput.trim()) {
      setError('Please enter a batch ID');
      return;
    }
    fetchBatchData(scanInput.trim());
  };

  const getStageInfo = (stage) => {
    const stages = [
      { name: 'Farm', color: 'text-green-400', bg: 'bg-green-400/10' },
      { name: 'Processing', color: 'text-blue-400', bg: 'bg-blue-400/10' },
      { name: 'Distribution', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
      { name: 'Retail', color: 'text-purple-400', bg: 'bg-purple-400/10' },
      { name: 'Consumer', color: 'text-indigo-400', bg: 'bg-indigo-400/10' }
    ];
    return stages[stage] || stages[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ProgressBar = ({ currentStage }) => {
    const stages = ['Farm', 'Processing', 'Distribution', 'Retail', 'Consumer'];
    const stageInfo = getStageInfo(currentStage);
    
    return (
      <div className="mt-6">
        <div className="flex justify-between mb-2 text-sm text-slate-400">
          <span>Status</span>
          <span className="font-medium text-white">{stages[currentStage]}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${stageInfo.bg} transition-all duration-1000`}
            style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-3 text-xs">
          {stages.map((stage, index) => (
            <div key={stage} className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full mb-1 ${
                index <= currentStage ? stageInfo.color : 'bg-slate-600'
              }`}></div>
              <span className={`text-xs ${index <= currentStage ? 'text-white' : 'text-slate-500'}`}>
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ScanModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Track Batch</h3>
          <button 
            onClick={() => setShowScanModal(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Batch ID</label>
            <input
              type="text"
              placeholder="Enter Batch ID (e.g., ASH-2024-001)"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <Scan className="w-5 h-5 mr-2" />
                Track Batch
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DashboardHome = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Track and manage your herbal supply chain</p>
        </div>
        <button
          onClick={() => setShowScanModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center"
        >
          <Scan className="w-5 h-5 mr-2" />
          Track Batch
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Batches</p>
              <h3 className="text-2xl font-bold mt-1">1,248</h3>
              <p className="text-sm text-green-400 mt-2">
                <span className="font-medium">+12.5%</span> from last month
              </p>
            </div>
            <div className="bg-indigo-500/10 p-3 rounded-lg">
              <Package className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Shipments</p>
              <h3 className="text-2xl font-bold mt-1">48</h3>
              <p className="text-sm text-yellow-400 mt-2">
                <span className="font-medium">3</span> require attention
              </p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-lg">
              <Truck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Quality Pass Rate</p>
              <h3 className="text-2xl font-bold mt-1">98.7%</h3>
              <p className="text-sm text-green-400 mt-2">
                <span className="font-medium">+2.3%</span> from last month
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-slate-700 last:border-0 last:pb-0">
              <div className="bg-indigo-500/10 p-2 rounded-lg mr-4">
                <Package className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New batch processed</p>
                <p className="text-xs text-slate-400 mt-1">Batch ASH-2024-{100 + item} has completed processing</p>
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {item} hour{item !== 1 ? 's' : ''} ago
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TrackBatch = () => {
    if (!batchData) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/50 max-w-md w-full">
            <div className="bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Track Your Herbs</h2>
            <p className="text-slate-400 mb-6">Enter a batch ID to view detailed information about your herbal products</p>
            <button
              onClick={() => setShowScanModal(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              Scan Batch ID
            </button>
          </div>
        </div>
      );
    }

    const { batch, processing, distribution, qualityTests, iotData } = batchData;
    const stageInfo = getStageInfo(batch.currentStage);

    return (
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center">
              <button 
                onClick={() => setBatchData(null)}
                className="mr-4 text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-white">Batch Details</h1>
            </div>
            <p className="text-slate-400 ml-10 mt-1">Track and verify your herbal products</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              Export
            </button>
            <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
              Share
            </button>
          </div>
        </div>

        {/* Batch Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stageInfo.bg} mr-3`}>
                      <Package className={`w-5 h-5 ${stageInfo.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{batch.herbName}</h2>
                      <p className="text-slate-400">{batch.herbVariety}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Batch ID</p>
                      <p className="font-medium">{batch.batchId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Status</p>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${stageInfo.color} mr-2`}></div>
                        <span className="font-medium">{stageInfo.name}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Quantity</p>
                      <p className="font-medium">{batch.quantity} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Organic</p>
                      <p className="font-medium">{batch.isOrganic ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  <ProgressBar currentStage={batch.currentStage} />
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(batch.herbName)}&background=4f46e5&color=fff`} 
                      alt={batch.herbName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                  <span className="text-xs text-slate-400">Product Image</span>
                </div>
              </div>
            </div>
            
            {/* Farm & Processing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-green-400 mr-2" />
                  Farm Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Farmer</p>
                    <p className="text-sm font-medium">{batch.farmer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-sm font-medium">{batch.farmLocation}</p>
                    <p className="text-xs text-slate-500">{batch.gpsCoordinates}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Planting Date</p>
                    <p className="text-sm font-medium">{formatDate(batch.plantingDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Harvest Date</p>
                    <p className="text-sm font-medium">{formatDate(batch.harvestDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Soil Condition</p>
                    <p className="text-sm font-medium">{batch.soilCondition}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 text-blue-400 mr-2" />
                  Processing
                </h3>
                {processing && processing.length > 0 ? (
                  <div className="space-y-4">
                    {processing.map((process, index) => (
                      <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{process.processMethod}</p>
                            <p className="text-sm text-slate-400">
                              {formatDate(process.processDate)}
                            </p>
                          </div>
                          <div className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded">
                            {process.qualityGrade}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div>
                            <p className="text-slate-400">Temperature</p>
                            <p className="font-medium">{process.temperature}°C</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Duration</p>
                            <p className="font-medium">{process.duration} hours</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Output</p>
                            <p className="font-medium">{process.outputQuantity} kg</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No processing data available</p>
                )}
              </div>
            </div>
            
            {/* Distribution */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="w-5 h-5 text-yellow-400 mr-2" />
                Distribution
              </h3>
              {distribution && distribution.length > 0 ? (
                <div className="space-y-4">
                  {distribution.map((shipment, index) => (
                    <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Shipment #{shipment.trackingId}</p>
                          <p className="text-sm text-slate-400">
                            Shipped on {formatDate(shipment.shipDate)}
                          </p>
                        </div>
                        <div className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded">
                          In Transit
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">From</p>
                          <p className="font-medium">{batch.farmLocation}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">To</p>
                          <p className="font-medium">Mumbai Distribution Center</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Expected Delivery</p>
                          <p className="font-medium">{formatDate(shipment.expectedDelivery)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Conditions</p>
                          <p className="font-medium">{shipment.transportConditions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No distribution data available</p>
              )}
            </div>
            
            {/* Quality Tests */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 text-purple-400 mr-2" />
                Quality Tests
              </h3>
              {qualityTests && qualityTests.length > 0 ? (
                <div className="space-y-4">
                  {qualityTests.map((test, index) => (
                    <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{test.testType}</p>
                          <p className="text-sm text-slate-400">
                            Tested on {formatDate(test.testDate)}
                          </p>
                        </div>
                        <div className={`${test.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} text-xs px-2 py-1 rounded`}>
                          {test.passed ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                      <div className="mt-3 text-sm">
                        <p className="text-slate-400">Certification ID</p>
                        <p className="font-mono text-xs bg-slate-900/50 p-2 rounded mt-1 overflow-x-auto">
                          {test.certificationId}
                        </p>
                      </div>
                      {test.testResults && (
                        <div className="mt-3 text-sm">
                          <p className="text-slate-400">Results</p>
                          <p className="font-mono text-xs bg-slate-900/50 p-2 rounded mt-1 overflow-x-auto">
                            {test.testResults}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No quality test data available</p>
              )}
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* IOT Data */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Environmental Data</h3>
              <div className="space-y-4">
                {iotData && iotData.length > 0 ? (
                  iotData.map((data, index) => (
                    <div key={index} className="flex items-center p-3 bg-slate-700/30 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        data.sensorType === 'Temperature' ? 'bg-red-500/10 text-red-400' :
                        data.sensorType === 'Humidity' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-green-500/10 text-green-400'
                      } mr-3`}>
                        {data.sensorType === 'Temperature' ? (
                          <Thermometer className="w-5 h-5" />
                        ) : data.sensorType === 'Humidity' ? (
                          <Droplets className="w-5 h-5" />
                        ) : (
                          <Wind className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{data.sensorType}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(data.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{data.value} {data.unit}</p>
                        <p className="text-xs text-slate-400">
                          {data.sensorType === 'Temperature' && data.value > 25 ? 'High' : 'Normal'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No IOT data available</p>
                )}
              </div>
            </div>
            
            {/* Batch Actions */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Batch Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                  <span>View Certificate</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                  <span>Download Report</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                  <span>Share Batch</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                  <span>Report Issue</span>
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Batch History */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Batch History</h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5"></div>
                    <div className="w-0.5 h-full bg-slate-600 mt-1"></div>
                  </div>
                  <div className="pb-6">
                    <p className="font-medium">Batch Created</p>
                    <p className="text-sm text-slate-400">{formatDate(batch.plantingDate)}</p>
                    <p className="text-sm mt-1">Batch {batch.batchId} was created and registered on the blockchain</p>
                  </div>
                </div>
                
                {processing && processing.map((process, index) => (
                  <div key={`process-${index}`} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                      <div className={`w-0.5 h-full ${index === processing.length - 1 && !distribution ? 'bg-transparent' : 'bg-slate-600'} mt-1`}></div>
                    </div>
                    <div className="pb-6">
                      <p className="font-medium">Processing: {process.processMethod}</p>
                      <p className="text-sm text-slate-400">{formatDate(process.processDate)}</p>
                      <p className="text-sm mt-1">Processed {process.outputQuantity}kg with {process.processMethod.toLowerCase()}</p>
                    </div>
                  </div>
                ))}
                
                {distribution && distribution.map((shipment, index) => (
                  <div key={`shipment-${index}`} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5"></div>
                      <div className={`w-0.5 h-full ${index === distribution.length - 1 ? 'bg-transparent' : 'bg-slate-600'} mt-1`}></div>
                    </div>
                    <div className="pb-6">
                      <p className="font-medium">Shipped to Distribution</p>
                      <p className="text-sm text-slate-400">{formatDate(shipment.shipDate)}</p>
                      <p className="text-sm mt-1">Shipped to {shipment.destination} (Tracking: {shipment.trackingId})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 ml-64 min-h-screen">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'track' && <TrackBatch />}
          {activeTab === 'analytics' && (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6">Analytics</h1>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
                <p className="text-slate-400">Analytics dashboard coming soon</p>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
                <p className="text-slate-400">Settings will be available soon</p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {showScanModal && <ScanModal />}
      
      {/* Global Notification */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center max-w-md">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-4 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
