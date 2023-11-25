import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("ProofOfIdentity");
  await contract.waitForDeployment();

  console.log(`POI Contract Deployed: ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
