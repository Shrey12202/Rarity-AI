#!/usr/bin/env python3
"""
Simple Gemini Image Generator
Outputs base64-encoded image data for direct frontend use
"""

import os
import sys
import json
import base64
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_image(prompt):
    """
    Generate an image using Gemini API and return base64-encoded data
    """
    try:
        # Import the working Google Generative AI package
        import google.generativeai as genai
        
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return {"success": False, "error": "GEMINI_API_KEY environment variable not set"}
        
        # Configure the API
        genai.configure(api_key=api_key)
        
        # Use the Gemini Pro Vision model for image generation
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        print(f"🎨 Generating image for prompt: '{prompt}'")
        
        # Generate the image
        response = model.generate_content(prompt)
        
        if response and hasattr(response, 'parts'):
            # Extract image data from response
            for part in response.parts:
                if hasattr(part, 'inline_data') and part.inline_data.mime_type.startswith('image/'):
                    # Encode image data as base64
                    img_base64 = base64.b64encode(part.inline_data.data).decode('utf-8')
                    return {
                        "success": True,
                        "image_base64": img_base64,
                        "prompt": prompt,
                        "timestamp": datetime.now().isoformat()
                    }
        
        return {"success": False, "error": "No image data found in response"}
        
    except ImportError as e:
        return {"success": False, "error": f"Import error: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"Generation error: {str(e)}"}

def main():
    """Main function to handle command line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No prompt provided"}))
        return
    
    prompt = sys.argv[1]
    result = generate_image(prompt)
    
    print(json.dumps(result))

if __name__ == "__main__":
    main() 