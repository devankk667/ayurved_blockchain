const express = require('express');
const Web3 = require('web3');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

// --- Web3 Connection ---
// Using the service name 'ganache' instead of localhost for Docker networking
const web3 = new Web3('http://ganache:7545');
const contractABI = require('../../contracts/build/contracts/AyurvedicHerbTracker.json').abi;
// This address will be set after deployment
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// --- API Endpoints ---

// Endpoint to get batch details
app.get('/api/batch/:batchId', async (req, res) => {
    const { batchId } = req.params;

    try {
        // This is a placeholder. We will implement the actual contract call later.
        // For now, we return a dummy response that matches the frontend's mock data structure.
        const mockBatchData = {
            batch: {
                batchId: batchId,
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
                currentStage: 3,
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
            }, {
                tester: '0x789c12Ee8f86E7754G890D9D0D9E4F',
                testDate: '2024-06-23',
                testType: 'Pesticide Residue Test',
                passed: true,
                testResults: 'QmD4E5F6...',
                certificationId: 'AYUSH-PR-2024-568'
            }],
            iotData: [
                { sensorType: 'Temperature', value: '22.5', unit: '°C', timestamp: '1720002600' },
                { sensorType: 'Humidity', value: '45', unit: '%', timestamp: '1720002600' },
                { sensorType: 'GPS', value: '26.9124,75.7873', unit: 'coordinates', timestamp: '1720002600' }
            ]
        };

        res.json(mockBatchData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching batch details.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});