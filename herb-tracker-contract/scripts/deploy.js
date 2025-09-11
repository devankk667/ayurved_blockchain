const hre = require("hardhat");

async function main() {
  console.log("Deploying HerbTracker contract...");
  
  // Deploy the contract
  const HerbTracker = await hre.ethers.getContractFactory("HerbTracker");
  const herbTracker = await HerbTracker.deploy();
  
  await herbTracker.waitForDeployment();
  
  console.log("HerbTracker deployed to:", await herbTracker.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
