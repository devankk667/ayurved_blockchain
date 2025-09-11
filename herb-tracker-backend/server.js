const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// --- Configuration ---
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// Use environment variable for RPC_URL, with a fallback for local development
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

// --- Setup ---
app.use(cors());
app.use(express.json());

// Load ABI
const abiPath = path.resolve(__dirname, 'artifacts/contracts/AyurvedicHerbTracker.sol/AyurvedicHerbTracker.json');
const abiFile = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const contractABI = abiFile.abi;

// Connect to Ethereum
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

// --- Helper to convert contract data ---
const formatContractData = (data) => {
    const [batch, processing, distribution, qualityTests, iotData] = data;

    return {
        batch: {
            batchId: batch.batchId,
            herbName: batch.herbName,
            herbVariety: batch.herbVariety,
            farmer: batch.farmer,
            farmLocation: batch.farmLocation,
            gpsCoordinates: batch.gpsCoordinates,
            plantingDate: new Date(Number(batch.plantingDate) * 1000).toISOString(),
            harvestDate: new Date(Number(batch.harvestDate) * 1000).toISOString(),
            quantity: batch.quantity.toString(),
            soilCondition: batch.soilCondition,
            isOrganic: batch.isOrganic,
            currentStage: Number(batch.currentStage),
            isActive: batch.isActive,
        },
        processing: processing.map(p => ({
            processor: p.processor,
            processDate: new Date(Number(p.processDate) * 1000).toISOString(),
            processMethod: p.processMethod,
            temperature: p.temperature.toString(),
            duration: p.duration.toString(),
            qualityGrade: p.qualityGrade,
            certificationHash: p.certificationHash,
            outputQuantity: p.outputQuantity.toString(),
        })),
        distribution: distribution.map(d => ({
            distributor: d.distributor,
            destination: d.destination,
            shipDate: new Date(Number(d.shipDate) * 1000).toISOString(),
            expectedDelivery: new Date(Number(d.expectedDelivery) * 1000).toISOString(),
            transportConditions: d.transportConditions,
            temperatureControlled: d.temperatureControlled,
            trackingId: d.trackingId,
        })),
        qualityTests: qualityTests.map(q => ({
            tester: q.tester,
            testDate: new Date(Number(q.testDate) * 1000).toISOString(),
            testType: q.testType,
            passed: q.passed,
            testResults: q.testResults,
            certificationId: q.certificationId,
        })),
        iotData: iotData.map(i => ({
            sensorType: i.sensorType,
            value: i.value,
            unit: i.unit,
            timestamp: new Date(Number(i.timestamp) * 1000).toISOString(),
        })),
    };
}


// --- API Endpoints ---
app.get('/api/batch/:batchId', async (req, res) => {
    const { batchId } = req.params;
    console.log(`[${new Date().toISOString()}] Received request for batchId: ${batchId}`);

    try {
        const contractData = await contract.getBatchDetails(batchId);
        const formattedData = formatContractData(contractData);
        res.json(formattedData);

    } catch (error) {
        console.error("Error fetching batch details:", error.message);
        if (error.message.includes("Batch ID does not exist")) {
             res.status(404).json({ error: "Batch ID not found." });
        } else {
             res.status(500).json({ error: "Failed to fetch batch details from the blockchain." });
        }
    }
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log(`Connecting to blockchain at ${RPC_URL}`);
});
