const hre = require("hardhat");

async function main() {
  console.log("Deploying HerbTracker contract...");
  
  // Deploy the contract
  const HerbTracker = await hre.ethers.getContractFactory("HerbTracker");
  const herbTracker = await HerbTracker.deploy();
  
  await herbTracker.waitForDeployment();
  
  const contractAddress = await herbTracker.getAddress();
  console.log("HerbTracker deployed to:", contractAddress);
  
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
  
  // Return the contract address for potential use in other scripts
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
