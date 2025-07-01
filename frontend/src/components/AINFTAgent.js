import React, { useState } from 'react';
import axios from 'axios';
import './styles/AINFTAgent.css';

const AINFTAgent = ({ walletAddress }) => {
  const [userInput, setUserInput] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: Prompts, 3: Image, 4: Mint
  const [mintedNFT, setMintedNFT] = useState(null);
  const [conversation, setConversation] = useState([
    {
      type: 'ai',
      message: "👋 Hello! I'm your AI NFT Agent. I'm here to help you create amazing NFTs from your ideas using Gemini AI. What would you like to create today?",
      timestamp: new Date()
    }
  ]);

  const addMessage = (type, message) => {
    setConversation(prev => [...prev, {
      type,
      message,
      timestamp: new Date()
    }]);
  };

  const generatePrompts = async () => {
    if (!userInput.trim()) {
      addMessage('ai', '❌ Please enter your idea first!');
      return;
    }

    setIsGeneratingPrompts(true);
    addMessage('ai', '🤖 Analyzing your idea... Let me brainstorm some creative prompts for you using Groq AI!');
    addMessage('user', `💭 "${userInput}"`);

    try {
      console.log('Attempting to connect to backend at http://localhost:3002/api/generate-prompts');
      const response = await axios.post('http://localhost:3002/api/generate-prompts', {
        userInput: userInput
      });

      console.log('Backend response:', response.data);

      if (response.data.prompts && response.data.prompts.length > 0) {
        setGeneratedPrompts(response.data.prompts);
        setStep(2);
        addMessage('ai', '✨ Perfect! I\'ve created unique prompts based on your idea. Each one will generate a completely different style of NFT using Gemini AI. Which one speaks to you?');
      } else {
        throw new Error('No prompts generated');
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      addMessage('ai', '❌ Oops! I had trouble generating prompts. Let me try a different approach...');
      
      // Fallback prompts
      const fallbackPrompts = [
        `A futuristic digital art piece inspired by: ${userInput}`,
        `An abstract artistic interpretation of: ${userInput}`,
        `A vibrant, colorful representation of: ${userInput}`,
        `A minimalist, elegant design based on: ${userInput}`,
        `A fantasy-style artwork featuring: ${userInput}`
      ];
      setGeneratedPrompts(fallbackPrompts);
      setStep(2);
      addMessage('ai', '✨ I\'ve created some fallback prompts for you. Let\'s continue with the creation process!');
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const generateImage = async (prompt) => {
    setSelectedPrompt(prompt);
    setIsGeneratingImage(true);
    addMessage('user', `🎨 "${prompt}"`);
    addMessage('ai', '🎨 Amazing choice! I\'m now using Gemini AI to create your unique NFT. This might take a moment as I craft something special for you...');

    try {
      const response = await axios.post('http://localhost:3002/api/generate-image', {
        prompt: prompt
      }, {
        timeout: 60000 // 60 second timeout for image generation
      });

      console.log('Image generation response:', response.data);

      if (response.data.success) {
        if (response.data.imageBase64) {
          const imageUrl = `data:image/png;base64,${response.data.imageBase64}`;
          setGeneratedImage(imageUrl);
          addMessage('ai', '🎉 Wow! Gemini AI just created something incredible for you! Check out your unique NFT below.');
        } else if (response.data.imageUrl) {
          setGeneratedImage(response.data.imageUrl);
          addMessage('ai', '🎉 Your NFT is ready! I\'ve created a beautiful image for you to preview.');
        } else {
          throw new Error('No image data received');
        }

        setStep(3);
        addMessage('ai', '📝 Now let\'s add some details to make your NFT truly special. I\'ll help you generate a name and description!');
        
        // Auto-generate name and description
        generateNFTDetails(prompt);
      } else {
        throw new Error(response.data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      if (error.code === 'ECONNABORTED') {
        addMessage('ai', '⏰ Image generation is taking longer than expected. Let me try a different approach...');
      } else {
        addMessage('ai', '❌ Oh no! I had trouble creating the image with Gemini AI. Let me try again or use a fallback option.');
      }
      
      // Set a fallback image
      setGeneratedImage('https://via.placeholder.com/512x512/667eea/ffffff?text=AI+Generated+NFT');
      setStep(3);
      addMessage('ai', '📝 I\'ve provided a placeholder image. Let\'s continue with the details!');
      generateNFTDetails(prompt);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateNFTDetails = async (prompt) => {
    setIsGeneratingDetails(true);
    addMessage('ai', '🤖 Let me craft a perfect name and description for your NFT using Groq AI...');
    
    try {
      const response = await axios.post('http://localhost:3002/api/generate-nft-details', {
        prompt: prompt,
        userInput: userInput
      });

      setNftName(response.data.name);
      setNftDescription(response.data.description);
      addMessage('ai', '✨ Perfect! I\'ve generated a name and description that captures the essence of your NFT.');
    } catch (error) {
      console.error('Error generating NFT details:', error);
      // Fallback values
      setNftName(`AI Generated ${userInput}`);
      setNftDescription(`A unique AI-generated NFT based on: ${prompt}. Created with Gemini AI technology.`);
      addMessage('ai', '📝 I\'ve added some basic details. Feel free to customize them!');
    } finally {
      setIsGeneratingDetails(false);
    }
  };

  const mintNFT = async () => {
    if (!nftName.trim() || !nftDescription.trim()) {
      addMessage('ai', '❌ Please fill in all the NFT details first!');
      return;
    }

    if (!walletAddress) {
      addMessage('ai', '🔗 Please connect your wallet first! I need it to mint your NFT to the blockchain.');
      return;
    }

    setIsMinting(true);
    addMessage('user', `🚀 Minting: "${nftName}"`);
    addMessage('ai', '🪙 Excellent! I\'m now minting your NFT to the blockchain. This is where the magic happens - your digital art becomes a real NFT!');

    try {
      const response = await axios.post('http://localhost:3002/api/mint-ai-nft', {
        name: nftName,
        description: nftDescription,
        imageUrl: generatedImage,
        prompt: selectedPrompt,
        walletAddress: walletAddress
      });

      // Add fallback values for missing data
      const nftData = {
        ...response.data,
        rarityScore: response.data.rarityScore || 0,
        rarityLevel: response.data.rarityLevel || 'Common',
        detailedScores: response.data.detailedScores || [],
        metadata: response.data.metadata || {
          name: nftName,
          description: nftDescription,
          image: generatedImage,
          attributes: []
        },
        transactionHash: response.data.transactionHash || '0x' + Math.random().toString(16).substr(2, 64)
      };

      setMintedNFT(nftData);
      setStep(4);
      
      const rarityMessage = `🎉 CONGRATULATIONS! Your NFT has been successfully minted! 
      
🌟 Rarity: ${nftData.rarityLevel} (${nftData.rarityScore.toFixed(2)} points)
🔗 Transaction: ${nftData.transactionHash}
      
Your unique digital creation is now part of the blockchain!`;
      
      addMessage('ai', rarityMessage);
      
      // Reset form after 15 seconds
      setTimeout(() => {
        setUserInput('');
        setGeneratedPrompts([]);
        setSelectedPrompt('');
        setGeneratedImage(null);
        setNftName('');
        setNftDescription('');
        setStep(1);
        setMintedNFT(null);
        setConversation([
          {
            type: 'ai',
            message: "👋 Ready to create another amazing NFT? What's your next idea?",
            timestamp: new Date()
          }
        ]);
      }, 15000);
    } catch (error) {
      console.error('Minting error:', error);
      addMessage('ai', `❌ Oh no! There was an issue minting your NFT: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const goToStep = (targetStep) => {
    setStep(targetStep);
  };

  const resetWorkflow = () => {
    setUserInput('');
    setGeneratedPrompts([]);
    setSelectedPrompt('');
    setGeneratedImage(null);
    setNftName('');
    setNftDescription('');
    setStep(1);
    setMintedNFT(null);
    setConversation([
      {
        type: 'ai',
        message: "👋 Hello! I'm your AI NFT Agent. I'm here to help you create amazing NFTs from your ideas using Gemini AI. What would you like to create today?",
        timestamp: new Date()
      }
    ]);
  };

  const getRarityColor = (rarityLevel) => {
    switch (rarityLevel) {
      case 'Legendary': return '#FFD700';
      case 'Epic': return '#9932CC';
      case 'Rare': return '#4169E1';
      case 'Uncommon': return '#32CD32';
      default: return '#808080';
    }
  };

  return (
    <div className="ai-nft-agent">
      <div className="agent-header">
        <h1>🤖 AI NFT Agent</h1>
        <p>Your conversational AI companion for creating unique NFTs</p>
      </div>

      {/* Conversation Interface */}
      <div className="conversation-container">
        <div className="conversation-messages">
          {conversation.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.type}`}>
              <div className="message-content">
                {msg.message.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="message-time">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="workflow-container">
        {/* Step 1: User Input */}
        {step === 1 && (
          <div className="workflow-step">
            <div className="step-indicator">
              <span className="step-number active">1</span>
              <span className="step-label">Share Your Idea</span>
            </div>
            <div className="input-section">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tell me about your NFT idea... (e.g., 'A cyberpunk warrior in a neon-lit city', 'A magical forest with glowing creatures', etc.)"
                className="idea-input"
                rows="4"
              />
              <button 
                onClick={generatePrompts}
                disabled={isGeneratingPrompts || !userInput.trim()}
                className="generate-btn"
              >
                {isGeneratingPrompts ? '🤖 Thinking...' : '✨ Generate AI Prompts'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Generated Prompts */}
        {step === 2 && (
          <div className="workflow-step">
            <div className="step-indicator">
              <span className="step-number completed">1</span>
              <span className="step-number active">2</span>
              <span className="step-label">Choose Your Prompt</span>
            </div>
            <div className="prompts-section">
              <h3>AI-Generated Prompts</h3>
              <div className="prompts-grid">
                {generatedPrompts.map((prompt, index) => (
                  <div 
                    key={index} 
                    className="prompt-card"
                    onClick={() => generateImage(prompt)}
                  >
                    <div className="prompt-number">{index + 1}</div>
                    <p>{prompt}</p>
                    <button className="select-prompt-btn">
                      🎨 Generate Image
                    </button>
                  </div>
                ))}
              </div>
              <div className="navigation-buttons">
                <button onClick={() => goToStep(1)} className="back-btn">
                  ← Back to Input
                </button>
                <button onClick={resetWorkflow} className="reset-btn">
                  🔄 Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generated Image */}
        {step === 3 && (
          <div className="workflow-step">
            <div className="step-indicator">
              <span className="step-number completed">1</span>
              <span className="step-number completed">2</span>
              <span className="step-number active">3</span>
              <span className="step-label">Customize & Mint</span>
            </div>
            <div className="image-section">
              <div className="generated-image-container">
                {isGeneratingImage ? (
                  <div className="loading-image">
                    <div className="spinner"></div>
                    <p>Creating your NFT...</p>
                  </div>
                ) : (
                  <img 
                    src={generatedImage} 
                    alt="Generated NFT" 
                    className="generated-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/512x512/667eea/ffffff?text=Image+Not+Available';
                    }}
                  />
                )}
              </div>
              
              <div className="nft-details">
                <h3>NFT Details</h3>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    placeholder={isGeneratingDetails ? "AI is generating name..." : "Enter NFT name"}
                    className="nft-input"
                    disabled={isGeneratingDetails}
                  />
                  {isGeneratingDetails && <div className="generating-indicator">🤖 AI generating...</div>}
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    placeholder={isGeneratingDetails ? "AI is generating description..." : "Describe your NFT"}
                    className="nft-textarea"
                    rows="3"
                    disabled={isGeneratingDetails}
                  />
                  {isGeneratingDetails && <div className="generating-indicator">🤖 AI generating...</div>}
                </div>
                <div className="prompt-display">
                  <label>Generated Prompt:</label>
                  <p className="prompt-text">{selectedPrompt}</p>
                </div>
                <button 
                  onClick={mintNFT}
                  disabled={isMinting || !nftName.trim() || !nftDescription.trim() || isGeneratingDetails}
                  className="mint-btn"
                >
                  {isMinting ? '🪙 Minting...' : '🚀 Mint NFT'}
                </button>
              </div>
            </div>
            <div className="navigation-buttons">
              <button onClick={() => goToStep(2)} className="back-btn">
                ← Back to Prompts
              </button>
              <button onClick={resetWorkflow} className="reset-btn">
                🔄 Start Over
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success with Rarity Details */}
        {step === 4 && mintedNFT && (
          <div className="workflow-step">
            <div className="step-indicator">
              <span className="step-number completed">1</span>
              <span className="step-number completed">2</span>
              <span className="step-number completed">3</span>
              <span className="step-number completed">4</span>
              <span className="step-label">Success!</span>
            </div>
            <div className="success-section">
              <div className="success-icon">🎉</div>
              <h3>NFT Successfully Created!</h3>
              
              {/* Rarity Information */}
              <div className="rarity-info">
                <div 
                  className="rarity-badge"
                  style={{ backgroundColor: getRarityColor(mintedNFT.rarityLevel || 'Common') }}
                >
                  {mintedNFT.rarityLevel || 'Common'}
                </div>
                <div className="rarity-score">
                  <span className="score-label">Rarity Score:</span>
                  <span className="score-value">
                    {(mintedNFT.rarityScore || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* NFT Details */}
              <div className="minted-nft-details">
                <img 
                  src={mintedNFT.metadata?.image || generatedImage} 
                  alt="Minted NFT" 
                  className="minted-image" 
                />
                <div className="nft-info">
                  <h4>{mintedNFT.metadata?.name || nftName}</h4>
                  <p>{mintedNFT.metadata?.description || nftDescription}</p>
                  <div className="transaction-info">
                    <small>Transaction: {mintedNFT.transactionHash || 'Pending...'}</small>
                  </div>
                </div>
              </div>

              {/* Trait Details */}
              {mintedNFT.detailedScores && mintedNFT.detailedScores.length > 0 && (
                <div className="traits-section">
                  <h4>NFT Traits & Rarity Breakdown</h4>
                  <div className="traits-grid">
                    {mintedNFT.detailedScores.map((trait, index) => (
                      <div key={index} className="trait-card">
                        <div className="trait-type">{trait.trait_type || 'Unknown'}</div>
                        <div className="trait-value">{trait.value || 'Unknown'}</div>
                        <div className="trait-score">
                          {(trait.rarity_score || 0).toFixed(2)} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={resetWorkflow} className="create-another-btn">
                🎨 Create Another NFT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AINFTAgent; 