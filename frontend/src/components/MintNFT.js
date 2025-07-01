import React, { useState } from 'react';
import axios from 'axios';
import './styles/MintNFT.css'; // Scoped styling for the MintNFT component

function MintNFT({ walletAddress }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [symbol, setSymbol] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isMinting, setIsMinting] = useState(false); // State to track minting status

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleMint = async (event) => {
    event.preventDefault();

    if (!walletAddress) {
      setMessage('Please connect your wallet.');
      return;
    }

    setIsMinting(true); // Set minting state to true
    setMessage('Minting NFT, Wait for a few minutes!');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('symbol', symbol);
      formData.append('image', image);
      formData.append('walletAddress', walletAddress);

      const response = await axios.post('http://localhost:3002/api/mint', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setMessage(`NFT successfully minted! Transaction Hash: ${response.data.transactionHash}`);
    } catch (error) {
      setMessage(`Error minting NFT: ${error.response?.data || error.message}`);
    } finally {
      setIsMinting(false); // Hide the minting message when the process is done
    }
  };

  return (
    <div className="mint-nft-container">
      <h2 className="mint-nft-title">Mint Your NFT</h2>
      <form className="mint-nft-form" onSubmit={handleMint}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter NFT name"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter NFT description"
            required
          />
        </label>
        <label>
          Symbol:
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter NFT symbol"
            required
          />
        </label>
        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageUpload} required />
        </label>
        <button type="submit" className="mint-nft-button" disabled={!walletAddress || isMinting}>
          {isMinting ? 'Minting... Wait for Few Seconds!' : 'Mint NFT'}
        </button>
      </form>
      {!isMinting && message && <p className="mint-nft-message">{message}</p>}
    </div>
  );
}

export default MintNFT;
