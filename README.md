# Rarity-AI

**Empowering creators to mint unique NFTs using AI and blockchain technology.**

The NFT Image Generator is an innovative platform that simplifies NFT creation by combining AI-driven image generation with secure blockchain integration. Users input text prompts, receive refined suggestions, generate unique images with rarity indices, and mint their chosen image as an NFT stored in their Supra wallet. Additional features include custom image uploads and NFT transfers.

---

## Features
- **AI-Powered Image Generation**: Users enter text prompts to generate unique images via the Gemini API.
- **Prompt Engineering**: Groq API suggests refined prompts for enhanced image quality.
- **Rarity Index**: Each generated image is assigned a rarity score for NFT valuation.
- **NFT Minting**: Selected images are minted as NFTs using the Supra SDK and stored in the Supra wallet.
- **Custom Uploads**: Users can upload their own images to create NFTs.
- **NFT Transfers**: Securely transfer NFTs via smart contracts.
- **User-Friendly UI**: Intuitive interface built with React and Material-UI.

---

## Tech Stack
- **Frontend**:
  - React: Component-based UI framework
  - Material-UI: React component library for styling
  - Ethers.js: Ethereum wallet integration
  - MetaMask SDK: Wallet connection
- **Backend**:
  - Node.js: Server-side runtime
  - Express.js: Web application framework
  - Ethers.js: Blockchain integration
  - Supra SDK: Supra blockchain integration
- **Smart Contracts**:
  - Solidity: Smart contract language
  - Hardhat: Development environment
  - Supra: Blockchain platform
- **APIs**:
  - Groq API: Prompt engineering for refined user inputs
  - Gemini API: High-quality image generation
- **Blockchain**: Supra blockchain for secure, low-fee transactions

---

## Project Structure
```
Rarity-AI/
├── frontend/                 # React frontend application
├── backend/                  # Node.js backend API
├── smart-contract/          # Solidity smart contracts
├── NFT/                     # Alternative backend with Supra SDK
└── docker-compose.yml       # Docker orchestration
```

---

## Installation

### Prerequisites
- Node.js (>=18.x)
- npm or yarn
- Docker and Docker Compose (for containerized setup)
- Supra wallet account
- API keys for Groq and Gemini APIs
- Supra SDK credentials

### Environment Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/Rarity-AI.git
   cd Rarity-AI
   ```

2. **Set up Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```sh
   cd backend
   cp .env.example .env  # if .env.example exists
   ```
   
   Add the following environment variables:
   ```env
   # API Keys
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Blockchain Configuration
   RPC_URL=your_supra_rpc_url
   PRIVATE_KEY=your_private_key
   CONTRACT_ADDRESS=your_deployed_contract_address
   
   # Server Configuration
   PORT=3002
   NODE_ENV=development
   ```

### Running the Project

#### Option 1: Docker Setup (Recommended)
1. **Start all services with Docker Compose**
   ```sh
   docker-compose up --build
   ```
   
   This will start:
   - Frontend on http://localhost:3000
   - Backend API on http://localhost:3002

2. **Stop the services**
   ```sh
   docker-compose down
   ```

#### Option 2: Local Development Setup

1. **Install Backend Dependencies**
   ```sh
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```sh
   cd ../frontend
   npm install
   ```

3. **Deploy Smart Contracts**
   ```sh
   cd ../smart-contract
   npm install
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network supra
   ```
   
   Copy the deployed contract address and update your `.env` file.

4. **Start Backend Server**
   ```sh
   cd ../backend
   npm start
   ```

5. **Start Frontend Application**
   ```sh
   cd ../frontend
   npm start
   ```

### Access the Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002

---

## Usage
1. **Connect Wallet**: Connect your Supra wallet using the wallet connect feature.
2. **Enter a Prompt**: Input a text prompt (e.g., "futuristic city").
3. **Refine Prompt**: Select from AI-suggested prompts powered by Groq API.
4. **Generate Images**: View AI-generated images (Gemini API) with rarity indices.
5. **Mint NFT**: Choose an image, mint it as an NFT, and store it in your Supra wallet.
6. **Additional Features**:
   - Upload custom images to mint as NFTs.
   - Transfer NFTs to other Supra wallets.
   - View your NFT collection in the dashboard.

---

## Smart Contract Deployment

The project includes a Supra NFT smart contract that handles:
- NFT minting with metadata
- NFT transfers between wallets
- Ownership tracking
- Token URI management

To deploy the smart contract:
```sh
cd smart-contract
npx hardhat run scripts/deploy.js --network supra
```

---

## Development

### Backend API Endpoints
- `POST /api/generate-prompts` - Generate AI prompts
- `POST /api/generate-image` - Generate AI images
- `POST /api/mint-nft` - Mint NFT
- `GET /api/nfts/:address` - Get user's NFTs
- `POST /api/transfer-nft` - Transfer NFT

### Frontend Components
- `WalletConnect` - Wallet connection
- `AINFTAgent` - AI image generation
- `NFTDashboard` - NFT management
- `NFTGallery` - NFT display
- `TransferNFT` - NFT transfers

---

## Future Work
- Train the rarity index model using Hugging Face's 70M+ image dataset for more accurate valuations.
- Develop an NFT marketplace for trading generated NFTs.
- Enhance AI prompt suggestions with advanced natural language models.
- Add support for multiple blockchain networks.
- Implement batch NFT minting capabilities.

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License
This project is licensed under the MIT License.

