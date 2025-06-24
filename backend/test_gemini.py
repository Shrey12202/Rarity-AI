#!/usr/bin/env python3
"""
Test script for Gemini Image Generator
"""

import os
import sys
from dotenv import load_dotenv
from gemini_image_generator import GeminiImageGenerator

# Load environment variables
load_dotenv()

def test_gemini_image_generation():
    """
    Test the Gemini image generation functionality
    """
    # Get API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not set")
        print("Please set your Gemini API key in the .env file")
        return False
    
    print("🚀 Initializing Gemini Image Generator...")
    
    try:
        # Initialize the generator
        generator = GeminiImageGenerator(api_key)
        print("✅ Generator initialized successfully!")
        
        # Test prompts
        test_prompts = [
            "A majestic dragon with iridescent scales, breathing fire in a mystical forest",
            "A steampunk robot with brass gears and glowing blue eyes, standing in a Victorian workshop",
            "A magical unicorn with rainbow mane, galloping through a field of flowers under a starlit sky"
        ]
        
        for i, prompt in enumerate(test_prompts, 1):
            print(f"\n🎨 Test {i}: Generating image for prompt:")
            print(f"   '{prompt}'")
            
            # Generate image
            result = generator.generate_image(prompt)
            
            if result['success']:
                print(f"   ✅ Success! Image saved as: {result['filename']}")
                print(f"   📁 Path: {result['image_path']}")
                print(f"   🌐 URL: {result['image_url']}")
                if result['text_response']:
                    print(f"   📝 Text: {result['text_response'][:100]}...")
            else:
                print(f"   ❌ Error: {result['error']}")
        
        # Test with metadata
        print(f"\n📊 Test with metadata:")
        traits = {
            "Background": "Mystical Forest",
            "Character": "Cyberpunk Cat",
            "Accessory": "Neon Collar",
            "Rarity": "Legendary"
        }
        
        metadata_result = generator.generate_image_with_metadata(
            "A cyberpunk cat with neon collar in a mystical forest",
            traits=traits,
            rarity_score=95.5
        )
        
        if metadata_result['success']:
            print(f"   ✅ Metadata test successful!")
            print(f"   📁 Image: {metadata_result['filename']}")
            print(f"   📄 Metadata: {metadata_result['metadata_path']}")
        else:
            print(f"   ❌ Metadata test failed: {metadata_result['error']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False

def main():
    """
    Main function to run the test
    """
    print("🧪 Testing Gemini Image Generator")
    print("=" * 50)
    
    success = test_gemini_image_generation()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests completed!")
    else:
        print("💥 Tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 