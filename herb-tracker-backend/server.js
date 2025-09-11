const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// --- Configuration ---
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Newly deployed contract address
// Use environment variable for RPC_URL, with a fallback for local development
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

// --- Setup ---
app.use(cors());

// Custom JSON stringifier to handle BigInt
const jsonStringify = (obj) => {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  );
};

app.use(express.json());

// Custom response formatter
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonStringify(data));
  };
  next();
});

// Global contract instance
let contract;

// Initialize contract
const initializeContract = async () => {
    try {
        console.log('Loading contract ABI...');
        const abiPath = path.resolve(__dirname, 'artifacts/contracts/AyurvedicHerbTracker.sol/AyurvedicHerbTracker.json');
        console.log(`ABI Path: ${abiPath}`);
        
        if (!fs.existsSync(abiPath)) {
            throw new Error(`ABI file not found at ${abiPath}. Make sure to compile the contracts first.`);
        }
        
        const abiFile = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
        if (!abiFile.abi) {
            throw new Error('ABI not found in the contract JSON file');
        }
        
        const contractABI = abiFile.abi;
        console.log('ABI loaded successfully');
        
        // Connect to Ethereum
        console.log(`Connecting to Ethereum node at ${RPC_URL}...`);
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        // Verify connection
        const blockNumber = await provider.getBlockNumber();
        console.log(`Connected to Ethereum node. Current block: ${blockNumber}`);
        
        // Initialize contract instance with a signer
        const signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        console.log(`Contract instance created at address: ${CONTRACT_ADDRESS}`);
        
        // Test contract connection with error handling
        try {
            const testBatchId = 'ASH-2024-001';
            console.log(`Testing connection with batch ID: ${testBatchId}`);
            const batchExists = await contract.batches(testBatchId);
            if (batchExists && batchExists.isActive) {
                console.log('Successfully connected to the contract and verified batch exists');
            } else {
                console.log('Contract connected but batch not found, you may need to seed the contract');
            }
        } catch (error) {
            console.error('Error testing contract connection:', error);
            throw error;
        }
        
        return true;
    } catch (error) {
        console.error('Error initializing contract:', error);
        return false;
    }
};

// Initialize contract when server starts
initializeContract().then(success => {
    if (!success) {
        console.error('Failed to initialize contract. Exiting...');
        process.exit(1);
    }
});

