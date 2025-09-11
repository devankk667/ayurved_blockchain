const { ethers } = require("hardhat");

async function main() {
  console.log("Testing contract interaction...");
  
  // Connect to the local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Connected with address:", owner.address);
  
  // Contract address from deployment
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get contract ABI
  const contractArtifact = await hre.artifacts.readArtifact("AyurvedicHerbTracker");
  
  // Create contract instance
  const contract = new ethers.Contract(contractAddress, contractArtifact.abi, provider);
  
  console.log("Connected to contract at:", contractAddress);
  
  // Test getting the owner
  try {
    const ownerAddress = await contract.owner();
    console.log("Contract owner:", ownerAddress);
    
    // Check if the contract is initialized
    console.log("Checking contract initialization...");
    const isInitialized = await contract.initialized();
    console.log("Contract initialized:", isInitialized);
    
    // Try to get a batch
    console.log("\nTrying to get a batch...");
    const batchId = "ASH-2024-001";
    const batch = await contract.batches(batchId);
    console.log("Batch details:", batch);
    
    if (batch && batch.isActive) {
      console.log("Batch found!");
      console.log("Herb Name:", batch.herbName);
      console.log("Current Stage:", batch.currentStage);
    } else {
      console.log("Batch not found or not active");
    }
    
  } catch (error) {
    console.error("Error interacting with contract:");
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
