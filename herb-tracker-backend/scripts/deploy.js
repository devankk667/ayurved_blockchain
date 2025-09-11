const hre = require("hardhat");

async function main() {
  const AyurvedicHerbTracker = await hre.ethers.getContractFactory("AyurvedicHerbTracker");
  const ayurvedicHerbTracker = await AyurvedicHerbTracker.deploy();

  // The .deployed() function is deprecated. Use waitForDeployment() instead.
  await ayurvedicHerbTracker.waitForDeployment();

  const contractAddress = await ayurvedicHerbTracker.getAddress();
  console.log(
    `AyurvedicHerbTracker deployed to: ${contractAddress}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
