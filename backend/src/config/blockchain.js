// src/config/blockchain.js
const ethers = require('ethers');

let provider, wallet, contract;

// Only initialize blockchain if environment variables are available
if (process.env.RPC_URL && process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS) {
  try {
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Try to load contract ABI, but don't fail if it doesn't exist
    let contractABI = [];
    try {
      contractABI = require('../contractABI.json');
    } catch (error) {
      console.log('Contract ABI not found, using empty array');
    }
    
    const contractAddress = process.env.CONTRACT_ADDRESS;
    contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    console.log('✅ Blockchain configuration loaded successfully');
  } catch (error) {
    console.log('⚠️ Blockchain configuration failed to load:', error.message);
    console.log('Continuing without blockchain features...');
  }
} else {
  console.log('⚠️ Blockchain environment variables not found');
  console.log('Continuing without blockchain features...');
}

module.exports = { provider, wallet, contract };