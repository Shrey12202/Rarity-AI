# AI NFT Agent - Complete Integration Guide

## 🚀 Overview

This project integrates **Gemini AI** for image generation, **Groq AI** for prompt generation, and a **React frontend** with **Express backend** to create a complete AI-powered NFT creation system.

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Express) ←→ Python Script ←→ Gemini AI
                     ↓
                  Groq AI (Prompts)
```

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **npm** or **yarn**
4. **API Keys**:
   - Google Gemini API Key
   - Groq API Key

## 🔧 Setup Instructions

### 1. Environment Variables

Create `.env` file in `NFT/backend/`:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Blockchain Configuration (if using)
PRIVATE_KEY=your_private_key_here
RPC_URL=your_rpc_url_here
```

### 2. Install Dependencies

#### Backend Dependencies
```powershell
cd NFT/backend
npm install
```

#### Frontend Dependencies
```powershell
cd NFT/frontend
npm install
```

#### Python Dependencies
```powershell
cd NFT/backend
pip install google-generativeai pillow
```

### 3. Create Required Directories

```powershell
cd NFT/backend
mkdir uploads
mkdir uploads/ai-images
```

## 🚀 Running the Application

### Option 1: Use the Startup Script (Recommended)

```powershell
# From the main NFT directory
.\start_services.ps1
```

### Option 2: Manual Startup

#### Start Backend
```powershell
cd NFT/backend
npm start
```

#### Start Frontend (in a new terminal)
```powershell
cd NFT/frontend
npm start
```

## 🧪 Testing the Integration

### Test Python Script Directly
```powershell
cd NFT/backend
python gemini_image_generator.py "A futuristic robot in a cyberpunk city"
```

### Test Node.js Integration
```powershell
cd NFT/backend
node test_python_integration.js
```

### Test Backend API
```powershell
# Test prompt generation
curl -X POST http://localhost:3000/api/generate-prompts \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A magical forest"}'

# Test image generation
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A futuristic robot in a cyberpunk city"}'
```

## 🎨 Frontend Features

### AI NFT Agent Workflow

1. **Input Phase**: User enters their creative idea
2. **Prompt Generation**: Groq AI creates 5 unique prompts
3. **Image Generation**: Gemini AI creates the NFT image
4. **Details Generation**: AI generates name and description
5. **Minting**: NFT is minted to blockchain (mock for now)

### Key Components

- **AINFTAgent.js**: Main AI agent interface
- **NFTGallery.js**: Display generated NFTs
- **WalletConnect.js**: Wallet integration
- **MintNFT.js**: Manual NFT minting

## 🔧 Backend API Endpoints

### AI Routes (`/api`)

- `POST /generate-prompts` - Generate creative prompts using Groq
- `POST /generate-image` - Generate images using Gemini AI
- `POST /generate-nft-details` - Generate NFT metadata
- `POST /mint-ai-nft` - Mint the AI-generated NFT

### NFT Routes (`/api`)

- `GET /nfts` - Get all NFTs
- `POST /mint` - Mint a new NFT
- `POST /transfer` - Transfer an NFT

## 🐛 Troubleshooting

### Common Issues

1. **Python Import Errors**
   ```powershell
   pip uninstall google-generativeai google-genai
   pip install google-generativeai
   ```

2. **Port Already in Use**
   ```powershell
   # Check what's using the port
   netstat -ano | findstr :3000
   # Kill the process
   taskkill /PID <process_id> /F
   ```

3. **API Key Issues**
   - Verify API keys are correctly set in `.env`
   - Check API key permissions and quotas

4. **Image Generation Fails**
   - Check Gemini API quota
   - Verify prompt format
   - Check Python script permissions

### Debug Mode

Enable debug logging in backend:
```javascript
// In app.js
process.env.DEBUG = 'true';
```

## 📁 Project Structure

```
NFT/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── aiRoutes.js      # AI integration routes
│   │   │   └── nftRoutes.js     # NFT management routes
│   │   ├── controllers/
│   │   └── services/
│   ├── uploads/
│   │   └── ai-images/           # Generated images
│   ├── gemini_image_generator.py # Python image generator
│   ├── app.js                   # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AINFTAgent.js    # Main AI agent
│   │   │   ├── NFTGallery.js
│   │   │   └── WalletConnect.js
│   │   └── App.js
│   └── package.json
└── start_services.ps1           # Startup script
```

## 🔮 Future Enhancements

- [ ] Real blockchain integration
- [ ] Multiple AI model support
- [ ] Advanced rarity algorithms
- [ ] Social features
- [ ] Marketplace integration
- [ ] Mobile app

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure API keys are valid
4. Check console logs for errors
5. Test individual components separately

## 🎉 Success Indicators

✅ Backend starts without errors  
✅ Frontend loads at http://localhost:3002  
✅ AI NFT Agent component is visible  
✅ Python script generates images  
✅ API endpoints respond correctly  
✅ Images are saved to uploads/ai-images/  

---

**Happy NFT Creating! 🎨✨** 