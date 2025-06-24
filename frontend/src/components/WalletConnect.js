// StarkeyWalletConnect.js
import React from 'react';
import './styles/WalletConnect.css';

const WalletConnect = ({ walletAddress, onConnect, onDisconnect }) => {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect-container">
      {walletAddress ? (
        <div className="wallet-connected">
          <span className="wallet-address">{formatAddress(walletAddress)}</span>
          <button onClick={onDisconnect} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={onConnect} className="wallet-connect">
          🔗 Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
