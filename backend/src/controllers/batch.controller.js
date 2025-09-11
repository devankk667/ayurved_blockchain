const web3Service = require('../services/web3.service');

class BatchController {
  async getBatchDetails(req, res, next) {
    try {
      const { batchId } = req.params;
      
      if (!batchId) {
        return res.status(400).json({ 
          success: false,
          message: 'Batch ID is required' 
        });
      }

      // Get data from blockchain
      const batchData = await web3Service.getBatchDetails(batchId);
      
      // For now, we'll use mock data that matches the frontend's expectations
      // In a real implementation, this would come from the blockchain
      const mockBatchData = this._getMockBatchData(batchId);
      
      res.json({
        success: true,
        data: mockBatchData
      });
      
    } catch (error) {
      console.error('Error in getBatchDetails:', error);
      next(error);
    }
  }

  // Private method to generate mock data
  _getMockBatchData(batchId) {
    return {
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
      qualityTests: [
        {
          tester: '0x789c12Ee8f86E7754G890D9D0D9E4F',
          testDate: '2024-06-22',
          testType: 'Heavy Metal Analysis',
          passed: true,
          testResults: 'QmA8B9C3...',
          certificationId: 'AYUSH-QC-2024-567'
        },
        {
          tester: '0x789c12Ee8f86E7754G890D9D0D9E4F',
          testDate: '2024-06-23',
          testType: 'Pesticide Residue Test',
          passed: true,
          testResults: 'QmD4E5F6...',
          certificationId: 'AYUSH-PR-2024-568'
        }
      ],
      iotData: [
        { sensorType: 'Temperature', value: '22.5', unit: '°C', timestamp: '1720002600' },
        { sensorType: 'Humidity', value: '45', unit: '%', timestamp: '1720002600' },
        { sensorType: 'GPS', value: '26.9124,75.7873', unit: 'coordinates', timestamp: '1720002600' }
      ]
    };
  }
}

module.exports = new BatchController();
