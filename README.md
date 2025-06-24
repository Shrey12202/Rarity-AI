
# Rarity-AI

**Empowering creators to mint unique NFTs using AI and blockchain technology.**

The NFT Image Generator is an innovative platform that simplifies NFT creation by combining AI-driven image generation with secure blockchain integration. Users input text prompts, receive refined suggestions, generate unique images with rarity indices, and mint their chosen image as an NFT stored in their Supra wallet. Additional features include custom image uploads and NFT transfers.

---

## Features
- **AI-Powered Image Generation**: Users enter text prompts to generate unique images via the Gemini API.
- **Prompt Engineering**: Grok API suggests refined prompts for enhanced image quality.
- **Rarity Index**: Each generated image is assigned a rarity score for NFT valuation.
- **NFT Minting**: Selected images are minted as NFTs using the Supra SDK and stored in the Supra wallet.
- **Custom Uploads**: Users can upload their own images to create NFTs.
- **NFT Transfers**: Securely transfer NFTs via smart contracts.
- **User-Friendly UI**: Intuitive interface built with React, TypeScript, and Tailwind CSS.

---

## Tech Stack
- **Frontend**:
  - React: Component-based UI framework
  - TypeScript: Type-safe JavaScript
  - Tailwind CSS: Utility-first CSS for styling
- **Backend**:
  - Python: Core backend logic
  - Supra SDK: Blockchain integration for NFT minting and wallet operations
- **APIs**:
  - Grok API: Prompt engineering for refined user inputs
  - Gemini API: High-quality image generation
  - Supra SDK: Smart contract deployment and NFT management
- **Blockchain**: Supra blockchain for secure, low-fee transactions

---

## Installation

### Prerequisites
- Node.js (>=18.x)
- Python (>=3.8)
- Supra wallet account
- API keys for Grok and Gemini APIs
- Supra SDK credentials
- **Docker** and **Docker Compose** installed on your system.

### Steps to Run the Project

1. **Clone the Repository**
   ```sh
   git clone Rarity-AI
   cd Rarity-AI
   ```

2. **Start the Services**
   Run the following command in the project root (where `docker-compose.yml` is located):
   ```sh
   docker-compose up --build
   ```
   This will start both the backend and frontend services using the pre-built Docker images.

3. **Access the Applications**
   - **Frontend:** Open your browser and go to [http://localhost:3000](http://localhost:3000)
   - **Backend API:** Accessible at [http://localhost:5000](http://localhost:5000)

4. **Stopping the Services**
   To stop the running containers, press `Ctrl+C` in the terminal where Docker Compose is running, then:
   ```sh
   docker-compose down
   ```

---


## Usage
1. **Enter a Prompt**: Input a text prompt (e.g., "futuristic city").
2. **Refine Prompt**: Select from AI-suggested prompts powered by Grok API.
3. **Generate Images**: View AI-generated images (Gemini API) with rarity indices.
4. **Mint NFT**: Choose an image, mint it as an NFT, and store it in your Supra wallet.
5. **Additional Features**:
   - Upload custom images to mint as NFTs.
   - Transfer NFTs to other Supra wallets.

---

## Future Work
- Train the rarity index model using Hugging Face’s 70M+ image dataset for more accurate valuations.
- Develop an NFT marketplace for trading generated NFTs.
- Enhance AI prompt suggestions with advanced natural language models.

