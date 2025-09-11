const hre = require("hardhat");

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const AyurvedicHerbTracker = await hre.ethers.getContractAt("AyurvedicHerbTracker", contractAddress);

  const [owner, farmer, processor, distributor, tester] = await hre.ethers.getSigners();

  console.log("Seeding contract at:", contractAddress);
  console.log("Using accounts:");
  console.log("  Owner:", owner.address);
  console.log("  Farmer:", farmer.address);
  console.log("  Processor:", processor.address);
  console.log("  Distributor:", distributor.address);
  console.log("  Tester:", tester.address);

  // 1. Add roles
  console.log("\nAdding roles...");
  await AyurvedicHerbTracker.connect(owner).addFarmer(farmer.address);
  await AyurvedicHerbTracker.connect(owner).addProcessor(processor.address);
  await AyurvedicHerbTracker.connect(owner).addDistributor(distributor.address);
  await AyurvedicHerbTracker.connect(owner).addTester(tester.address);
  console.log("Roles added successfully.");

  // 2. Create a batch
  const batchId = "ASH-2024-001";
  console.log(`\nCreating batch with ID: ${batchId}...`);
  const plantingDate = Math.floor(new Date('2023-06-15').getTime() / 1000);
  const harvestDate = Math.floor(new Date('2023-12-20').getTime() / 1000);

  await AyurvedicHerbTracker.connect(farmer).createBatch(
    batchId,
    "Ashwagandha",
    "Withania somnifera",
    "Nagpur, Maharashtra",
    "21.1458° N, 79.0882° E",
    plantingDate,
    harvestDate,
    5000,
    "Rich loamy soil",
    true
  );
  console.log("Batch created successfully.");

  // 3. Add a processing step
  console.log("\nAdding processing step...");
  const processDate = Math.floor(new Date('2023-12-22').getTime() / 1000);
  await AyurvedicHerbTracker.connect(processor).addProcessingStep(
    batchId,
    processDate,
    "Sun Drying",
    32,
    72,
    "A+",
    "0xabc...",
    2500
  );
  console.log("Processing step added successfully.");

  // 4. Add a distribution step
  console.log("\nAdding distribution step...");
  const shipDate = Math.floor(new Date('2024-01-05').getTime() / 1000);
  const expectedDelivery = Math.floor(new Date('2024-01-15').getTime() / 1000);
  await AyurvedicHerbTracker.connect(distributor).addDistributionStep(
    batchId,
    "0x0000000000000000000000000000000000000001", // Sample destination
    shipDate,
    expectedDelivery,
    "20-25°C, 60% humidity",
    true,
    "TRK-ASH-2024-001"
  );
  console.log("Distribution step added successfully.");

  // 5. Add quality tests
  console.log("\nAdding quality tests...");
  const testDate1 = Math.floor(new Date('2023-12-25').getTime() / 1000);
  await AyurvedicHerbTracker.connect(tester).addQualityTest(
    batchId, testDate1, "Purity Test", true, "99.5% pure", "QC-ASH-2024-001"
  );
  const testDate2 = Math.floor(new Date('2023-12-26').getTime() / 1000);
  await AyurvedicHerbTracker.connect(tester).addQualityTest(
    batchId, testDate2, "Heavy Metal Screening", true, "All clear", "QC-ASH-2024-002"
  );
  const testDate3 = Math.floor(new Date('2023-12-27').getTime() / 1000);
  await AyurvedicHerbTracker.connect(tester).addQualityTest(
    batchId, testDate3, "Microbial Analysis", false, "E. coli detected", "QC-ASH-2024-003"
  );
  console.log("Quality tests added successfully.");

  console.log("\nSeeding complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
