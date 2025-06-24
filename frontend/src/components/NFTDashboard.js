import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/NFTDashboard.css'; // Scoped styling

function NFTDashboard({ walletAddress }) {
  const [nfts, setNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Define how many items to show per page
  const [searchAddress, setSearchAddress] = useState(walletAddress || '');
  const [error, setError] = useState('');

  const isValidAddress = (address) => address.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(address);

  const fetchNFTs = async (address) => {
    if (!isValidAddress(address)) {
      setError('Please enter a valid 42-character wallet address.');
      setNfts([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/nfts/${address}`);

      const nftsData = await Promise.all(
        response.data.map(async (nft) => {
          if (nft.tokenURI) {
            try {
              const metadataResponse = await axios.get(
                nft.tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
              );
              return { ...nft, metadata: metadataResponse.data };
            } catch (metadataError) {
              console.error(`Failed to fetch metadata for token ${nft.tokenId}:`, metadataError);
              return { ...nft, metadata: null };
            }
          } else {
            console.warn(`NFT with tokenId ${nft.tokenId} has no tokenURI.`);
            return { ...nft, metadata: null };
          }
        })
      );

      setNfts(nftsData);
      setError('');
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch NFTs.');
      setNfts([]);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchNFTs(walletAddress);
    }
  }, [walletAddress]);

  const handleSearch = () => {
    fetchNFTs(searchAddress);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination logic
  const indexOfLastNFT = currentPage * itemsPerPage;
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage;
  const currentNFTs = nfts.slice(indexOfFirstNFT, indexOfLastNFT);
  const totalPages = Math.ceil(nfts.length / itemsPerPage);

  return (
    <div className="nft-dashboard-container">
      <div className="dashboard-header">
        <h1>NFT Dashboard Collection</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter wallet address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="nft-collection">
        {currentNFTs.length > 0 ? (
          currentNFTs.map((nft, index) => (
            <div key={index} className="nft-item">
              {nft.metadata && nft.metadata.image ? (
                <img
                  src={nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                  alt={nft.metadata.name || `NFT ${nft.tokenId}`}
                  className="nft-image"
                />
              ) : (
                <div className="no-image">No image available</div>
              )}
              <h3 className="nft-title">{nft.metadata?.name || `NFT ${nft.tokenId}`}</h3>
              <p className="nft-description">
                {nft.metadata?.description || 'No description available'}
              </p>
              <p className="nft-symbol">
                <strong>Symbol:</strong> {nft.metadata?.symbol || 'N/A'}
              </p>
              <p className="nft-tokenid">
                <strong>Token ID:</strong> {nft.tokenId || 'N/A'}
              </p>
            </div>
          ))
        ) : (
          <p className="info-message">No NFTs found for this wallet.</p>
        )}
      </div>

      {nfts.length > itemsPerPage && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTDashboard;
