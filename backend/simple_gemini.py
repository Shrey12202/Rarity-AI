#!/usr/bin/env python3
"""
Simple Gemini Image Generator using the working code pattern
"""

import os
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
from datetime import datetime
import json

def generate_image(prompt, api_key, filename=None):
    """
    Generate image using the working code pattern
    """
    try:
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE']
            )
        )
        
        text_response = ""
        image_saved = False
        image_path = None
        image_url = None
        
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                text_response = part.text
                print(f"Text response: {part.text}")
            elif part.inline_data is not None:
                # Save image
                image = Image.open(BytesIO(part.inline_data.data))
                
                # Create uploads directory if it doesn't exist
                uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'ai-images')
                os.makedirs(uploads_dir, exist_ok=True)
                
                if not filename:
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"gemini_generated_{timestamp}.png"
                if not filename.endswith('.png'):
                    filename += '.png'
                
                image_path = os.path.join(uploads_dir, filename)
                image.save(image_path, 'PNG')
                image_url = f"/uploads/ai-images/{filename}"
                image_saved = True
                print(f"Image saved: {image_path}")
        
        if image_saved:
            return {
                'success': True,
                'image_path': image_path,
                'image_url': image_url,
                'filename': filename,
                'text_response': text_response,
                'prompt': prompt,
                'generated_at': datetime.now().isoformat()
            }
        else:
            return {
                'success': False,
                'error': 'No image data found in response',
                'prompt': prompt
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'prompt': prompt
        }

def main():
    # Get API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set")
        return
    
    # Test prompt
    prompt = "A futuristic cyberpunk cat with neon blue eyes, digital circuits on its fur, sitting on a holographic platform in a neon-lit cityscape"
    
    print(f"Generating image for prompt: {prompt}")
    result = generate_image(prompt, api_key)
    
    if result['success']:
        print(f"✅ Image generated successfully!")
        print(f"📁 Saved to: {result['image_path']}")
        print(f"🌐 URL: {result['image_url']}")
        print(f"📝 Text response: {result['text_response']}")
    else:
        print(f"❌ Error generating image: {result['error']}")

if __name__ == "__main__":
    main() 