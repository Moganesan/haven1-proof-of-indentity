const { ethers } = require("hardhat");

async function main() {
  const contract = await ethers.deployContract("SampleStoragePOI.sol");
  console.log(contract.address);
}

main();
