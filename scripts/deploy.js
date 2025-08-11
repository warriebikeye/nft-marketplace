const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(2); // 2% fee
  await marketplace.deployed();
  console.log("Marketplace contract deployed to:", marketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
