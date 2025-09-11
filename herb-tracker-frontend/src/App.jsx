import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ScanTab from './components/ScanTab';
import ResultsTab from './components/ResultsTab';
import { Leaf, Package, Truck, ShieldCheck, CheckCircle } from 'lucide-react';
import './index.css';

// Utility function to add frontend-specific info to the data
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


const Dashboard = () => {
  const { batchId: urlBatchId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('scan');
  const [scanInput, setScanInput] = useState('');
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlBatchId) {
      setScanInput(urlBatchId);
      fetchBatchData(urlBatchId);
    }
  }, [urlBatchId]);

  const fetchBatchData = async (batchId) => {
    setLoading(true);
    setError('');
    setBatchData(null);

    try {
      const response = await fetch(`/api/batch/${batchId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Add frontend-specific display info to the data
      data.stageInfo = getStageInfo(data.batch.currentStage);

      setBatchData(data);
      setActiveTab('results');
      if (!urlBatchId || urlBatchId.toLowerCase() !== batchId.toLowerCase()) {
        navigate(`/batch/${batchId}`, { replace: true });
      }
    } catch (err) => {
      setError(err.message || 'Failed to fetch batch data.');
      if (urlBatchId) {
        navigate('/', { replace: true });
      }
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

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-start py-8 font-sans">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          {activeTab === 'scan' ? (
            <ScanTab scanInput={scanInput} setScanInput={setScanInput} handleScan={handleScan} loading={loading} error={error} />
          ) : (
            <ResultsTab batchData={batchData} />
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/batch/:batchId" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
