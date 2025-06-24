import React, { useState, useEffect } from 'react';
import './App.css';
import WalletConnect from './components/WalletConnect';
import AINFTAgent from './components/AINFTAgent';
import NFTGallery from './components/NFTGallery';
import MintNFT from './components/MintNFT';
import TransferNFT from './components/TransferNFT';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('ai-agent'); // ai-agent, gallery, mint, transfer

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet!');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'ai-agent':
        return <AINFTAgent walletAddress={walletAddress} />;
      case 'gallery':
        return <NFTGallery walletAddress={walletAddress} />;
      case 'mint':
        return <MintNFT walletAddress={walletAddress} />;
      case 'transfer':
        return <TransferNFT walletAddress={walletAddress} />;
      default:
        return <AINFTAgent walletAddress={walletAddress} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>🎨 AI NFT Studio</h1>
            <p>Create, Collect & Trade AI-Generated NFTs</p>
          </div>
          
          <WalletConnect 
            walletAddress={walletAddress}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </header>

      <nav className="app-navigation">
        <div className="nav-container">
          <button 
            className={`nav-btn ${activeTab === 'ai-agent' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-agent')}
          >
            🤖 AI Agent
          </button>
          <button 
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🎨 Gallery
          </button>
          <button 
            className={`nav-btn ${activeTab === 'mint' ? 'active' : ''}`}
            onClick={() => setActiveTab('mint')}
          >
            🪙 Mint NFT
          </button>
          <button 
            className={`nav-btn ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            🔄 Transfer
          </button>
        </div>
      </nav>

      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>© 2024 AI NFT Studio - Powered by AI & Blockchain Technology</p>
      </footer>
    </div>
  );
}

export default App;
