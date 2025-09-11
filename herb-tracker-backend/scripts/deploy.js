const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Starting deployment...");
  
  // Get signers to verify the network
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  
  // Get contract factory
  console.log("Getting contract factory...");
  const AyurvedicHerbTracker = await hre.ethers.getContractFactory("AyurvedicHerbTracker");
  
  // Deploy contract
  console.log("Deploying contract...");
  const ayurvedicHerbTracker = await AyurvedicHerbTracker.deploy();
  console.log("Deployment transaction sent, waiting for confirmation...");
  
  // Wait for deployment to complete
  await ayurvedicHerbTracker.waitForDeployment();
  const contractAddress = await ayurvedicHerbTracker.getAddress();
  
  console.log("\n--- Deployment Complete ---");
  console.log(`Contract deployed to: ${contractAddress}`);
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Network: ${hre.network.name} (Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId})`);
  
  // Save deployment info to a file
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    contract: {
      name: "AyurvedicHerbTracker",
      address: contractAddress,
      deployer: deployer.address,
      timestamp: new Date().toISOString()
    }
  };
  
  const deploymentPath = path.join(__dirname, '..', 'deployments', hre.network.name);
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(deploymentPath, 'deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to:", path.join(deploymentPath, 'deployment.json'));
  
  // Verify contract on Etherscan if not on localhost
  if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
    console.log("\nVerifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.error("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nDeployment failed!");
    console.error(error);
    process.exit(1);
  });
