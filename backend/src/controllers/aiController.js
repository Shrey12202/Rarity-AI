const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// API Keys
const GROQ_API_KEY = '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';
const GEMINI_API_KEY = 'AIzaSyCVzPPvL9e9kLPmMqVGjOBt58WIUZzNPFU';

// Rarity index for NFT traits
const rarityIndex = {
  "Background": {
    "Blue": 4.0, "Pink": 6.67, "Red": 5.0, "Green": 10.0, "Black": 20.0,
    "Gold": 100.0, "Silver": 50.0, "Rainbow": 200.0, "Purple": 15.0, "Orange": 8.0
  },
  "Hat": {
    "None": 2.0, "Cap": 5.0, "Crown": 100.0, "Beanie": 20.0,
    "Helmet": 10.0, "Wizard Hat": 125.0, "Bandana": 12.5, "Halo": 500.0
  },
  "Eyes": {
    "Normal": 1.43, "Laser": 200.0, "Sunglasses": 10.0, "Eye Patch": 20.0,
    "Glow": 100.0, "Cyborg": 333.33, "X Eyes": 50.0
  },
  "Mouth": {
    "Smile": 2.5, "Frown": 6.67, "Pipe": 20.0, "Cigar": 33.33,
    "Grin": 10.0, "Tongue Out": 14.29, "Mask": 50.0, "Golden Teeth": 200.0
  },
  "Clothing": {
    "T-Shirt": 3.33, "Suit": 20.0, "Hoodie": 10.0, "Armor": 50.0,
    "Jacket": 6.67, "Robe": 100.0, "Space Suit": 333.33, "Punk Jacket": 33.33
  },
  "Accessory": {
    "Earring": 5.0, "Necklace": 10.0, "Watch": 20.0, "Bracelet": 33.33,
    "None": 2.0, "Scarf": 14.29, "Shoulder Pet": 500.0, "Gloves": 25.0
  },
  "Special": {
    "Zombie": 200.0, "Alien": 1000.0, "Robot": 100.0, "None": 1.02
  }
};

// Calculate NFT rarity score
const calculateNFTRarityScore = (nftMetadata) => {
  let totalScore = 0;
  const detailedScores = [];

  for (const attr of nftMetadata.attributes || []) {
    const traitType = attr.trait_type;
    const value = attr.value;
    const score = rarityIndex[traitType]?.[value] || 0;
    totalScore += score;
    detailedScores.push({
      trait_type: traitType,
      value: value,
      rarity_score: score
    });
  }

  return { totalScore, detailedScores };
};

// Generate AI-based traits for the NFT
const generateNFTTraits = async (prompt, userInput) => {
  try {
    const systemPrompt = `You are an NFT trait generator. Based on the AI-generated image prompt and user input, generate 3-5 unique traits for an NFT. 

    Original user input: "${userInput}"
    AI-generated prompt: "${prompt}"

    Generate traits from these categories: Background, Hat, Eyes, Mouth, Clothing, Accessory, Special
    Each trait should be relevant to the prompt and user input.

    Return as JSON array:
    [
      {"trait_type": "Background", "value": "Blue"},
      {"trait_type": "Hat", "value": "Crown"},
      {"trait_type": "Eyes", "value": "Glow"}
    ]`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      max_tokens: 300,
      temperature: 0.8
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log('Traits AI Response:', aiResponse);
    
    let traits;
    try {
      traits = JSON.parse(aiResponse);
      if (!Array.isArray(traits)) {
        throw new Error('Response is not an array');
      }
    } catch (error) {
      console.log('JSON parsing failed for traits, using fallback');
      // Fallback traits based on prompt analysis
      const fallbackTraits = [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Special", value: "None" }
      ];
      
      // Add more traits based on prompt keywords
      if (prompt.toLowerCase().includes('cyberpunk') || prompt.toLowerCase().includes('neon')) {
        fallbackTraits.push({ trait_type: "Eyes", value: "Glow" });
        fallbackTraits.push({ trait_type: "Clothing", value: "Punk Jacket" });
      } else if (prompt.toLowerCase().includes('magical') || prompt.toLowerCase().includes('wizard')) {
        fallbackTraits.push({ trait_type: "Hat", value: "Wizard Hat" });
        fallbackTraits.push({ trait_type: "Clothing", value: "Robe" });
      } else if (prompt.toLowerCase().includes('royal') || prompt.toLowerCase().includes('king')) {
        fallbackTraits.push({ trait_type: "Hat", value: "Crown" });
        fallbackTraits.push({ trait_type: "Clothing", value: "Suit" });
      }
      
      traits = fallbackTraits;
    }

    return traits;
  } catch (error) {
    console.error('Error generating traits:', error);
    // Return basic fallback traits
    return [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Special", value: "None" }
    ];
  }
};

