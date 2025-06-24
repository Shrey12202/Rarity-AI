const { spawn } = require('child_process');
const path = require('path');

console.log('Testing Python integration...');

// Test the Python script directly
const pythonScript = path.join(__dirname, 'gemini_image_generator.py');
const testPrompt = 'A futuristic robot in a cyberpunk city';

console.log(`Running: python ${pythonScript} "${testPrompt}"`);

const pythonProcess = spawn('python', [pythonScript, testPrompt]);

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
    }
  } catch (parseError) {
    console.error('Failed to parse Python output:', parseError);
    console.log('Raw output:', result);
  }
}); 