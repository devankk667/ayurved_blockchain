// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Library to handle batch operations
library BatchLib {
    struct BatchInfo {
        string herbName;
        string herbVariety;
        string farmLocation;
        string gpsCoordinates;
        uint256 plantingDate;
        uint256 harvestDate;
        uint256 quantity;
        string soilCondition;
        bool isOrganic;
    }
    
    struct Batch {
        string batchId;
        string herbName;
        string herbVariety;
        address farmer;
        string farmLocation;
        string gpsCoordinates;
        uint256 plantingDate;
        uint256 harvestDate;
        uint256 quantity;
        string soilCondition;
        bool isOrganic;
        uint8 currentStage; // Using uint8 instead of enum to save space
        bool isActive;
    }
    
    function createBatch(
        string memory _batchId,
        address _farmer,
        BatchInfo memory _info
    ) internal pure returns (Batch memory) {
        return Batch({
            batchId: _batchId,
            herbName: _info.herbName,
            herbVariety: _info.herbVariety,
            farmer: _farmer,
            farmLocation: _info.farmLocation,
            gpsCoordinates: _info.gpsCoordinates,
            plantingDate: _info.plantingDate,
            harvestDate: _info.harvestDate,
            quantity: _info.quantity,
            soilCondition: _info.soilCondition,
            isOrganic: _info.isOrganic,
            currentStage: 0, // FARM stage
            isActive: true
        });
    }
}

// Library to handle processing operations
library ProcessingLib {
    struct ProcessingInfo {
        uint256 processDate;
        string processMethod;
        uint256 temperature;
        uint256 duration;
        string qualityGrade;
        string certificationHash;
        uint256 outputQuantity;
    }
    
    struct Processing {
        address processor;
        uint256 processDate;
        string processMethod;
        uint256 temperature;
        uint256 duration;
        string qualityGrade;
        string certificationHash;
        uint256 outputQuantity;
    }
    
    function createProcessing(
        address _processor,
        ProcessingInfo memory _info
    ) internal pure returns (Processing memory) {
        return Processing({
            processor: _processor,
            processDate: _info.processDate,
            processMethod: _info.processMethod,
            temperature: _info.temperature,
            duration: _info.duration,
            qualityGrade: _info.qualityGrade,
            certificationHash: _info.certificationHash,
            outputQuantity: _info.outputQuantity
        });
    }
}

// Library to handle distribution operations
library DistributionLib {
    struct DistributionInfo {
        address destination;
        uint256 shipDate;
        uint256 expectedDelivery;
        string transportConditions;
        bool temperatureControlled;
        string trackingId;
    }
    
    struct Distribution {
        address distributor;
        address destination;
        uint256 shipDate;
        uint256 expectedDelivery;
        string transportConditions;
        bool temperatureControlled;
        string trackingId;
    }
    
    function createDistribution(
        address _distributor,
        DistributionInfo memory _info
    ) internal pure returns (Distribution memory) {
        return Distribution({
            distributor: _distributor,
            destination: _info.destination,
            shipDate: _info.shipDate,
            expectedDelivery: _info.expectedDelivery,
            transportConditions: _info.transportConditions,
            temperatureControlled: _info.temperatureControlled,
            trackingId: _info.trackingId
        });
    }
}

// Library to handle quality test operations
library QualityTestLib {
    struct TestInfo {
        uint256 testDate;
        string testType;
        bool passed;
        string testResults;
        string certificationId;
    }
    
    struct QualityTest {
        address tester;
        uint256 testDate;
        string testType;
        bool passed;
        string testResults;
        string certificationId;
    }
    
    function createQualityTest(
        address _tester,
        TestInfo memory _info
    ) internal pure returns (QualityTest memory) {
        return QualityTest({
            tester: _tester,
            testDate: _info.testDate,
            testType: _info.testType,
            passed: _info.passed,
            testResults: _info.testResults,
            certificationId: _info.certificationId
        });
    }
}

// Library to handle IoT data operations
library IotDataLib {
    struct IotData {
        string sensorType;
        string value;
        string unit;
        uint256 timestamp;
    }
    
    function createIotData(
        string memory _sensorType,
        string memory _value,
        string memory _unit,
        uint256 _timestamp
    ) internal pure returns (IotData memory) {
        return IotData({
            sensorType: _sensorType,
            value: _value,
            unit: _unit,
            timestamp: _timestamp
        });
    }
}

