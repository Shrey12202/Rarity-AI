#!/usr/bin/env python3
"""
Command Line Interface for Gemini Image Generator
"""

import argparse
import json
import sys
import os
from dotenv import load_dotenv
from gemini_image_generator import GeminiImageGenerator

# Load environment variables
load_dotenv()

def main():
    """
    Main CLI function
    """
    parser = argparse.ArgumentParser(
        description='Generate images using Google Gemini 2.0 Flash Preview',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python gemini_cli.py "A futuristic cyberpunk cat"
  python gemini_cli.py "A magical unicorn" --filename my_unicorn.png
  python gemini_cli.py "A robot in space" --metadata --traits '{"Background":"Space","Character":"Robot"}'
        """
    )
    
    parser.add_argument(
        'prompt',
        help='Text prompt for image generation'
    )
    
    parser.add_argument(
        '--filename', '-f',
        help='Custom filename for the generated image (optional)'
    )
    
    parser.add_argument(
        '--metadata', '-m',
        action='store_true',
        help='Generate metadata JSON file alongside the image'
    )
    
    parser.add_argument(
        '--traits', '-t',
        help='JSON string of traits for metadata (e.g., \'{"Background":"Space","Character":"Robot"}\')'
    )
    
    parser.add_argument(
        '--rarity', '-r',
        type=float,
        help='Rarity score for metadata (0-100)'
    )
    
    parser.add_argument(
        '--output-format', '-o',
        choices=['json', 'text'],
        default='json',
        help='Output format (json or text)'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Verbose output'
    )
    
    args = parser.parse_args()
    
    # Get API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not set", file=sys.stderr)
        print("Please set your Gemini API key in the .env file", file=sys.stderr)
        sys.exit(1)
    
    # Parse traits if provided
    traits = None
    if args.traits:
        try:
            traits = json.loads(args.traits)
        except json.JSONDecodeError:
            print("❌ Error: Invalid JSON format for traits", file=sys.stderr)
            sys.exit(1)
    
    try:
        # Initialize generator
        if args.verbose:
            print("🚀 Initializing Gemini Image Generator...")
        
        generator = GeminiImageGenerator(api_key)
        
        if args.verbose:
            print("✅ Generator initialized successfully!")
            print(f"🎨 Generating image for prompt: '{args.prompt}'")
        
        # Generate image
        if args.metadata or traits or args.rarity is not None:
            result = generator.generate_image_with_metadata(
                args.prompt,
                traits=traits,
                rarity_score=args.rarity
            )
        else:
            result = generator.generate_image(args.prompt, args.filename)
        
        # Output result
        if args.output_format == 'json':
            print(json.dumps(result, indent=2))
        else:
            # Text output
            if result['success']:
                print(f"✅ Image generated successfully!")
                print(f"📁 File: {result['filename']}")
                print(f"📍 Path: {result['image_path']}")
                print(f"🌐 URL: {result['image_url']}")
                if result.get('text_response'):
                    print(f"📝 Text: {result['text_response']}")
                if result.get('metadata'):
                    print(f"📊 Metadata: {result['metadata_path']}")
            else:
                print(f"❌ Error: {result['error']}", file=sys.stderr)
                sys.exit(1)
        
    except KeyboardInterrupt:
        print("\n⏹️  Operation cancelled by user", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 