#!/usr/bin/env python3
"""
Simple Gemini Image Generator using new Google Generative AI Client API
Outputs base64-encoded image data for direct frontend use
Also saves images to uploads/ai-images folder
"""

import os
import sys
import json
import base64
from datetime import datetime
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
import uuid

# Load environment variables
load_dotenv()

def generate_image(prompt, debug=False):
    """
    Generate an image using Gemini API and return base64-encoded data
    Also saves the image to uploads/ai-images folder
    """
    try:
        # Import the new Google Generative AI client
        from google import genai
        from google.genai import types
        
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return {"success": False, "error": "GEMINI_API_KEY environment variable not set"}
        
        if debug:
            print(f"🎨 Generating image for prompt: '{prompt}'")
            print(f"🔑 Using API key: {api_key[:10]}...")
        
        # Create the client
        client = genai.Client(api_key=api_key)
        
        # Generate the image using the new API
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE']
            )
        )
        
        if debug:
            print(f"📡 Response received: {type(response)}")
            print(f"📡 Response has candidates: {hasattr(response, 'candidates')}")
        
        if response and hasattr(response, 'candidates') and len(response.candidates) > 0:
            if debug:
                print(f"📡 Number of candidates: {len(response.candidates)}")
            
            # Extract image data from response
            for part in response.candidates[0].content.parts:
                if debug:
                    print(f"📡 Part type: {type(part)}")
                    print(f"📡 Part has inline_data: {hasattr(part, 'inline_data')}")
                
                if hasattr(part, 'inline_data') and part.inline_data is not None:
                    if debug:
                        print(f"📡 Found image data!")
                    
                    # Convert image data to base64
                    img_data = part.inline_data.data
                    img_base64 = base64.b64encode(img_data).decode('utf-8')
                    
                    # Save image to uploads/ai-images folder
                    uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'ai-images')
                    os.makedirs(uploads_dir, exist_ok=True)
                    
                    # Generate unique filename
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    unique_id = str(uuid.uuid4())[:8]
                    filename = f"gemini_{timestamp}_{unique_id}.png"
                    filepath = os.path.join(uploads_dir, filename)
                    
                    # Save the image
                    with open(filepath, 'wb') as f:
                        f.write(img_data)
                    
                    if debug:
                        print(f"💾 Image saved to: {filepath}")
                    
                    return {
                        "success": True,
                        "image_base64": img_base64,
                        "prompt": prompt,
                        "timestamp": datetime.now().isoformat(),
                        "filename": filename,
                        "filepath": filepath
                    }
        
        if debug:
            print("❌ No image data found in response")
        return {"success": False, "error": "No image data found in response"}
        
    except ImportError as e:
        if debug:
            print(f"❌ Import error: {str(e)}")
        return {"success": False, "error": f"Import error: {str(e)}"}
    except Exception as e:
        if debug:
            print(f"❌ Generation error: {str(e)}")
            import traceback
            traceback.print_exc()
        return {"success": False, "error": f"Generation error: {str(e)}"}

def main():
    """Main function to handle command line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No prompt provided"}))
        return
    
    prompt = sys.argv[1]
    # Check if debug mode is enabled (when called with --debug flag)
    debug = "--debug" in sys.argv
    
    result = generate_image(prompt, debug=debug)
    
    # Only output JSON when not in debug mode (for backend integration)
    if not debug:
        print(json.dumps(result))
    else:
        # In debug mode, print the result in a readable format
        print("\n" + "="*50)
        print("RESULT:")
        print(json.dumps(result, indent=2))
        print("="*50)

if __name__ == "__main__":
    main() 