// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HerbBatch.sol";

contract HerbTrackerFactory {
    // Mappings
    mapping(address => bool) public farmers;
    mapping(address => bool) public processors;
    mapping(address => bool) public distributors;
    mapping(address => bool) public testers;
    
    // Batch management
    mapping(string => address) public batchAddresses;
    
    // Events
    event BatchCreated(string indexed batchId, address indexed batchAddress, address indexed farmer);
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

    address public owner;

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
    
    // Batch Creation
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
        require(batchAddresses[_batchId] == address(0), "Batch ID already exists");
        
        HerbBatch newBatch = new HerbBatch(
            _batchId,
            _herbName,
            _herbVariety,
            msg.sender,
            _farmLocation,
            _gpsCoordinates,
            _plantingDate,
            _harvestDate,
            _quantity,
            _soilCondition,
            _isOrganic,
            address(this) // Pass factory address for role checks
        );
        
        batchAddresses[_batchId] = address(newBatch);
        emit BatchCreated(_batchId, address(newBatch), msg.sender);
    }
    
    // Getters
    function getBatchAddress(string memory _batchId) public view returns (address) {
        return batchAddresses[_batchId];
    }
    
    // Role check functions (to be called by batch contracts)
    function isProcessor(address _address) external view returns (bool) {
        return processors[_address];
    }
    
    function isDistributor(address _address) external view returns (bool) {
        return distributors[_address];
    }
    
    function isTester(address _address) external view returns (bool) {
        return testers[_address];
    }
}
