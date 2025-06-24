const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Generate prompts using Groq API
router.post('/generate-prompts', async (req, res) => {
  try {
    const { userInput } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      // Fallback prompts if no API key
      const fallbackPrompts = [
        `A futuristic digital art piece inspired by: ${userInput}`,
        `An abstract artistic interpretation of: ${userInput}`,
        `A vibrant, colorful representation of: ${userInput}`,
        `A minimalist, elegant design based on: ${userInput}`,
        `A fantasy-style artwork featuring: ${userInput}`
      ];
      return res.json({ prompts: fallbackPrompts });
    }
    
    // Call Groq API to generate prompts
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a creative AI assistant that generates 5 unique, artistic prompts for NFT creation. Each prompt should be different in style, mood, and artistic approach. Return only the prompts, one per line, without numbering or additional text.'
          },
          {
            role: 'user',
            content: `Generate 5 creative prompts for NFT creation based on this idea: ${userInput}`
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Groq API');
    }
    
    const prompts = data.choices[0].message.content.split('\n').filter(p => p.trim());
    
    if (prompts.length === 0) {
      throw new Error('No prompts generated');
    }
    
    res.json({ prompts });
  } catch (error) {
    console.error('Error generating prompts:', error);
    
    // Fallback prompts
    const fallbackPrompts = [
      `A futuristic digital art piece inspired by: ${req.body.userInput || 'your idea'}`,
      `An abstract artistic interpretation of: ${req.body.userInput || 'your idea'}`,
      `A vibrant, colorful representation of: ${req.body.userInput || 'your idea'}`,
      `A minimalist, elegant design based on: ${req.body.userInput || 'your idea'}`,
      `A fantasy-style artwork featuring: ${req.body.userInput || 'your idea'}`
    ];
    
    res.json({ prompts: fallbackPrompts });
  }
});

// Generate image using Python Gemini script
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Call the simplified Python script
    const pythonScript = path.join(__dirname, '../../simple_gemini_image.py');
    
    const pythonProcess = spawn('python', [pythonScript, prompt]);
    
    let result = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({ error: 'Failed to generate image' });
      }
      
      try {
        const data = JSON.parse(result);
        
        if (data.success && data.image_base64) {
          res.json({
            success: true,
            imageBase64: data.image_base64,
            prompt: data.prompt,
            timestamp: data.timestamp
          });
        } else {
          res.status(500).json({ error: data.error || 'Failed to generate image' });
        }
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        res.status(500).json({ error: 'Invalid response from image generator' });
      }
    });
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Generate NFT details
router.post('/generate-nft-details', async (req, res) => {
  try {
    const { prompt, userInput } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      // Fallback details if no API key
      return res.json({
        name: `AI Generated ${userInput || 'NFT'}`,
        description: `A unique AI-generated NFT based on: ${prompt || 'your idea'}. Created with Gemini AI technology.`
      });
    }
    
    // Call Groq API to generate NFT details
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a creative AI assistant that generates NFT names and descriptions. Return a JSON object with "name" and "description" fields.'
          },
          {
            role: 'user',
            content: `Generate a creative name and description for an NFT based on this prompt: "${prompt}" and original idea: "${userInput}". Return only valid JSON.`
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Groq API');
    }
    
    const content = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    try {
      const details = JSON.parse(content);
      res.json({
        name: details.name || `AI Generated ${userInput || 'NFT'}`,
        description: details.description || `A unique AI-generated NFT based on: ${prompt || 'your idea'}. Created with Gemini AI technology.`
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      res.json({
        name: `AI Generated ${userInput || 'NFT'}`,
        description: `A unique AI-generated NFT based on: ${prompt || 'your idea'}. Created with Gemini AI technology.`
      });
    }
  } catch (error) {
    console.error('Error generating NFT details:', error);
    res.status(500).json({ 
      name: `AI Generated ${req.body.userInput || 'NFT'}`,
      description: `A unique AI-generated NFT based on: ${req.body.prompt || 'your idea'}. Created with Gemini AI technology.`
    });
  }
});

// Mint AI NFT
router.post('/mint-ai-nft', async (req, res) => {
  try {
    const { name, description, imageUrl, prompt, walletAddress } = req.body;
    
    // Calculate rarity score based on prompt complexity and uniqueness
    const rarityScore = calculateRarityScore(prompt, name, description);
    const rarityLevel = getRarityLevel(rarityScore);
    
    // Generate metadata
    const metadata = {
      name,
      description,
      image: imageUrl,
      prompt,
      attributes: [
        { trait_type: 'Rarity', value: rarityLevel },
        { trait_type: 'Rarity Score', value: rarityScore.toFixed(2) },
        { trait_type: 'AI Generated', value: 'Yes' },
        { trait_type: 'Creation Method', value: 'Gemini AI' }
      ]
    };
    
    // Here you would integrate with your blockchain service
    // For now, return mock data
    const mockTransactionHash = '0x' + Math.random().toString(16).substr(2, 64);
    
    res.json({
      success: true,
      tokenId: Math.floor(Math.random() * 10000),
      transactionHash: mockTransactionHash,
      rarityScore,
      rarityLevel,
      metadata,
      detailedScores: {
        promptComplexity: Math.random() * 100,
        uniqueness: Math.random() * 100,
        artisticValue: Math.random() * 100
      }
    });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({ error: 'Failed to mint NFT' });
  }
});

// Helper functions
function calculateRarityScore(prompt, name, description) {
  let score = 50; // Base score
  
  // Add points for prompt complexity
  const words = prompt ? prompt.split(' ').length : 0;
  score += Math.min(words * 2, 30);
  
  // Add points for unique words
  const uniqueWords = prompt ? new Set(prompt.toLowerCase().split(' ')).size : 0;
  score += Math.min(uniqueWords * 1.5, 20);
  
  // Add random factor
  score += Math.random() * 20;
  
  return Math.min(score, 100);
}

function getRarityLevel(score) {
  if (score >= 90) return 'Legendary';
  if (score >= 80) return 'Epic';
  if (score >= 70) return 'Rare';
  if (score >= 50) return 'Uncommon';
  return 'Common';
}

module.exports = router; 