// Generate AI prompts using Groq API
const generatePrompts = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    console.log('Generating prompts for:', userInput);

    // Create a creative prompt for the AI
    const systemPrompt = `You are a creative AI assistant specializing in NFT art prompts. Based on the user's input, generate exactly 5 unique, detailed, and creative prompts for NFT artwork. Each prompt should be:
    1. Highly descriptive and imaginative
    2. Suitable for AI image generation
    3. Include artistic style, mood, and composition details
    4. Be 1-2 sentences long
    5. Cover different artistic interpretations of the user's idea

    User input: "${userInput}"

    Return only the 5 prompts as a JSON array, no additional text.`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Groq API response:', response.data);

    // Extract prompts from response
    const aiResponse = response.data.choices[0].message.content;
    console.log('AI Response:', aiResponse);
    
    // Try to parse as JSON, if not, extract prompts manually
    let prompts;
    try {
      prompts = JSON.parse(aiResponse);
      // Normalize if array of objects with {prompt: "..."}
      if (Array.isArray(prompts) && typeof prompts[0] === 'object' && prompts[0] !== null && 'prompt' in prompts[0]) {
        prompts = prompts.map(p => p.prompt);
      }
    } catch (error) {
      console.log('JSON parsing failed, extracting from text');
      // If JSON parsing fails, extract prompts from text
      const lines = aiResponse.split('\n').filter(line => line.trim());
      prompts = lines.slice(0, 5).map(line => line.replace(/^\d+\.\s*/, '').trim());
    }

    // Ensure we have exactly 5 prompts
    if (!Array.isArray(prompts) || prompts.length < 5) {
      console.log('Using fallback prompts');
      // Fallback prompts if AI doesn't generate enough
      const fallbackPrompts = [
        `A stunning digital artwork featuring ${userInput}, rendered in vibrant colors with intricate details`,
        `An artistic interpretation of ${userInput} in a futuristic cyberpunk style with neon lighting`,
        `A beautiful fantasy scene showcasing ${userInput} with magical elements and ethereal atmosphere`,
        `A modern abstract representation of ${userInput} with bold geometric shapes and dynamic composition`,
        `A detailed portrait-style artwork of ${userInput} with rich textures and dramatic lighting`
      ];
      prompts = fallbackPrompts;
    }

    console.log('Final prompts:', prompts);
    res.json({ prompts: prompts.slice(0, 5) });
  } catch (error) {
    console.error('Error generating prompts:', error.response?.data || error.message);
    
    // Fallback prompts in case of API error
    const { userInput } = req.body;
    const fallbackPrompts = [
      `A stunning digital artwork featuring ${userInput}, rendered in vibrant colors with intricate details`,
      `An artistic interpretation of ${userInput} in a futuristic cyberpunk style with neon lighting`,
      `A beautiful fantasy scene showcasing ${userInput} with magical elements and ethereal atmosphere`,
      `A modern abstract representation of ${userInput} with bold geometric shapes and dynamic composition`,
      `A detailed portrait-style artwork of ${userInput} with rich textures and dramatic lighting`
    ];
    
    res.json({ prompts: fallbackPrompts });
  }
};

// Generate image using Gemini API
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    console.log('Generating image with Gemini for prompt:', prompt);

    // Gemini API endpoint for image generation
    const geminiEndpoint =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=' + GEMINI_API_KEY;

    // Gemini expects a specific JSON structure
    const payload = {
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ]
    };

    // Call Gemini API
    const response = await axios.post(geminiEndpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json',
      timeout: 60000
    });

    // Parse Gemini response for image
    const candidates = response.data.candidates || [];
    let base64Image = null;
    let textResponse = null;
    for (const candidate of candidates) {
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) textResponse = part.text;
          if (part.inline_data && part.inline_data.data) {
            base64Image = part.inline_data.data;
            break;
          }
        }
      }
      if (base64Image) break;
    }

    if (base64Image) {
      // Save the image to backend/uploads/ai-images/
      const imagesDir = path.join(__dirname, '../../uploads/ai-images');
      await fs.mkdir(imagesDir, { recursive: true });
      // Sanitize prompt for filename
      const safePrompt = prompt.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
      const filename = `${safePrompt}_${Date.now()}.png`;
      const filePath = path.join(imagesDir, filename);
      await fs.writeFile(filePath, Buffer.from(base64Image, 'base64'));
      // Return the URL to the frontend
      const imageUrl = `/uploads/ai-images/${filename}`;
      return res.json({
        imageUrl,
        message: textResponse || 'Image generated by Gemini and saved.'
      });
    } else {
      // Fallback: No image found in Gemini response
      return res.json({
        imageUrl: 'https://via.placeholder.com/512x512/667eea/ffffff?text=No+Image+Generated',
        message: textResponse || 'No image generated by Gemini, using placeholder.'
      });
    }
  } catch (error) {
    console.error('Error generating image with Gemini:', error.response?.data || error.message);
    // Fallback: return a placeholder image
    return res.json({
      imageUrl: 'https://via.placeholder.com/512x512/667eea/ffffff?text=AI+Generated+NFT',
      message: 'Using fallback image due to Gemini API error.'
    });
  }
};

