import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/NFTGallery.css';

const NFTGallery = ({ walletAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, owned, ai-generated

  useEffect(() => {
    fetchNFTs();
  }, [walletAddress]);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/nfts');
      setNfts(response.data);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setError('Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredNFTs = () => {
    switch (filter) {
      case 'owned':
        return nfts.filter(nft => nft.owner === walletAddress);
      case 'ai-generated':
        return nfts.filter(nft => nft.metadata?.attributes?.some(attr => attr.trait_type === 'AI Generated'));
      default:
        return nfts;
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNFTImage = (nft) => {
    if (nft.image) return nft.image;
    if (nft.tokenURI) return nft.tokenURI;
    return 'https://via.placeholder.com/300x300/667eea/ffffff?text=NFT';
  };

  const filteredNFTs = getFilteredNFTs();

  if (loading) {
    return (
      <div className="nft-gallery">
        <div className="gallery-header">
          <h2>🎨 NFT Gallery</h2>
          <p>Loading your NFT collection...</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching NFTs from blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-gallery">
      <div className="gallery-header">
        <h2>🎨 NFT Gallery</h2>
        <p>Discover and showcase your digital art collection</p>
        
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All NFTs ({nfts.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'owned' ? 'active' : ''}`}
            onClick={() => setFilter('owned')}
          >
            My Collection ({nfts.filter(nft => nft.owner === walletAddress).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'ai-generated' ? 'active' : ''}`}
            onClick={() => setFilter('ai-generated')}
          >
            AI Generated ({nfts.filter(nft => nft.metadata?.attributes?.some(attr => attr.trait_type === 'AI Generated')).length})
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {filteredNFTs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>No NFTs Found</h3>
          <p>
            {filter === 'all' && 'Start creating your first NFT!'}
            {filter === 'owned' && 'You haven\'t minted any NFTs yet.'}
            {filter === 'ai-generated' && 'No AI-generated NFTs found.'}
          </p>
        </div>
      ) : (
        <div className="nft-grid">
          {filteredNFTs.map((nft, index) => (
            <div key={nft.tokenId || index} className="nft-card">
              <div className="nft-image-container">
                <img 
                  src={getNFTImage(nft)} 
                  alt={nft.name || `NFT #${nft.tokenId}`}
                  className="nft-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/667eea/ffffff?text=NFT';
                  }}
                />
                {nft.metadata?.attributes?.some(attr => attr.trait_type === 'AI Generated') && (
                  <div className="ai-badge">🤖 AI</div>
                )}
              </div>
              
              <div className="nft-info">
                <h3 className="nft-name">
                  {nft.name || `NFT #${nft.tokenId}`}
                </h3>
                <p className="nft-description">
                  {nft.description || nft.metadata?.description || 'No description available'}
                </p>
                
                <div className="nft-details">
                  <div className="nft-owner">
                    <span className="label">Owner:</span>
                    <span className="address">{formatAddress(nft.owner)}</span>
                  </div>
                  
                  {nft.metadata?.attributes && (
                    <div className="nft-attributes">
                      {nft.metadata.attributes.map((attr, idx) => (
                        <div key={idx} className="attribute">
                          <span className="attribute-label">{attr.trait_type}:</span>
                          <span className="attribute-value">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="nft-actions">
                  <button className="view-btn">👁️ View Details</button>
                  {nft.owner === walletAddress && (
                    <button className="transfer-btn">🔄 Transfer</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTGallery; 