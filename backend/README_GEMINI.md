# Gemini Image Generator

This Python script provides image generation capabilities using Google's Gemini 2.0 Flash Preview Image Generation model. It generates images from text prompts and saves them as PNG files with optional metadata.

## Features

- 🎨 Generate images from text prompts using Gemini 2.0 Flash Preview
- 📁 Automatic image saving to PNG format
- 📊 Optional metadata storage (traits, rarity scores)
- 🌐 URL generation for web serving
- 📝 Text response extraction from Gemini
- 🔧 Easy integration with existing projects

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install google-generativeai Pillow python-dotenv
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## Usage

### Basic Image Generation

```python
from gemini_image_generator import GeminiImageGenerator
import os

# Initialize generator
api_key = os.getenv('GEMINI_API_KEY')
generator = GeminiImageGenerator(api_key)

# Generate image
result = generator.generate_image("A futuristic cyberpunk cat with neon blue eyes")

if result['success']:
    print(f"Image saved: {result['image_path']}")
    print(f"URL: {result['image_url']}")
    print(f"Text response: {result['text_response']}")
else:
    print(f"Error: {result['error']}")
```

### Image Generation with Metadata

```python
# Generate with NFT traits and rarity
traits = {
    "Background": "Cyberpunk City",
    "Character": "Robot Cat",
    "Accessory": "Neon Collar",
    "Rarity": "Legendary"
}

result = generator.generate_image_with_metadata(
    "A robot cat in a cyberpunk city",
    traits=traits,
    rarity_score=95.5
)
```

### Custom Filename

```python
# Generate with custom filename
result = generator.generate_image(
    "A magical unicorn",
    filename="my_unicorn.png"
)
```

## File Structure

```
backend/
├── gemini_image_generator.py    # Main generator class
├── test_gemini.py              # Test script
├── requirements.txt            # Python dependencies
├── uploads/
│   └── ai-images/             # Generated images stored here
│       ├── gemini_generated_20241201_143022.png
│       ├── gemini_generated_20241201_143022_metadata.json
│       └── ...
└── .env                       # Environment variables
```

## API Response Format

### Successful Generation

```json
{
    "success": true,
    "image_path": "/path/to/uploads/ai-images/gemini_generated_20241201_143022.png",
    "image_url": "/uploads/ai-images/gemini_generated_20241201_143022.png",
    "filename": "gemini_generated_20241201_143022.png",
    "text_response": "Generated a futuristic cyberpunk cat...",
    "prompt": "A futuristic cyberpunk cat with neon blue eyes",
    "generated_at": "2024-12-01T14:30:22.123456",
    "metadata": {
        "traits": {"Background": "Cyberpunk City"},
        "rarity_score": 95.5,
        "generator": "Gemini 2.0 Flash Preview",
        "model": "gemini-2.0-flash-preview-image-generation"
    }
}
```

### Error Response

```json
{
    "success": false,
    "error": "Error message here",
    "prompt": "The original prompt"
}
```

## Testing

Run the test script to verify everything works:

```bash
python test_gemini.py
```

This will:
- Test basic image generation
- Test metadata generation
- Verify file saving
- Check error handling

## Integration with Node.js Backend

You can call the Python script from your Node.js backend using child processes:

```javascript
const { spawn } = require('child_process');

function generateImageWithGemini(prompt) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['gemini_image_generator.py', prompt]);
        
        let result = '';
        
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const parsedResult = JSON.parse(result);
                    resolve(parsedResult);
                } catch (e) {
                    reject(new Error('Failed to parse Python output'));
                }
            } else {
                reject(new Error(`Python process exited with code ${code}`));
            }
        });
    });
}
```

## Error Handling

The script handles various error scenarios:

- **API Key Missing**: Checks for environment variable
- **API Errors**: Catches and reports Gemini API errors
- **File System Errors**: Handles directory creation and file saving issues
- **Invalid Responses**: Validates API response structure

## Model Specifications

- **Model**: `gemini-2.0-flash-preview-image-generation`
- **Response Modalities**: `IMAGE` and `TEXT`
- **Output Format**: PNG images
- **Text Response**: Optional descriptive text about the generated image

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure `GEMINI_API_KEY` is set in `.env`
2. **Permission Error**: Check write permissions for uploads directory
3. **Import Error**: Verify all dependencies are installed
4. **Network Error**: Check internet connection and API access

### Debug Mode

Enable debug output by setting environment variable:
```bash
export DEBUG=1
python test_gemini.py
```

## License

This script is part of the NFT project and follows the same licensing terms. 