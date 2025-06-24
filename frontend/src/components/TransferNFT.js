import React, { useState } from 'react';
import axios from 'axios';
import './styles/TransferNFT.css'; // Scoped styling for the TransferNFT component

function TransferNFT({ walletAddress }) {
  const [to, setTo] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [message, setMessage] = useState('');
  const [isTransferring, setIsTransferring] = useState(false); // Track transfer progress

  const handleTransfer = async (event) => {
    event.preventDefault();

    if (!walletAddress) {
      setMessage('Please connect your wallet.');
      return;
    }

    setIsTransferring(true); // Set transfer state to true
    setMessage('Transferring NFT, Please wait...');

    try {
      const response = await axios.post('http://localhost:3000/api/transfer', {
        from: walletAddress,
        to,
        tokenId,
      });

      setMessage(`NFT successfully transferred! Transaction Hash: ${response.data.transactionHash}`);
    } catch (error) {
      setMessage(`Error transferring NFT: ${error.response?.data || error.message}`);
    } finally {
      setIsTransferring(false); // Reset transfer state
    }
  };

  return (
    <div className="transfer-nft-container">
      <h2 className="transfer-nft-title">Transfer NFT</h2>
      <form className="transfer-nft-form" onSubmit={handleTransfer}>
        <label>
          From Address:
          <input
            type="text"
            value={walletAddress}
            readOnly
            className="input-field"
          />
        </label>
        <label>
          To Address:
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter recipient address"
            required
            className="input-field"
          />
        </label>
        <label>
          Token ID:
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID"
            required
            className="input-field"
          />
        </label>
        <button
          type="submit"
          className="transfer-nft-button"
          disabled={!walletAddress || isTransferring}
        >
          {isTransferring ? 'Transferring... Wait for Few Seconds!' : 'Transfer NFT'}
        </button>
      </form>
      {!isTransferring && message && (
        <p
          className={`transfer-nft-message ${
            message.includes('Error') ? 'error' : 'success'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default TransferNFT;
