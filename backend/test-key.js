require('dotenv').config();
const { Wallet } = require('ethers');

console.log('=== PRIVATE KEY DEBUG ===');
console.log('PRIVATE_KEY from env:', process.env.PRIVATE_KEY);
console.log('PRIVATE_KEY length:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 'undefined');
console.log('PRIVATE_KEY starts with 0x:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.startsWith('0x') : 'undefined');

try {
    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log('✅ SUCCESS: Wallet created successfully');
    console.log('Wallet address:', wallet.address);
} catch (error) {
    console.log('❌ ERROR creating wallet:');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Error value:', error.value);
} 