const { contract } = require('../config/blockchain');

async function fetchNFTs(address) {
    try {
        // Fetch token IDs and metadata directly from the contract
        const tokenURIs = await contract.call('getOwnedTokensMetadata', [address]);
        const tokenIDs = await contract.call('getTokenIDs', [address]);

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
        // Supra SDK: send transaction to mintNFT
        const transaction = await contract.send('mintNFT', [to, tokenURI]);
        await transaction.wait();
        return { success: true, transactionHash: transaction.hash };
    } catch (error) {
        console.error('Failed to mint NFT:', error);
        throw error;
    }
}

async function transferNFT(from, to, tokenId) {
    try {
        // Supra SDK: send transaction to transferNFT
        const transaction = await contract.send('transferNFT', [from, to, tokenId]);
        await transaction.wait();
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