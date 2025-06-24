const { contract } = require('../config/blockchain');

async function fetchNFTs(address) {
    try {
        // Fetch token IDs and metadata directly from the contract
        const tokenURIs = await contract.getOwnedTokensMetadata(address);
        const tokenIDs = await contract.getTokenIDs(address);

        // Combine token IDs with their respective metadata
        const tokens = tokenIDs.map((tokenId, index) => ({
            tokenId: tokenId.toString(),
            tokenURI: tokenURIs[index],
        }));

        return tokens;
    } catch (error) {
        console.error('Failed to fetch NFTs:', error);
        throw error;
    }
}

async function mintNFT(to, tokenURI) {
    try {
        const transaction = await contract.mintNFT(to, tokenURI);
        await transaction.wait();
        return { success: true, transactionHash: transaction.hash };
    } catch (error) {
        console.error('Failed to mint NFT:', error);
        throw error;
    }
}


async function transferNFT(from, to, tokenId) {
    try {
        console.log("start transfer");
        // The transaction sends a call to the 'transferNFT' function of the contract.
        const transaction = await contract.transferNFT(from, to, tokenId);
        // Wait for the transaction to be mined
        await transaction.wait();
        console.log("start end");
        // Returning the transaction hash can be useful for tracking and verification by the client
        return { success: true, transactionHash: transaction.hash };
    } catch (error) {
        console.error('Failed to transfer NFT:', error);
        throw error;
    }
}

module.exports = {
    fetchNFTs,
    mintNFT,
    transferNFT
};