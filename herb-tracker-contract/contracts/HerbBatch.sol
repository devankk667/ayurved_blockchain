// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HerbBatch {
    // Batch structure
    struct ProcessingStep {
        address processor;
        string details;
        uint256 timestamp;
    }
    
    struct DistributionStep {
        address distributor;
        string details;
        uint256 timestamp;
    }
    
    struct QualityTest {
        address tester;
        string details;
        bool passed;
        uint256 timestamp;
    }
    
    struct IotData {
        string sensorType;
        string value;
        string unit;
        uint256 timestamp;
    }
    
    // Batch properties
    string public batchId;
    string public herbName;
    string public herbVariety;
    address public farmer;
    string public farmLocation;
    string public gpsCoordinates;
    uint256 public plantingDate;
    uint256 public harvestDate;
    uint256 public quantity;
    string public soilCondition;
    bool public isOrganic;
    uint8 public currentStage; // 0: Farming, 1: Processing, 2: Distribution, 3: Retail, 4: Consumer
    bool public isActive;
    
    // Histories
    ProcessingStep[] public processingHistory;
    DistributionStep[] public distributionHistory;
    QualityTest[] public qualityTests;
    IotData[] public iotData;
    
    // Factory contract for role checks
    address public factory;
    
    // Events
    event ProcessingStepAdded(address indexed processor, string details);
    event DistributionStepAdded(address indexed distributor, string details);
    event QualityTestAdded(address indexed tester, bool passed);
    event IotDataAdded(string sensorType);
    
    // Modifiers
    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call this function");
        _;
    }
    
    modifier onlyProcessor() {
        (bool success, bytes memory data) = factory.staticcall(abi.encodeWithSignature("isProcessor(address)", msg.sender));
        require(success && abi.decode(data, (bool)), "Only processors can call this function");
        _;
    }
    
    modifier onlyDistributor() {
        (bool success, bytes memory data) = factory.staticcall(abi.encodeWithSignature("isDistributor(address)", msg.sender));
        require(success && abi.decode(data, (bool)), "Only distributors can call this function");
        _;
    }
    
    modifier onlyTester() {
        (bool success, bytes memory data) = factory.staticcall(abi.encodeWithSignature("isTester(address)", msg.sender));
        require(success && abi.decode(data, (bool)), "Only testers can call this function");
        _;
    }
    
    modifier isActiveBatch() {
        require(isActive, "Batch is not active");
        _;
    }
    
    // Constructor (can only be called by factory)
    constructor(
        string memory _batchId,
        string memory _herbName,
        string memory _herbVariety,
        address _farmer,
        string memory _farmLocation,
        string memory _gpsCoordinates,
        uint256 _plantingDate,
        uint256 _harvestDate,
        uint256 _quantity,
        string memory _soilCondition,
        bool _isOrganic,
        address _factory
    ) {
        batchId = _batchId;
        herbName = _herbName;
        herbVariety = _herbVariety;
        farmer = _farmer;
        farmLocation = _farmLocation;
        gpsCoordinates = _gpsCoordinates;
        plantingDate = _plantingDate;
        harvestDate = _harvestDate;
        quantity = _quantity;
        soilCondition = _soilCondition;
        isOrganic = _isOrganic;
        currentStage = 0; // Farming stage
        isActive = true;
        factory = _factory;
    }
    
    // Processing Functions
    function addProcessingStep(
        string memory _details
    ) public onlyProcessor isActiveBatch {
        processingHistory.push(ProcessingStep({
            processor: msg.sender,
            details: _details,
            timestamp: block.timestamp
        }));
        
        currentStage = 1; // Processing stage
        emit ProcessingStepAdded(msg.sender, _details);
    }
    
    function getProcessingHistoryCount() public view returns (uint) {
        return processingHistory.length;
    }
    
    // Distribution Functions
    function addDistributionStep(
        string memory _details
    ) public onlyDistributor isActiveBatch {
        distributionHistory.push(DistributionStep({
            distributor: msg.sender,
            details: _details,
            timestamp: block.timestamp
        }));
        
        currentStage = 2; // Distribution stage
        emit DistributionStepAdded(msg.sender, _details);
    }
    
    function getDistributionHistoryCount() public view returns (uint) {
        return distributionHistory.length;
    }
    
    // Quality Test Functions
    function addQualityTest(
        string memory _testDetails,
        bool _passed
    ) public onlyTester isActiveBatch {
        qualityTests.push(QualityTest({
            tester: msg.sender,
            details: _testDetails,
            passed: _passed,
            timestamp: block.timestamp
        }));
        
        emit QualityTestAdded(msg.sender, _passed);
    }
    
    function getQualityTestsCount() public view returns (uint) {
        return qualityTests.length;
    }
    
    // IoT Data Functions
    function addIotData(
        string memory _sensorType,
        string memory _value,
        string memory _unit
    ) public isActiveBatch {
        iotData.push(IotData({
            sensorType: _sensorType,
            value: _value,
            unit: _unit,
            timestamp: block.timestamp
        }));
        
        emit IotDataAdded(_sensorType);
    }
    
    function getIotDataCount() public view returns (uint) {
        return iotData.length;
    }
    
    // Admin Functions
    function deactivate() public onlyFactory {
        isActive = false;
    }
    
    function activate() public onlyFactory {
        isActive = true;
    }
    
    // Helper function to get batch summary
    function getBatchSummary() public view returns (
        string memory id,
        string memory name,
        string memory variety,
        address batchFarmer,
        uint8 stage,
        bool active
    ) {
        return (
            batchId,
            herbName,
            herbVariety,
            farmer,
            currentStage,
            isActive
        );
    }
}
