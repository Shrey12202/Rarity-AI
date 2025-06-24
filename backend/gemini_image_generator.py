import os
import google.generativeai as genai
from PIL import Image
from io import BytesIO
import base64
from datetime import datetime
import json

class GeminiImageGenerator:
    def __init__(self, api_key):
        """
        Initialize the Gemini Image Generator
        
        Args:
            api_key (str): Google Gemini API key
        """
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-preview-image-generation')
        
        # Create uploads directory if it doesn't exist
        self.uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'ai-images')
        os.makedirs(self.uploads_dir, exist_ok=True)
    
    def generate_image(self, prompt, filename=None):
        """
        Generate an image from a prompt using Gemini API
        
        Args:
            prompt (str): The text prompt for image generation
            filename (str, optional): Custom filename for the saved image
            
        Returns:
            dict: Dictionary containing image path, URL, and metadata
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={
                    'response_modalities': ['TEXT', 'IMAGE']
                }
            )
            
            text_response = ""
            image_saved = False
            
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'text') and part.text is not None:
                    text_response = part.text
                elif hasattr(part, 'inline_data') and part.inline_data is not None:
                    # Save image
                    image = Image.open(BytesIO(part.inline_data.data))
                    if not filename:
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        filename = f"gemini_generated_{timestamp}.png"
                    if not filename.endswith('.png'):
                        filename += '.png'
                    image_path = os.path.join(self.uploads_dir, filename)
                    image.save(image_path, 'PNG')
                    image_url = f"/uploads/ai-images/{filename}"
                    image_saved = True
            
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
    
    def generate_image_with_metadata(self, prompt, traits=None, rarity_score=None):
        """
        Generate image with additional metadata
        
        Args:
            prompt (str): The text prompt for image generation
            traits (dict, optional): NFT traits metadata
            rarity_score (float, optional): NFT rarity score
            
        Returns:
            dict: Dictionary containing image data and metadata
        """
        result = self.generate_image(prompt)
        
        if result['success']:
            # Add metadata
            result['metadata'] = {
                'traits': traits or {},
                'rarity_score': rarity_score,
                'generator': 'Gemini 2.0 Flash Preview',
                'model': 'gemini-2.0-flash-preview-image-generation'
            }
            
            # Save metadata to JSON file alongside image
            metadata_filename = result['filename'].replace('.png', '_metadata.json')
            metadata_path = os.path.join(self.uploads_dir, metadata_filename)
            
            metadata = {
                'image_filename': result['filename'],
                'image_url': result['image_url'],
                'prompt': result['prompt'],
                'text_response': result['text_response'],
                'traits': traits or {},
                'rarity_score': rarity_score,
                'generated_at': result['generated_at'],
                'generator': 'Gemini 2.0 Flash Preview',
                'model': 'gemini-2.0-flash-preview-image-generation'
            }
            
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            result['metadata_path'] = metadata_path
        
        return result

def main():
    """
    Example usage of the GeminiImageGenerator
    """
    import sys
    # Get API key from environment variable
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set")
        return
    
    # Initialize generator
    generator = GeminiImageGenerator(api_key)
    
    # Example prompt
    prompt = "A futuristic cyberpunk cat with neon blue eyes, digital circuits on its fur, sitting on a holographic platform in a neon-lit cityscape"
    
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
    
    print(f"Generating image for prompt: {prompt}")
    
    # Generate image
    result = generator.generate_image(prompt)
    
    if result['success']:
        print(f"✅ Image generated successfully!")
        print(f"📁 Saved to: {result['image_path']}")
        print(f"🌐 URL: {result['image_url']}")
        print(f"📝 Text response: {result['text_response']}")
    else:
        print(f"❌ Error generating image: {result['error']}")

if __name__ == "__main__":
    main() 