const hre = require("hardhat");

async function main() {
  console.log("Deploying HerbTrackerV2 contract...");
  
  // Deploy the contract
  const HerbTrackerV2 = await hre.ethers.getContractFactory("HerbTrackerV2");
  const herbTracker = await HerbTrackerV2.deploy();
  
  await herbTracker.waitForDeployment();
  
  console.log("HerbTrackerV2 deployed to:", await herbTracker.getAddress());
  
  // Add some test roles
  const [owner, farmer, processor, distributor, tester] = await hre.ethers.getSigners();
  
  console.log("\nSetting up test roles...");
  await herbTracker.addFarmer(farmer.address);
  await herbTracker.addProcessor(processor.address);
  await herbTracker.addDistributor(distributor.address);
  await herbTracker.addTester(tester.address);
  
  console.log("\nTest accounts:");
  console.log("- Owner:", owner.address);
  console.log("- Farmer:", farmer.address);
  console.log("- Processor:", processor.address);
  console.log("- Distributor:", distributor.address);
  console.log("- Tester:", tester.address);
  
  console.log("\n✅ Deployment and setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
