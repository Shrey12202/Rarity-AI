import React from 'react';
import ReactDOM from 'react-dom/client';
import { MetaMaskProvider } from '@metamask/sdk-react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);