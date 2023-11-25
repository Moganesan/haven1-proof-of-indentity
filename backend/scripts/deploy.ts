import { ethers } from "hardhat";

async function main() {
  const POIContract = "0x074272C55821d0AAf35bd6d9ECe4C4e75D39D711";
  const signer = await ethers.getSigners();
  const creator = await signer[0].getAddress();

  const contract = await ethers.deployContract("SocialHub", [
    creator,
    POIContract,
    1,
  ]);

  await contract.waitForDeployment();

  console.log(`Contract Deployed :${await contract.getAddress()}`);
  console.log(`Creator :${creator}`);
  console.log(`POI Contract :${POIContract}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
