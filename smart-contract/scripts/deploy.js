const { ethers } = require("hardhat");

async function main() {
  const SupraNFT = await ethers.getContractFactory("SupraNFT");
  const contract = await SupraNFT.deploy("SupraNFT", "SNFT");
  await contract.waitForDeployment();
  console.log("Deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
