const express = require('express');
const cors = require('cors');
const Web3 = require('web3');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockBatchData = {
  batch: {
    id: 'BATCH123',
    herbName: 'Ashwagandha',
    plantingDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 30), // 30 days ago
    harvestDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 7), // 7 days ago
    location: 'Uttarakhand, India',
    status: 'In Distribution',
    quantity: '100 kg',
  },
  processing: [
    {
      processId: 'P001',
      processName: 'Drying',
      processDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 6), // 6 days ago
      temperature: '35°C',
      duration: '48 hours',
      operator: 'Rajesh Kumar'
    },
    {
      processId: 'P002',
      processName: 'Grinding',
      processDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 5), // 5 days ago
      meshSize: '80',
      operator: 'Priya Sharma'
    }
  ],
  distribution: [
    {
      shipmentId: 'SHIP001',
      destination: 'Mumbai, India',
      shipDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 2), // 2 days ago
      expectedDelivery: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 5), // 5 days from now
      status: 'In Transit',
      carrier: 'Speedy Logistics'
    }
  ],
  qualityTests: [
    {
      testId: 'QT001',
      testName: 'Purity Test',
      testDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 1), // 1 day ago
      result: 'Pass',
      testedBy: 'Quality Control Team',
      details: 'No contaminants detected, 98.5% pure'
    }
  ],
  iotData: [
    {
      deviceId: 'IOT001',
      parameter: 'Temperature',
      value: '22°C',
      timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      status: 'Normal'
    },
    {
      deviceId: 'IOT002',
      parameter: 'Humidity',
      value: '45%',
      timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      status: 'Normal'
    }
  ]
};

// Routes
app.get('/api/batch/:batchId', (req, res) => {
  try {
    // In a real app, you would fetch this from your blockchain or database
    // For now, we'll return mock data
    res.json(mockBatchData);
  } catch (error) {
    console.error('Error fetching batch data:', error);
    res.status(500).json({ error: 'Failed to fetch batch data' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
