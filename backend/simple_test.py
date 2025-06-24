#!/usr/bin/env python3
"""
Simple test script to debug import issues
"""

print("Starting import test...")

try:
    print("1. Testing basic import...")
    import google
    print("   ✅ google module imported")
    print(f"   📁 google.__file__: {google.__file__}")
    print(f"   📦 google.__path__: {google.__path__}")
except Exception as e:
    print(f"   ❌ Error importing google: {e}")

try:
    print("2. Testing google.generativeai import...")
    import google.generativeai
    print("   ✅ google.generativeai imported")
except Exception as e:
    print(f"   ❌ Error importing google.generativeai: {e}")

try:
    print("3. Testing genai alias...")
    import google.generativeai as genai
    print("   ✅ genai alias created")
except Exception as e:
    print(f"   ❌ Error creating genai alias: {e}")

print("Import test completed.") 