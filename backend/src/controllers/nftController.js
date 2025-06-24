const nftService = require('../services/nftService');
const PinataClient = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

async function uploadMetadataToIPFS(metadata) {
  try {
    const result = await pinata.pinJSONToIPFS(metadata);
    console.log('Metadata uploaded to IPFS:', result);
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata');
  }
}

async function uploadImageToIPFS(filePath) {
  try {
    const readableStreamForFile = fs.createReadStream(filePath);
    // Extract the original filename
    const filename = path.basename(filePath);

    // Include pinataMetadata with name
    const options = {
      pinataMetadata: {
        name: filename, // Provide the file's name
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    // Upload file to IPFS
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
   
    console.log('Image uploaded to IPFS:', result);
    return `ipfs://${result.IpfsHash}`; // Return the IPFS URI
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image');
  }
}

async function getNFTs(req, res) {
  try {
    const address = req.params.address;
    const nfts = await nftService.fetchNFTs(address);
    res.json(nfts);
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

async function mintNFT(req, res) {
  try {
    const { name, description, symbol, walletAddress } = req.body;
    const imageFile = req.file;

    if (!name || !description || !symbol || !walletAddress || !imageFile) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Step 1: Upload image to IPFS
    const imageIPFS = await uploadImageToIPFS(imageFile.path);

    // Step 2: Create metadata
    const metadata = {
      name,
      description,
      symbol,
      image: imageIPFS,
    };

    // Step 3: Upload metadata to IPFS
    const metadataIPFS = await uploadMetadataToIPFS(metadata);

    // Step 4: Mint NFT with metadata URI
    const result = await nftService.mintNFT(walletAddress, metadataIPFS);

    // Cleanup temporary file
    fs.unlinkSync(imageFile.path);

    res.json(result);
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).send(error.toString());
  }
}

async function transferNFT(req, res) {
  try {
    const { from, to, tokenId } = req.body;
    const result = await nftService.transferNFT(from, to, tokenId);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

module.exports = {
  getNFTs,
  mintNFT,
  transferNFT,
};
