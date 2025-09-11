// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AyurvedicHerbTracker {
    address public owner;

    enum Stages {
        FARM,
        PROCESSING,
        DISTRIBUTION,
        RETAIL,
        CONSUMER
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
        Stages currentStage;
        bool isActive;
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

    struct Distribution {
        address distributor;
        address destination;
        uint256 shipDate;
        uint256 expectedDelivery;
        string transportConditions;
        bool temperatureControlled;
        string trackingId;
    }

    struct QualityTest {
        address tester;
        uint256 testDate;
        string testType;
        bool passed;
        string testResults;
        string certificationId;
    }

    struct IotData {
        string sensorType;
        string value;
        string unit;
        uint256 timestamp;
    }

    mapping(string => Batch) public batches;
    mapping(string => Processing[]) public processingHistory;
    mapping(string => Distribution[]) public distributionHistory;
    mapping(string => QualityTest[]) public qualityTestsHistory;
    mapping(string => IotData[]) public iotDataHistory;

    mapping(address => bool) public farmers;
    mapping(address => bool) public processors;
    mapping(address => bool) public distributors;
    mapping(address => bool) public testers;

    event BatchCreated(string batchId, string herbName, address indexed farmer);
    event ProcessingStepAdded(string batchId, address indexed processor);
    event DistributionStepAdded(string batchId, address indexed distributor);
    event QualityTestAdded(string batchId, address indexed tester, bool passed);
    event IotDataAdded(string batchId, string sensorType);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyFarmer() {
        require(farmers[msg.sender], "Only registered farmers can call this function");
        _;
    }

    modifier onlyProcessor() {
        require(processors[msg.sender], "Only registered processors can call this function");
        _;
    }

    modifier onlyDistributor() {
        require(distributors[msg.sender], "Only registered distributors can call this function");
        _;
    }

    modifier onlyTester() {
        require(testers[msg.sender], "Only registered testers can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addFarmer(address _farmer) public onlyOwner {
        farmers[_farmer] = true;
    }

    function addProcessor(address _processor) public onlyOwner {
        processors[_processor] = true;
    }

    function addDistributor(address _distributor) public onlyOwner {
        distributors[_distributor] = true;
    }

    function addTester(address _tester) public onlyOwner {
        testers[_tester] = true;
    }

    function createBatch(
        string memory _batchId,
        string memory _herbName,
        string memory _herbVariety,
        string memory _farmLocation,
        string memory _gpsCoordinates,
        uint256 _plantingDate,
        uint256 _harvestDate,
        uint256 _quantity,
        string memory _soilCondition,
        bool _isOrganic
    ) public onlyFarmer {
        require(batches[_batchId].isActive == false, "Batch ID already exists");

        batches[_batchId] = Batch({
            batchId: _batchId,
            herbName: _herbName,
            herbVariety: _herbVariety,
            farmer: msg.sender,
            farmLocation: _farmLocation,
            gpsCoordinates: _gpsCoordinates,
            plantingDate: _plantingDate,
            harvestDate: _harvestDate,
            quantity: _quantity,
            soilCondition: _soilCondition,
            isOrganic: _isOrganic,
            currentStage: Stages.FARM,
            isActive: true
        });

        emit BatchCreated(_batchId, _herbName, msg.sender);
    }

    function addProcessingStep(
        string memory _batchId,
        uint256 _processDate,
        string memory _processMethod,
        uint256 _temperature,
        uint256 _duration,
        string memory _qualityGrade,
        string memory _certificationHash,
        uint256 _outputQuantity
    ) public onlyProcessor {
        require(batches[_batchId].isActive, "Batch ID does not exist");

        processingHistory[_batchId].push(Processing({
            processor: msg.sender,
            processDate: _processDate,
            processMethod: _processMethod,
            temperature: _temperature,
            duration: _duration,
            qualityGrade: _qualityGrade,
            certificationHash: _certificationHash,
            outputQuantity: _outputQuantity
        }));

        batches[_batchId].currentStage = Stages.PROCESSING;
        emit ProcessingStepAdded(_batchId, msg.sender);
    }

    function addDistributionStep(
        string memory _batchId,
        address _destination,
        uint256 _shipDate,
        uint256 _expectedDelivery,
        string memory _transportConditions,
        bool _temperatureControlled,
        string memory _trackingId
    ) public onlyDistributor {
        require(batches[_batchId].isActive, "Batch ID does not exist");

        distributionHistory[_batchId].push(Distribution({
            distributor: msg.sender,
            destination: _destination,
            shipDate: _shipDate,
            expectedDelivery: _expectedDelivery,
            transportConditions: _transportConditions,
            temperatureControlled: _temperatureControlled,
            trackingId: _trackingId
        }));

        batches[_batchId].currentStage = Stages.DISTRIBUTION;
        emit DistributionStepAdded(_batchId, msg.sender);
    }

    function addQualityTest(
        string memory _batchId,
        uint256 _testDate,
        string memory _testType,
        bool _passed,
        string memory _testResults,
        string memory _certificationId
    ) public onlyTester {
        require(batches[_batchId].isActive, "Batch ID does not exist");

        qualityTestsHistory[_batchId].push(QualityTest({
            tester: msg.sender,
            testDate: _testDate,
            testType: _testType,
            passed: _passed,
            testResults: _testResults,
            certificationId: _certificationId
        }));

        emit QualityTestAdded(_batchId, msg.sender, _passed);
    }

    function addIotData(
        string memory _batchId,
        string memory _sensorType,
        string memory _value,
        string memory _unit,
        uint256 _timestamp
    ) public {
        require(batches[_batchId].isActive, "Batch ID does not exist");

        iotDataHistory[_batchId].push(IotData({
            sensorType: _sensorType,
            value: _value,
            unit: _unit,
            timestamp: _timestamp
        }));

        emit IotDataAdded(_batchId, _sensorType);
    }

    function getBatchDetails(string memory _batchId) public view returns (
        Batch memory,
        Processing[] memory,
        Distribution[] memory,
        QualityTest[] memory,
        IotData[] memory
    ) {
        require(batches[_batchId].isActive, "Batch ID does not exist");
        return (
            batches[_batchId],
            processingHistory[_batchId],
            distributionHistory[_batchId],
            qualityTestsHistory[_batchId],
            iotDataHistory[_batchId]
        );
    }
}
