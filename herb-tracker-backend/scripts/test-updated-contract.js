const { ethers } = require("hardhat");

async function main() {
  console.log("Testing updated contract...");
  
  // Get signers
  const [owner, farmer, processor, distributor, tester] = await ethers.getSigners();
  console.log("Using accounts:");
  console.log("- Owner:", owner.address);
  console.log("- Farmer:", farmer.address);
  console.log("- Processor:", processor.address);
  console.log("- Distributor:", distributor.address);
  console.log("- Tester:", tester.address);
  
  // Deploy the contract
  console.log("\nDeploying contract...");
  const Contract = await ethers.getContractFactory("AyurvedicHerbTracker");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log("Contract deployed to:", contractAddress);
  
  // Add roles
  console.log("\nSetting up roles...");
  await contract.addFarmer(farmer.address);
  await contract.addProcessor(processor.address);
  await contract.addDistributor(distributor.address);
  await contract.addTester(tester.address);
  console.log("Roles set up successfully!");
  
  // Test adding a batch
  console.log("\nTesting addBatch...");
  const batchId = "TEST-2024-001";
  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - (30 * 24 * 60 * 60);
  const oneWeekAgo = currentTime - (7 * 24 * 60 * 60);
  
  const batchInfo = {
    herbName: "Ashwagandha",
    herbVariety: "Indian",
    farmLocation: "Organic Farm, Kerala, India",
    gpsCoordinates: "10.8505° N, 76.2711° E",
    plantingDate: oneMonthAgo,
    harvestDate: oneWeekAgo,
    quantity: 1000, // grams
    soilCondition: "Rich black soil with good drainage",
    isOrganic: true
  };
  
  // Connect as farmer and add batch
  const contractAsFarmer = contract.connect(farmer);
  await contractAsFarmer.addBatch(batchId, batchInfo);
  console.log("Batch added successfully!");
  
  // Verify batch was added
  const batch = await contract.batches(batchId);
  console.log("\nBatch details:");
  console.log("- Herb:", batch.herbName, "(" + batch.herbVariety + ")");
  console.log("- Farmer:", batch.farmer);
  console.log("- Current Stage:", batch.currentStage);
  console.log("- Is Active:", batch.isActive);
  
  console.log("\nTest completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
