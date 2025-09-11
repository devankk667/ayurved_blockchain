const hre = require("hardhat");

async function main() {
  console.log("Starting to seed data...");
  
  // Get signers
  const [owner, farmer, processor, distributor, tester] = await hre.ethers.getSigners();
  console.log("Using accounts:");
  console.log("- Owner:", owner.address);
  console.log("- Farmer:", farmer.address);
  console.log("- Processor:", processor.address);
  console.log("- Distributor:", distributor.address);
  console.log("- Tester:", tester.address);
  
  // Get contract instance
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  console.log("\nConnecting to contract at:", contractAddress);
  const contract = await hre.ethers.getContractAt("AyurvedicHerbTracker", contractAddress);
  
  // Add a batch
  const batchId = "ASH-2024-001";
  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - (30 * 24 * 60 * 60);
  const oneWeekAgo = currentTime - (7 * 24 * 60 * 60);
  
  console.log("\nAdding batch...");
  await contract.connect(farmer).addBatch(
    batchId,
    "Ashwagandha",
    "Indian",
    farmer.address,
    "Organic Farm, Kerala, India",
    "10.8505° N, 76.2711° E",
    oneMonthAgo,  // plantingDate
    oneWeekAgo,    // harvestDate
    true,         // isOrganic
    "1000",       // quantity in grams
    "Rich black soil with good drainage"
  );
  
  console.log("Batch added successfully!");
  
  // Add processing step
  console.log("\nAdding processing step...");
  await contract.connect(processor).addProcessingStep(
    batchId,
    oneWeekAgo + 86400,  // processDate (1 day after harvest)
    "Sun Drying",
    35,                  // temperature in Celsius
    48,                  // duration in hours
    "Grade A",
    "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",  // IPFS hash
    950                  // outputQuantity in grams
  );
  
  console.log("Processing step added!");
  
  // Add distribution step
  console.log("\nAdding distribution step...");
  await contract.connect(distributor).addDistributionStep(
    batchId,
    "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",  // destination address
    oneWeekAgo + (2 * 86400),  // shipDate (2 days after harvest)
    oneWeekAgo + (5 * 86400),  // expectedDelivery (5 days after harvest)
    "Temperature controlled",
    true,                     // temperatureControlled
    "SHIP123456789"          // trackingId
  );
  
  console.log("Distribution step added!");
  
  // Add quality test
  console.log("\nAdding quality test...");
  await contract.connect(tester).addQualityTest(
    batchId,
    oneWeekAgo + (3 * 86400),  // testDate (3 days after harvest)
    "Purity Test",
    true,                      // passed
    "No contaminants detected. Purity: 99.8%",
    "CERT-2024-001"
  );
  
  console.log("Quality test added!");
  
  console.log("\n--- Seeding Complete ---");
  console.log("Batch ID:", batchId);
  console.log("Contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
