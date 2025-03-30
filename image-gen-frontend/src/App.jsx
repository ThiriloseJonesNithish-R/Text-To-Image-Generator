import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [modelChoice, setModelChoice] = useState('Nebula Vision');
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('Checking server status...');
  const [showAspectRatio, setShowAspectRatio] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/status');
        if (response.ok) {
          setServerStatus('Server is running');
        } else {
          setServerStatus('Server is down');
        }
      } catch (error) {
        setServerStatus('Server is down');
      }
    };

    checkServerStatus();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on load
  }, []);

  const handleTextAreaFocus = () => {
    setShowAspectRatio(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImagePath('');

    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model_choice: modelChoice === 'Nebula Vision' ? 1 : 2, aspect_ratio: aspectRatio }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImagePath(`http://127.0.0.1:8000/${data.image_path}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPrompt('');
    setModelChoice('Nebula Vision');
    setAspectRatio('portrait');
    setImagePath('');
    setError('');
  };

  const handleDownload = () => {
    // Extract filename from path
    const filename = imagePath.split('/').pop();
    // Create direct download link
    window.open(imagePath, '_blank');
  };

  return (
    <>
      <header>
        {imagePath && <button className="back-button" onClick={handleBack}>←</button>}
        <h1>Image Generator</h1>
      </header>
      <div className="main-content">
        <div className="instructions" style={{ animationDelay: '0.5s' }}>
          <ul>
            <li>Enter a descriptive prompt in the input field.</li><br/>
            <li>Select a model from the options below ↓</li><br/>
            <li>Nebula Vision: Dreamy, ethereal quality.</li><br/>
            <li>Quantum Realm: Futuristic, high-tech appearance.</li><br/>
            <li>Click "Generate Image" to start the process.</li><br/>
            <li>Wait a few moments for the image to be generated.</li><br/>
            <li>View and download the generated image below.</li>
          </ul>
        </div>
        <div className="content-container">
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="prompt-container">
                <label htmlFor="prompt">Imagine what you want to see </label>
                <textarea
                  id="prompt"
                  placeholder="A serene landscape at sunset, with a calm lake reflecting the vibrant orange and pink hues of the sky. Lush green hills surround the lake, and a small wooden boat floats gently near the shore. A few trees with thick trunks are scattered along the water’s edge, and soft mist rises from the surface of the lake. The scene evokes a peaceful, tranquil atmosphere, with a few birds soaring in the sky."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={handleTextAreaFocus}
                  required
                  className="prompt-input"
                />
                <div className={`aspect-ratio-selection ${showAspectRatio ? 'visible' : ''}`}>
                  <button
                    type="button"
                    className={`aspect-ratio-option ${aspectRatio === 'portrait' ? 'selected' : ''}`}
                    onClick={() => setAspectRatio('portrait')}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    className={`aspect-ratio-option ${aspectRatio === 'landscape' ? 'selected' : ''}`}
                    onClick={() => setAspectRatio('landscape')}
                  >
                    Landscape
                  </button>
                </div>
              </div>
              <div>
              <button 
                type="submit" 
                disabled={loading} 
                className={`small-light-button ${loading ? 'loading' : ''}`}
              >
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
              </div>
              <div className="model-selection">
                <div className="model-container">
                  <div
                    className={`model-card ${modelChoice === 'Nebula Vision' ? 'selected' : ''}`}
                    onClick={() => setModelChoice('Nebula Vision')}
                  >
                    <img 
                      src="/img/front-view-woman-posing-ethereal-environment.jpg" 
                      alt="Nebula Vision" 
                      loading="lazy" 
                    />
                    Nebula Vision
                  </div>
                  <div
                    className={`model-card ${modelChoice === 'Quantum Realm' ? 'selected' : ''}`}
                    onClick={() => setModelChoice('Quantum Realm')}
                  >
                    <img 
                      src="/img/futuristic.jpg" 
                      alt="Quantum Realm" 
                      loading="lazy" 
                    />
                    Quantum Realm
                  </div>
                </div>
                <div className="preview-card">
                  {imagePath ? (
                    <img src={imagePath} alt="Generated" />
                  ) : (
                    <span className="preview-placeholder">Generated image will appear here</span>
                  )}
                </div>
              </div>
              {imagePath && (
                <a 
                  href={imagePath}
                  download={`generated_image.png`}
                  className="download-button"
                  onClick={(e) => {
                      e.preventDefault();
                      handleDownload();
                  }}
                >
                  Download Image
                </a>
              )}
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;