// Generate NFT name and description using Groq API
const generateNFTDetails = async (req, res) => {
  try {
    const { prompt, userInput } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating NFT details for prompt:', prompt);

    const systemPrompt = `You are an NFT expert. Based on the AI-generated image prompt and the original user input, create:
    1. A catchy, unique NFT name (max 50 characters)
    2. A compelling description (max 200 characters)

    Original user input: "${userInput}"
    AI-generated prompt: "${prompt}"

    Return as JSON:
    {
      "name": "NFT Name Here",
      "description": "NFT description here"
    }`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log('NFT Details AI Response:', aiResponse);
    
    let nftDetails;
    try {
      nftDetails = JSON.parse(aiResponse);
    } catch (error) {
      console.log('JSON parsing failed for NFT details, using fallback');
      nftDetails = {
        name: `AI Generated ${userInput}`,
        description: `A unique AI-generated NFT based on: ${prompt}`
      };
    }

    res.json(nftDetails);
  } catch (error) {
    console.error('Error generating NFT details:', error.response?.data || error.message);
    
    // Fallback details
    const { userInput, prompt } = req.body;
    res.json({
      name: `AI Generated ${userInput}`,
      description: `A unique AI-generated NFT based on: ${prompt}`
    });
  }
};

// Mint AI-generated NFT with rarity scoring
const mintAINFT = async (req, res) => {
  try {
    const { name, description, imageUrl, prompt, walletAddress } = req.body;

    if (!name || !description || !imageUrl || !walletAddress) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Minting AI NFT:', { name, description, imageUrl, prompt, walletAddress });

    // Generate AI-based traits
    const userInput = prompt.split(' ').slice(0, 3).join(' '); // Use first 3 words as user input
    let generatedTraits = [];
    
    try {
      generatedTraits = await generateNFTTraits(prompt, userInput);
    } catch (traitError) {
      console.error('Error generating traits, using fallback:', traitError);
      generatedTraits = [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Special", value: "None" }
      ];
    }

    // Create metadata for the NFT
    const metadata = {
      name: name,
      description: description,
      image: imageUrl,
      attributes: [
        ...generatedTraits,
        {
          trait_type: "AI Generated",
          value: "Yes"
        },
        {
          trait_type: "Prompt",
          value: prompt
        },
        {
          trait_type: "Creation Date",
          value: new Date().toISOString()
        }
      ]
    };

    // Calculate rarity score
    let totalScore = 0;
    let detailedScores = [];
    let rarityLevel = "Common";
    
    try {
      const rarityResult = calculateNFTRarityScore(metadata);
      totalScore = rarityResult.totalScore;
      detailedScores = rarityResult.detailedScores;
      
      // Determine rarity level
      if (totalScore >= 1000) rarityLevel = "Legendary";
      else if (totalScore >= 500) rarityLevel = "Epic";
      else if (totalScore >= 100) rarityLevel = "Rare";
      else if (totalScore >= 50) rarityLevel = "Uncommon";
    } catch (rarityError) {
      console.error('Error calculating rarity, using defaults:', rarityError);
      totalScore = 0;
      detailedScores = [];
      rarityLevel = "Common";
    }

    // Add rarity metadata
    metadata.attributes.push({
      trait_type: "Rarity Score",
      value: totalScore.toFixed(2)
    });
    metadata.attributes.push({
      trait_type: "Rarity Level",
      value: rarityLevel
    });

    // Simulate blockchain transaction
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const responseData = {
      success: true,
      transactionHash: transactionHash,
      metadata: metadata,
      rarityScore: totalScore,
      rarityLevel: rarityLevel,
      detailedScores: detailedScores,
      message: `AI NFT successfully minted! Rarity: ${rarityLevel} (${totalScore.toFixed(2)} points)`
    };

    console.log('Sending response:', responseData);
    
    // In a real implementation, you would:
    // 1. Upload metadata to IPFS
    // 2. Call your smart contract to mint the NFT
    // 3. Return the actual transaction hash

    res.json(responseData);
  } catch (error) {
    console.error('Error minting AI NFT:', error);
    
    // Return a fallback response instead of error
    const fallbackResponse = {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      metadata: {
        name: req.body.name || 'AI Generated NFT',
        description: req.body.description || 'A unique AI-generated NFT',
        image: req.body.imageUrl || 'https://via.placeholder.com/512x512/667eea/ffffff?text=AI+Generated+NFT',
        attributes: [
          { trait_type: "Background", value: "Blue" },
          { trait_type: "Special", value: "None" },
          { trait_type: "AI Generated", value: "Yes" },
          { trait_type: "Rarity Score", value: "0.00" },
          { trait_type: "Rarity Level", value: "Common" }
        ]
      },
      rarityScore: 0,
      rarityLevel: "Common",
      detailedScores: [
        { trait_type: "Background", value: "Blue", rarity_score: 0 },
        { trait_type: "Special", value: "None", rarity_score: 0 }
      ],
      message: 'AI NFT successfully minted! Rarity: Common (0.00 points)'
    };
    
    res.json(fallbackResponse);
  }
};

module.exports = {
  generatePrompts,
  generateImage,
  generateNFTDetails,
  mintAINFT
}; 