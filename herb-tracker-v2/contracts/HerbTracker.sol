// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HerbTracker {
    // Batch structure with minimal fields
    struct Batch {
        string batchId;
        string herbName;
        address farmer;
        uint8 currentStage; // 0: Farming, 1: Processing, 2: Distribution, 3: Retail, 4: Consumer
        bool isActive;
    }

    // Role management
    address public owner;
    mapping(address => bool) public farmers;
    mapping(address => bool) public processors;
    mapping(address => bool) public distributors;
    mapping(address => bool) public testers;
    
    // Batch management
    mapping(string => Batch) public batches;
    mapping(string => string[]) public processingHistory;
    mapping(string => string[]) public distributionHistory;
    mapping(string => string[]) public qualityTests;
    mapping(string => string[]) public iotData;
    
    // Events
    event BatchCreated(string indexed batchId, address indexed farmer);
    event ProcessingStepAdded(string indexed batchId, address indexed processor, string details);
    event DistributionStepAdded(string indexed batchId, address indexed distributor, string details);
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

    // Role Management
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

    // Batch Management
    function addBatch(
        string memory _batchId,
        string memory _herbName
    ) public onlyFarmer {
        require(!batches[_batchId].isActive, "Batch ID already exists");
        
        Batch memory newBatch = Batch({
            batchId: _batchId,
            herbName: _herbName,
            farmer: msg.sender,
            currentStage: 0, // Farming stage
            isActive: true
        });
        
        batches[_batchId] = newBatch;
        emit BatchCreated(_batchId, msg.sender);
    }

    // Processing Functions
    function addProcessingStep(
        string memory _batchId,
        string memory _details
    ) public onlyProcessor batchExists(_batchId) {
        processingHistory[_batchId].push(_details);
        batches[_batchId].currentStage = 1; // Processing stage
        
        emit ProcessingStepAdded(_batchId, msg.sender, _details);
    }
    
    function getProcessingHistory(
        string memory _batchId
    ) public view batchExists(_batchId) returns (string[] memory) {
        return processingHistory[_batchId];
    }

    // Distribution Functions
    function addDistributionStep(
        string memory _batchId,
        string memory _details
    ) public onlyDistributor batchExists(_batchId) {
        distributionHistory[_batchId].push(_details);
        batches[_batchId].currentStage = 2; // Distribution stage
        
        emit DistributionStepAdded(_batchId, msg.sender, _details);
    }
    
    function getDistributionHistory(
        string memory _batchId
    ) public view batchExists(_batchId) returns (string[] memory) {
        return distributionHistory[_batchId];
    }

    // Quality Test Functions
    function addQualityTest(
        string memory _batchId,
        string memory _testDetails,
        bool _passed
    ) public onlyTester batchExists(_batchId) {
        qualityTests[_batchId].push(_testDetails);
        emit QualityTestAdded(_batchId, msg.sender, _passed);
    }
    
    function getQualityTests(
        string memory _batchId
    ) public view batchExists(_batchId) returns (string[] memory) {
        return qualityTests[_batchId];
    }

    // IoT Data Functions
    function addIotData(
        string memory _batchId,
        string memory _sensorType,
        string memory _value,
        string memory _unit
    ) public batchExists(_batchId) {
        string memory data = string(abi.encodePacked(
            '{"sensor":"', _sensorType, 
            '","value":"', _value, 
            '","unit":"', _unit, 
            '","timestamp":"', toString(block.timestamp), '"}'
        ));
        
        iotData[_batchId].push(data);
        emit IotDataAdded(_batchId, _sensorType);
    }
    
    function getIotData(
        string memory _batchId
    ) public view batchExists(_batchId) returns (string[] memory) {
        return iotData[_batchId];
    }
    
    // Helper function to convert uint to string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
