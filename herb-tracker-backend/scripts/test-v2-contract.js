const { ethers } = require("hardhat");

async function main() {
  console.log("Testing AyurvedicHerbTrackerV2 contract...");
  
  // Get signers
  const [owner, farmer, processor, distributor, tester, user] = await ethers.getSigners();
  
  console.log("Using accounts:");
  console.log("- Owner:", owner.address);
  console.log("- Farmer:", farmer.address);
  console.log("- Processor:", processor.address);
  console.log("- Distributor:", distributor.address);
  console.log("- Tester:", tester.address);
  console.log("- User:", user.address);
  
  // Deploy the contract
  console.log("\nDeploying contract...");
  const Contract = await ethers.getContractFactory("AyurvedicHerbTrackerV2");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log("Contract deployed to:", contractAddress);
  
  // Add roles
  console.log("\nSetting up roles...");
  await contract.connect(owner).addFarmer(farmer.address);
  await contract.connect(owner).addProcessor(processor.address);
  await contract.connect(owner).addDistributor(distributor.address);
  await contract.connect(owner).addTester(tester.address);
  console.log("Roles set up successfully!");
  
  // Test adding a batch
  console.log("\nTesting addBatch...");
  const batchId = "TEST-2024-001";
  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - (30 * 24 * 60 * 60);
  const oneWeekAgo = currentTime - (7 * 24 * 60 * 60);
  
  // Convert batch info to array format expected by the contract
  const batchInfo = [
    "Ashwagandha",      // herbName
    "Indian",           // herbVariety
    "Organic Farm, Kerala, India",  // farmLocation
    "10.8505° N, 76.2711° E",       // gpsCoordinates
    oneMonthAgo,        // plantingDate
    oneWeekAgo,         // harvestDate
    1000,               // quantity (grams)
    "Rich black soil with good drainage",  // soilCondition
    true                // isOrganic
  ];
  
  // Add batch as farmer
  await contract.connect(farmer).addBatch(batchId, batchInfo);
  console.log("Batch added successfully!");
  
  // Verify batch was added
  const batch = await contract.getBatch(batchId);
  console.log("\nBatch details:");
  console.log("- Herb:", batch.herbName, `(${batch.herbVariety})`);
  console.log("- Farmer:", batch.farmer);
  console.log("- Quantity:", batch.quantity, "grams");
  console.log("- Current Stage:", batch.currentStage, "(0=FARM)");
  console.log("- Is Active:", batch.isActive);
  
  // Test processing step
  console.log("\nAdding processing step...");
  const processingInfo = [
    currentTime,  // processDate
    "Drying and Powdering",  // processMethod
    45,           // temperature (Celsius)
    3600,         // duration (1 hour in seconds)
    "A+",         // qualityGrade
    "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",  // certificationHash
    900           // outputQuantity (grams)
  ];
  
  await contract.connect(processor).addProcessingStep(batchId, processingInfo);
  console.log("Processing step added!");
  
  // Test distribution step
  console.log("\nAdding distribution step...");
  const distributionInfo = [
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  // destination (sample address)
    currentTime,  // shipDate
    currentTime + (3 * 24 * 60 * 60),  // expectedDelivery (3 days from now)
    "Temperature controlled between 20-25°C",  // transportConditions
    true,         // temperatureControlled
    "TRK123456789"  // trackingId
  ];
  
  await contract.connect(distributor).addDistributionStep(batchId, distributionInfo);
  console.log("Distribution step added!");
  
  // Test quality test
  console.log("\nAdding quality test...");
  const testInfo = [
    currentTime,  // testDate
    "Purity",     // testType
    true,         // passed
    "99.9% pure, no contaminants detected",  // testResults
    "CERT-2024-001"  // certificationId
  ];
  
  await contract.connect(tester).addQualityTest(batchId, testInfo);
  console.log("Quality test added!");
  
  // Test IoT data
  console.log("\nAdding IoT data...");
  await contract.connect(user).addIotData(
    batchId,
    "Temperature",
    "23.5",
    "°C",
    currentTime
  );
  console.log("IoT data added!");
  
  // Get all batch data
  console.log("\nRetrieving batch data...");
  const [
    batchData,
    processingHistory,
    distributionHistory,
    qualityTests,
    iotData
  ] = await Promise.all([
    contract.getBatch(batchId),
    contract.getProcessingHistory(batchId),
    contract.getDistributionHistory(batchId),
    contract.getQualityTests(batchId),
    contract.getIotData(batchId)
  ]);
  
  console.log("\nBatch Summary:");
  console.log("- ID:", batchId);
  console.log("- Current Stage:", batchData[11]); // currentStage is at index 11
  console.log("- Processing Steps:", processingHistory.length);
  console.log("- Distribution Records:", distributionHistory.length);
  console.log("- Quality Tests:", qualityTests.length);
  console.log("- IoT Data Points:", iotData.length);
  
  console.log("\n✅ All tests completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
