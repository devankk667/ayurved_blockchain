const hre = require("hardhat");

async function main() {
  console.log("Starting simple deployment...");
  
  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Get contract factory
  console.log("Getting contract factory...");
  const Contract = await hre.ethers.getContractFactory("AyurvedicHerbTracker");
  
  // Deploy
  console.log("Deploying contract...");
  const contract = await Contract.deploy();
  
  console.log("Waiting for deployment to complete...");
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("\n--- Deployment Complete ---");
  console.log("Contract address:", address);
  console.log("Deployer:", deployer.address);
  
  // Save to a simple file
  const fs = require('fs');
  fs.writeFileSync('deployed-address.txt', address);
  console.log("\nAddress saved to deployed-address.txt");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
