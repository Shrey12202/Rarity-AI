const { spawn } = require('child_process');
const path = require('path');

console.log('Testing simplified Python integration...');

// Test the simplified Python script
const pythonScript = path.join(__dirname, 'simple_gemini_image.py');
const testPrompt = 'A futuristic robot in a cyberpunk city';

console.log(`Running: python ${pythonScript} "${testPrompt}"`);

// Set environment variable for the Python process
const env = { ...process.env };
env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test_key';

const pythonProcess = spawn('python', [pythonScript, testPrompt], { env });

let result = '';
let error = '';

pythonProcess.stdout.on('data', (data) => {
  result += data.toString();
  console.log('Python output:', data.toString());
});

pythonProcess.stderr.on('data', (data) => {
  error += data.toString();
  console.log('Python error:', data.toString());
});

pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
  
  if (code !== 0) {
    console.error('Python script failed:', error);
    return;
  }
  
  try {
    const data = JSON.parse(result);
    console.log('Successfully parsed Python output:', data);
    
    if (data.success && data.image_path) {
      console.log('✅ Image generated successfully!');
      console.log('Image path:', data.image_path);
      console.log('Metadata:', data.metadata);
    } else {
      console.log('❌ Image generation failed:', data.error);
      if (data.error.includes('API_KEY')) {
        console.log('💡 Make sure to set GEMINI_API_KEY in your .env file');
      }
    }
  } catch (parseError) {
    console.error('Failed to parse Python output:', parseError);
    console.log('Raw output:', result);
  }
}); 