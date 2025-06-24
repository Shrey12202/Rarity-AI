import { useState } from 'react'
import './App.css'

function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [engineeredPrompt, setEngineeredPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [status, setStatus] = useState('');
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [showMintButton, setShowMintButton] = useState(false);

  const handlePromptEngineering = () => {
    // Placeholder: Simulate prompt engineering
    setEngineeredPrompt(`Perfect prompt for: ${userPrompt}`);
    setStatus('Prompt engineered!');
    setShowGenerateButton(true);
  };

  const handleGenerateImage = () => {
    // Placeholder: Simulate image generation
    setGeneratedImage('https://placehold.co/400x400/png');
    setStatus('Image generated (placeholder)!');
    setShowMintButton(true);
  };

  const handleTriggerSupra = () => {
    // Placeholder: Simulate Supra backend trigger
    setStatus('Supra backend triggered (placeholder)!');
  };

  return (
    <div className="App" style={{ minHeight: '100vh', background: '#f7f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <h1 style={{ fontWeight: 800, fontSize: 44, letterSpacing: 1, color: '#2d2d2d', marginBottom: 40 }}>Rarity AI</h1>
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 24px #0001', padding: 48, width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <label htmlFor="prompt" style={{ fontWeight: 600, marginBottom: 8, fontSize: 20 }}>Describe the image you want to generate:</label>
        <input
          id="prompt"
          type="text"
          value={userPrompt}
          onChange={e => setUserPrompt(e.target.value)}
          placeholder="e.g. A futuristic city skyline at sunset"
          style={{ padding: 18, borderRadius: 10, border: '1.5px solid #ccc', fontSize: 20 }}
        />
        <button onClick={handlePromptEngineering} style={{ padding: '16px 0', borderRadius: 10, background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 20, border: 'none', marginTop: 8 }}>
          Get Better Prompt
        </button>
        {engineeredPrompt && (
          <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, marginTop: 8, fontSize: 18 }}>
            <strong>Engineered Prompt:</strong> {engineeredPrompt}
          </div>
        )}
        {showGenerateButton && (
          <button onClick={handleGenerateImage} style={{ padding: '16px 0', borderRadius: 10, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 20, border: 'none', marginTop: 8 }}>
            Generate Image
          </button>
        )}
        {generatedImage && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <img src={generatedImage} alt="Generated" style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 10 }} />
          </div>
        )}
        {showMintButton && (
          <button onClick={handleTriggerSupra} style={{ padding: '16px 0', borderRadius: 10, background: '#f59e42', color: '#fff', fontWeight: 700, fontSize: 20, border: 'none', marginTop: 8 }}>
            Mint NFT
          </button>
        )}
        {status && (
          <div style={{ marginTop: 20, color: '#6366f1', fontWeight: 600, fontSize: 18 }}>{status}</div>
        )}
      </div>
    </div>
  )
}

export default App
