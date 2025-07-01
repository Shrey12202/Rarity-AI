#!/usr/bin/env python3
"""
Test script for the new Gemini image generation implementation
"""

import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_image_generation():
    """Test the new Gemini image generation"""
    try:
        # Import the newer Google GenAI package
        from google import genai
        from google.genai import types
        from PIL import Image
        from io import BytesIO
        
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("❌ Error: GEMINI_API_KEY environment variable not set")
            return False
        
        print("✅ API key found")
        
        # Create client with API key
        client = genai.Client(api_key=api_key)
        print("✅ Client created successfully")
        
        # Test prompt
        test_prompt = "A futuristic cyberpunk cat with neon blue eyes, digital circuits on its fur, sitting on a holographic platform in a neon-lit cityscape"
        
        print(f"🎨 Testing image generation with prompt: '{test_prompt}'")
        
        # Generate the image using the new API
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=test_prompt,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE']
            )
        )
        
        print("✅ API call successful")
        
        # Extract image data from response
        image_found = False
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                print(f"📝 Text response: {part.text}")
            elif part.inline_data is not None:
                print("🖼️ Image data found!")
                image_found = True
                
                # Save the image
                image = Image.open(BytesIO(part.inline_data.data))
                image.save('test_gemini_image.png')
                print("✅ Image saved as 'test_gemini_image.png'")
                break
        
        if not image_found:
            print("❌ No image data found in response")
            return False
        
        print("🎉 Test completed successfully!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {str(e)}")
        print("💡 Make sure to install: pip install google-genai pillow python-dotenv")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing new Gemini image generation implementation...")
    success = test_gemini_image_generation()
    
    if success:
        print("\n✅ All tests passed! The new implementation is working correctly.")
    else:
        print("\n❌ Tests failed. Please check the error messages above.")
        sys.exit(1) 