// --- Helper to convert contract data ---
const getStageInfo = (stage) => {
    const stages = [
        { name: 'Farm', icon: '🌱', color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Processing', icon: '🏭', color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Distribution', icon: '🚚', color: 'text-orange-600', bg: 'bg-orange-100' },
        { name: 'Retail', icon: '🏪', color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Consumer', icon: '✓', color: 'text-indigo-600', bg: 'bg-indigo-100' }
    ];
    // Ensure stage is a number
    const stageNum = typeof stage === 'string' ? parseInt(stage, 10) : stage;
    return stages[stageNum] || stages[0];
};

const formatContractData = (data) => {
    try {
        console.log('Raw contract data:', JSON.stringify(data, (_, v) => 
            typeof v === 'bigint' ? v.toString() : v
        ));

        // Destructure the returned tuple
        const [batch, processing, distribution, qualityTests, iotData] = data;
        
        // Log the raw values for debugging
        console.log('Batch:', batch);
        console.log('Processing:', processing);
        console.log('Distribution:', distribution);
        console.log('Quality Tests:', qualityTests);
        console.log('IoT Data:', iotData);

        // Get stage info with fallback
        const stageInfo = getStageInfo(batch?.currentStage ?? 0);

        // Helper function to safely convert timestamp to ISO string
        const toISOString = (timestamp) => {
            try {
                return new Date(Number(timestamp) * 1000).toISOString();
            } catch (e) {
                console.error('Error converting timestamp:', timestamp, e);
                return new Date().toISOString();
            }
        };

        // Format the response
        const formattedData = {
            batch: {
                batchId: batch?.batchId || '',
                herbName: batch?.herbName || '',
                herbVariety: batch?.herbVariety || '',
                farmer: batch?.farmer || '',
                farmLocation: batch?.farmLocation || '',
                gpsCoordinates: batch?.gpsCoordinates || '',
                plantingDate: toISOString(batch?.plantingDate || 0),
                harvestDate: toISOString(batch?.harvestDate || 0),
                currentStage: batch?.currentStage ?? 0,
                isOrganic: batch?.isOrganic ?? true,
                quantity: batch?.quantity?.toString() || '0',
                soilCondition: batch?.soilCondition || '',
                isActive: batch?.isActive ?? false
            },
            processing: (processing || []).map(p => ({
                processor: p.processor || '',
                processDate: toISOString(p.processDate || 0),
                processMethod: p.processMethod || '',
                temperature: p.temperature?.toString() || '0',
                duration: p.duration?.toString() || '0',
                qualityGrade: p.qualityGrade || '',
                certificationHash: p.certificationHash || '',
                outputQuantity: p.outputQuantity?.toString() || '0'
            })),
            distribution: (distribution || []).map(d => ({
                distributor: d.distributor || '',
                destination: d.destination || '',
                shipDate: toISOString(d.shipDate || 0),
                expectedDelivery: toISOString(d.expectedDelivery || 0),
                transportConditions: d.transportConditions || '',
                temperatureControlled: d.temperatureControlled || false,
                trackingId: d.trackingId || ''
            })),
            qualityTests: (qualityTests || []).map(qt => ({
                tester: qt.tester || '',
                testDate: toISOString(qt.testDate || 0),
                testType: qt.testType || '',
                passed: qt.passed || false,
                testResults: qt.testResults || '',
                certificationId: qt.certificationId || ''
            })),
            iotData: (iotData || []).map(i => ({
                sensorType: i.sensorType || '',
                value: i.value || '',
                unit: i.unit || '',
                timestamp: toISOString(i.timestamp || 0)
            })),
            stageInfo: stageInfo
        };

        console.log('Formatted data:', JSON.stringify(formattedData, null, 2));
        return formattedData;
    } catch (error) {
        console.error('Error formatting contract data:', error);
        throw error;
    }
};


// --- API Endpoints ---
app.get('/api/batch/:batchId', async (req, res) => {
    const { batchId } = req.params;
    console.log(`[${new Date().toISOString()}] Received request for batchId: ${batchId}`);

    if (!contract) {
        return res.status(503).json({ error: 'Contract not initialized. Please try again later.' });
    }

    try {
        // First check if batch exists
        const batch = await contract.batches(batchId);
        if (!batch || !batch.isActive) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Get batch details
        const [batchDetails, processing, distribution, qualityTests, iotData] = await Promise.all([
            contract.batches(batchId),
            contract.processingHistory(batchId),
            contract.distributionHistory(batchId),
            contract.qualityTestsHistory(batchId),
            contract.iotDataHistory(batchId)
        ]);

        // Format the response
        const formattedData = {
            batch: {
                batchId: batchDetails.batchId,
                herbName: batchDetails.herbName,
                herbVariety: batchDetails.herbVariety,
                farmer: batchDetails.farmer,
                farmLocation: batchDetails.farmLocation,
                gpsCoordinates: batchDetails.gpsCoordinates,
                plantingDate: new Date(Number(batchDetails.plantingDate) * 1000).toISOString(),
                harvestDate: new Date(Number(batchDetails.harvestDate) * 1000).toISOString(),
                currentStage: Number(batchDetails.currentStage),
                isOrganic: batchDetails.isOrganic,
                quantity: batchDetails.quantity.toString(),
                soilCondition: batchDetails.soilCondition,
                isActive: batchDetails.isActive
            },
            processing: processing.map(p => ({
                processor: p.processor,
                processDate: new Date(Number(p.processDate) * 1000).toISOString(),
                processMethod: p.processMethod,
                temperature: p.temperature.toString(),
                duration: p.duration.toString(),
                qualityGrade: p.qualityGrade,
                certificationHash: p.certificationHash,
                outputQuantity: p.outputQuantity.toString()
            })),
            distribution: distribution.map(d => ({
                distributor: d.distributor,
                destination: d.destination,
                shipDate: new Date(Number(d.shipDate) * 1000).toISOString(),
                expectedDelivery: new Date(Number(d.expectedDelivery) * 1000).toISOString(),
                transportConditions: d.transportConditions,
                temperatureControlled: d.temperatureControlled,
                trackingId: d.trackingId
            })),
            qualityTests: qualityTests.map(qt => ({
                tester: qt.tester,
                testDate: new Date(Number(qt.testDate) * 1000).toISOString(),
                testType: qt.testType,
                passed: qt.passed,
                testResults: qt.testResults,
                certificationId: qt.certificationId
            })),
            iotData: iotData.map(i => ({
                sensorType: i.sensorType,
                value: i.value,
                unit: i.unit,
                timestamp: new Date(Number(i.timestamp) * 1000).toISOString()
            })),
            stageInfo: getStageInfo(Number(batchDetails.currentStage))
        };

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching batch details:', error);
        res.status(500).json({ 
            error: 'Failed to fetch batch details', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log(`Connecting to blockchain at ${RPC_URL}`);
});
