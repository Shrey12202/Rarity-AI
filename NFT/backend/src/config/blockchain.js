const { SupraProvider, SupraWallet, SupraContract } = require('@supra-org/web3.js');
require('dotenv').config();

// Replace with your Supra endpoint and private key in .env
const provider = new SupraProvider(process.env.SUPRA_RPC_URL);
const wallet = new SupraWallet(process.env.SUPRA_PRIVATE_KEY, provider);
const contractABI = require('../contractABI.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new SupraContract(contractAddress, contractABI, wallet);

module.exports = { provider, wallet, contract }; 