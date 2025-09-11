import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { 
  Leaf, 
  Package, 
  Truck, 
  ShieldCheck, 
  CheckCircle, 
  Scan, 
  Camera, 
  AlertTriangle,
  MapPin,
  Calendar,
  Thermometer
} from 'lucide-react';
import './styles/global.css';

const App = () => {
  useEffect(() => {
    // Add the Inter font to the document head
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      // Clean up the link when component unmounts
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batch/:batchId" element={<DashboardWithParam />} />
        </Routes>
      </div>
    </Router>
  );
};

// Component to handle URL parameters
const DashboardWithParam = () => {
  const { batchId } = useParams();
  return <Dashboard initialBatchId={batchId} />;
};

const Dashboard = ({ initialBatchId }) => {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanInput, setScanInput] = useState(initialBatchId || '');
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialBatchId) {
      fetchBatchData(initialBatchId);
    }
  }, [initialBatchId]);

  const fetchBatchData = async (batchId) => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app this would come from the API
      const data = {
        batch: {
          batchId: batchId,
          herbName: "Ashwagandha",
          herbVariety: "Withania somnifera",
          currentStage: 2,
          isOrganic: true,
          farmLocation: "Nagpur, Maharashtra",
          gpsCoordinates: "21.1458° N, 79.0882° E",
          plantingDate: "2023-06-15",
          harvestDate: "2023-12-20",
          soilCondition: "Rich loamy soil",
          quantity: 5000
        },
        processing: [
          {
            processMethod: "Sun Drying",
            qualityGrade: "A+",
            temperature: 32,
            duration: 72,
            outputQuantity: 2500,
            processDate: "2023-12-22"
          }
        ],
        distribution: [
          {
            trackingId: "TRK-ASH-2024-001",
            shipDate: "2024-01-05",
            expectedDelivery: "2024-01-15",
            temperatureControlled: true,
            transportConditions: "20-25°C, 60% humidity"
          }
        ],
        qualityTests: [
          {
            testType: "Purity Test",
            certificationId: "QC-ASH-2024-001",
            testDate: "2023-12-25",
            passed: true
          },
          {
            testType: "Heavy Metal Screening",
            certificationId: "QC-ASH-2024-002",
            testDate: "2023-12-26",
            passed: true
          },
          {
            testType: "Microbial Analysis",
            certificationId: "QC-ASH-2024-003",
            testDate: "2023-12-27",
            passed: true
          }
        ],
        iotData: [
          {
            sensorType: "Temperature",
            value: 22.5,
            unit: "°C",
            timestamp: "2024-01-10T10:30:00Z"
          },
          {
            sensorType: "Humidity",
            value: 58,
            unit: "%",
            timestamp: "2024-01-10T10:30:00Z"
          },
          {
            sensorType: "Light Exposure",
            value: 120,
            unit: "lux",
            timestamp: "2024-01-10T10:30:00Z"
          }
        ]
      };
      
      setBatchData(data);
      setActiveTab('results');
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
      { name: 'Farm', icon: Leaf, color: 'text-green-600', bg: 'bg-green-100' },
      { name: 'Processing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
      { name: 'Distribution', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' },
      { name: 'Retail', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
      { name: 'Consumer', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-100' }
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
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
        ></div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {stages.map((stage, index) => (
            <span 
              key={stage}
              className={`${index <= currentStage ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}
            >
              {stage}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const ScanTab = () => (
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
          <input
            type="text"
            placeholder="Enter Batch ID (e.g., ASH-2024-001)"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            <>
              <Scan className="inline w-5 h-5 mr-2" />
              Verify Herb
            </>
          )}
        </button>
        <div className="text-center">
          <span className="text-gray-500">or</span>
        </div>
        <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
          <Camera className="inline w-5 h-5 mr-2" />
          Scan QR Code
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
    </div>
  );

  const ResultsTab = () => {
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
    
    const { batch, processing, distribution, qualityTests, iotData } = batchData;
    const stageInfo = getStageInfo(batch.currentStage);
    
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{batch.herbName}</h2>
              <p className="text-gray-600">{batch.herbVariety}</p>
              <p className="text-sm text-gray-500">Batch ID: {batch.batchId}</p>
            </div>
            <div className={`p-3 rounded-full ${stageInfo.bg}`}>
              <stageInfo.icon className={`w-8 h-8 ${stageInfo.color}`} />
            </div>
          </div>
          
          {/* Authenticity Status */}
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 font-semibold">Verified Authentic</span>
            {batch.isOrganic && (
              <span className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Organic Certified
              </span>
            )}
          </div>
          
          {/* Progress Bar */}
          <ProgressBar currentStage={batch.currentStage} />
        </div>
        
        {/* Farm Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            Farm Origin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                {batch.farmLocation}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Coordinates</p>
              <p className="font-semibold">{batch.gpsCoordinates}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Planted</p>
              <p className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                {formatDate(batch.plantingDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Harvested</p>
              <p className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                {formatDate(batch.harvestDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Soil Condition</p>
              <p className="font-semibold">{batch.soilCondition}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-semibold">{batch.quantity}g</p>
            </div>
          </div>
        </div>
        
        {/* Processing Details */}
        {processing.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 text-blue-600 mr-2" />
              Processing Details
            </h3>
            {processing.map((proc, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 mb-4 last:mb-0">
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
        )}
        
        {/* Distribution Details */}
        {distribution.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Truck className="w-5 h-5 text-orange-600 mr-2" />
              Distribution Tracking
            </h3>
            {distribution.map((dist, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 mb-4 last:mb-0">
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
        )}
        
        {/* Quality Tests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center="w-5 h-">
            <ShieldCheck className5 text-purple-600 mr-2" />
            Quality Certifications
          </h3>
          <div className="space-y-4">
            {qualityTests.map((test, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                test.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{test.testType}</h4>
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
        
        {/* IoT Sensor Data */}
        {iotData.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Thermometer className="w-5 h-5 text-indigo-600 mr-2" />
              Real-time Monitoring
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {iotData.map((data, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{data.sensorType}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.value} <span className="text-sm font-normal text-gray-600">{data.unit}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(data.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'scan' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('scan')}
        >
          Scan Herb
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'results' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>
      
      {activeTab === 'scan' ? <ScanTab /> : <ResultsTab />}
    </div>
  );
};

export default App;