contract AyurvedicHerbTrackerV2 {
    using BatchLib for BatchLib.Batch;
    using ProcessingLib for ProcessingLib.Processing;
    using DistributionLib for DistributionLib.Distribution;
    using QualityTestLib for QualityTestLib.QualityTest;
    using IotDataLib for IotDataLib.IotData;
    
    address public owner;
    
    // Mappings
    mapping(string => BatchLib.Batch) public batches;
    mapping(string => ProcessingLib.Processing[]) public processingHistory;
    mapping(string => DistributionLib.Distribution[]) public distributionHistory;
    mapping(string => QualityTestLib.QualityTest[]) public qualityTestsHistory;
    mapping(string => IotDataLib.IotData[]) public iotDataHistory;
    
    // Role management
    mapping(address => bool) public farmers;
    mapping(address => bool) public processors;
    mapping(address => bool) public distributors;
    mapping(address => bool) public testers;
    
    // Events
    event BatchCreated(string indexed batchId, address indexed farmer);
    event ProcessingStepAdded(string indexed batchId, address indexed processor);
    event DistributionStepAdded(string indexed batchId, address indexed distributor);
    event QualityTestAdded(string indexed batchId, address indexed tester, bool passed);
    event IotDataAdded(string indexed batchId, string sensorType);
    event RoleGranted(string role, address indexed account);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyFarmer() {
        require(farmers[msg.sender], "Only farmers can call this function");
        _;
    }
    
    modifier onlyProcessor() {
        require(processors[msg.sender], "Only processors can call this function");
        _;
    }
    
    modifier onlyDistributor() {
        require(distributors[msg.sender], "Only distributors can call this function");
        _;
    }
    
    modifier onlyTester() {
        require(testers[msg.sender], "Only testers can call this function");
        _;
    }
    
    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].isActive, "Batch ID does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    // Role Management Functions
    function addFarmer(address _farmer) public onlyOwner {
        farmers[_farmer] = true;
        emit RoleGranted("FARMER", _farmer);
    }
    
    function addProcessor(address _processor) public onlyOwner {
        processors[_processor] = true;
        emit RoleGranted("PROCESSOR", _processor);
    }
    
    function addDistributor(address _distributor) public onlyOwner {
        distributors[_distributor] = true;
        emit RoleGranted("DISTRIBUTOR", _distributor);
    }
    
    function addTester(address _tester) public onlyOwner {
        testers[_tester] = true;
        emit RoleGranted("TESTER", _tester);
    }
    
    // Helper function to convert enum to uint8
    function stageToUint8(Stages stage) internal pure returns (uint8) {
        return uint8(stage);
    }
    
    // Helper function to convert uint8 to enum
    function uint8ToStage(uint8 stage) internal pure returns (Stages) {
        require(stage <= 4, "Invalid stage value");
        return Stages(stage);
    }
    
    // Batch Management Functions
    function addBatch(
        string memory _batchId,
        BatchLib.BatchInfo memory _batchInfo
    ) public onlyFarmer {
        require(!batches[_batchId].isActive, "Batch ID already exists");
        require(msg.sender != address(0), "Invalid farmer address");
        
        batches[_batchId] = BatchLib.createBatch(_batchId, msg.sender, _batchInfo);
        emit BatchCreated(_batchId, msg.sender);
    }
    
    function getBatch(string memory _batchId) public view returns (
        string memory batchId,
        string memory herbName,
        string memory herbVariety,
        address farmer,
        string memory farmLocation,
        string memory gpsCoordinates,
        uint256 plantingDate,
        uint256 harvestDate,
        uint256 quantity,
        string memory soilCondition,
        bool isOrganic,
        uint8 currentStage,
        bool isActive
    ) {
        BatchLib.Batch memory batch = batches[_batchId];
        return (
            batch.batchId,
            batch.herbName,
            batch.herbVariety,
            batch.farmer,
            batch.farmLocation,
            batch.gpsCoordinates,
            batch.plantingDate,
            batch.harvestDate,
            batch.quantity,
            batch.soilCondition,
            batch.isOrganic,
            batch.currentStage,
            batch.isActive
        );
    }
    
    // Processing Functions
    function addProcessingStep(
        string memory _batchId,
        ProcessingLib.ProcessingInfo memory _processingInfo
    ) public onlyProcessor batchExists(_batchId) {
        ProcessingLib.Processing memory processing = ProcessingLib.createProcessing(
            msg.sender,
            _processingInfo
        );
        
        processingHistory[_batchId].push(processing);
        batches[_batchId].currentStage = stageToUint8(Stages.PROCESSING);
        
        emit ProcessingStepAdded(_batchId, msg.sender);
    }
    
    function getProcessingHistory(
        string memory _batchId
    ) public view batchExists(_batchId) returns (ProcessingLib.Processing[] memory) {
        return processingHistory[_batchId];
    }
    
    // Helper function to get the latest processing step
    function getLatestProcessing(
        string memory _batchId
    ) public view batchExists(_batchId) returns (ProcessingLib.Processing memory) {
        ProcessingLib.Processing[] storage history = processingHistory[_batchId];
        require(history.length > 0, "No processing history found");
        return history[history.length - 1];
    }
    
    // Distribution Functions
    function addDistributionStep(
        string memory _batchId,
        DistributionLib.DistributionInfo memory _distributionInfo
    ) public onlyDistributor batchExists(_batchId) {
        DistributionLib.Distribution memory distribution = DistributionLib.createDistribution(
            msg.sender,
            _distributionInfo
        );
        
        distributionHistory[_batchId].push(distribution);
        batches[_batchId].currentStage = stageToUint8(Stages.DISTRIBUTION);
        
        emit DistributionStepAdded(_batchId, msg.sender);
    }
    
    function getDistributionHistory(
        string memory _batchId
    ) public view batchExists(_batchId) returns (DistributionLib.Distribution[] memory) {
        return distributionHistory[_batchId];
    }
    
    // Quality Test Functions
    function addQualityTest(
        string memory _batchId,
        QualityTestLib.TestInfo memory _testInfo
    ) public onlyTester batchExists(_batchId) {
        QualityTestLib.QualityTest memory test = QualityTestLib.createQualityTest(
            msg.sender,
            _testInfo
        );
        
        qualityTestsHistory[_batchId].push(test);
        emit QualityTestAdded(_batchId, msg.sender, _testInfo.passed);
    }
    
    function getQualityTests(
        string memory _batchId
    ) public view batchExists(_batchId) returns (QualityTestLib.QualityTest[] memory) {
        return qualityTestsHistory[_batchId];
    }
    
    // IoT Data Functions
    function addIotData(
        string memory _batchId,
        string memory _sensorType,
        string memory _value,
        string memory _unit,
        uint256 _timestamp
    ) public batchExists(_batchId) {
        IotDataLib.IotData memory data = IotDataLib.createIotData(
            _sensorType,
            _value,
            _unit,
            _timestamp
        );
        
        iotDataHistory[_batchId].push(data);
        emit IotDataAdded(_batchId, _sensorType);
    }
    
    function getIotData(
        string memory _batchId
    ) public view batchExists(_batchId) returns (IotDataLib.IotData[] memory) {
        return iotDataHistory[_batchId];
    }
    
    // Batch Stage Management
    function updateBatchStage(
        string memory _batchId,
        Stages _newStage
    ) public batchExists(_batchId) {
        require(
            msg.sender == owner || 
            (msg.sender == batches[_batchId].farmer && _newStage == Stages.FARM) ||
            (processors[msg.sender] && _newStage == Stages.PROCESSING) ||
            (distributors[msg.sender] && _newStage == Stages.DISTRIBUTION),
            "Not authorized to update this stage"
        );
        
        batches[_batchId].currentStage = stageToUint8(_newStage);
    }
    
    // Batch Status Management
    function deactivateBatch(string memory _batchId) public onlyOwner batchExists(_batchId) {
        batches[_batchId].isActive = false;
    }
    
    function activateBatch(string memory _batchId) public onlyOwner {
        require(!batches[_batchId].isActive, "Batch is already active");
        batches[_batchId].isActive = true;
    }
    
    // Batch Search and Verification
    function verifyBatchExistence(string memory _batchId) public view returns (bool) {
        return batches[_batchId].isActive;
    }
    
    function getBatchStage(string memory _batchId) public view batchExists(_batchId) returns (uint8) {
        return batches[_batchId].currentStage;
    }
    
    // Enum for batch stages
    enum Stages {
        FARM,
        PROCESSING,
        DISTRIBUTION,
        RETAIL,
        CONSUMER
    }
}
