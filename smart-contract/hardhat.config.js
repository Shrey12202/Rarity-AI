require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    supra: {
      url: "https://rpc-evm-devnet.supra.com/rpc/v1/eth",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
