const { ethers } = require("hardhat");

async function main() {
  console.log("Testing HerbTracker contract...");
  
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
  const Contract = await ethers.getContractFactory("HerbTracker");
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
  
  await contract.connect(farmer).addBatch(
    batchId,
    "Ashwagandha",
    "Indian",
    "Organic Farm, Kerala, India",
    "10.8505° N, 76.2711° E",
    oneMonthAgo,
    oneWeekAgo,
    1000, // grams
    "Rich black soil with good drainage",
    true
  );
  console.log("Batch added successfully!");
  
  // Verify batch was added
  const batch = await contract.batches(batchId);
  console.log("\nBatch details:");
  console.log("- Herb:", batch.herbName, `(${batch.herbVariety})`);
  console.log("- Farmer:", batch.farmer);
  console.log("- Quantity:", batch.quantity.toString(), "grams");
  console.log("- Current Stage:", batch.currentStage, "(0=FARM)");
  console.log("- Is Active:", batch.isActive);
  
  // Test processing step
  console.log("\nAdding processing step...");
  await contract.connect(processor).addProcessingStep(
    batchId,
    "Dried at 45°C for 1 hour, output 900g"
  );
  console.log("Processing step added!");
  
  // Test distribution step
  console.log("\nAdding distribution step...");
  await contract.connect(distributor).addDistributionStep(
    batchId,
    "Shipped to distributor, tracking: TRK123456789, expected delivery in 3 days"
  );
  console.log("Distribution step added!");
  
  // Test quality test
  console.log("\nAdding quality test...");
  await contract.connect(tester).addQualityTest(
    batchId,
    "Purity test: 99.9% pure, no contaminants detected, certification: CERT-2024-001",
    true
  );
  console.log("Quality test added!");
  
  // Test IoT data
  console.log("\nAdding IoT data...");
  await contract.connect(user).addIotData(
    batchId,
    "Temperature",
    "23.5",
    "°C"
  );
  console.log("IoT data added!");
  
  // Get all batch data
  console.log("\nRetrieving batch data...");
  const [
    updatedBatch,
    processingHistory,
    distributionHistory,
    qualityTests,
    iotData
  ] = await Promise.all([
    contract.batches(batchId),
    contract.getProcessingHistory(batchId),
    contract.getDistributionHistory(batchId),
    contract.getQualityTests(batchId),
    contract.getIotData(batchId)
  ]);
  
  console.log("\nBatch Summary:");
  console.log("- ID:", batchId);
  console.log("- Current Stage:", updatedBatch.currentStage);
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
