  import React, { useState, useEffect } from 'react';
  import './App.css';

  function App() {
    const [prompt, setPrompt] = useState('');
    const [modelChoice, setModelChoice] = useState('Nebula Vision');
    const [imagePath, setImagePath] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serverStatus, setServerStatus] = useState('Checking server status...');
    const [showSelections, setShowSelections] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('portrait');
    const [resolution, setResolution] = useState('medium');

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
      window.scrollTo(0, 0);
    }, []);

    const handleTextAreaFocus = () => {
      setShowSelections(true);
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
          body: JSON.stringify({
            prompt,
            model_choice: modelChoice === 'Nebula Vision' ? 1 : 2,
            aspect_ratio: aspectRatio,
            resolution,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImagePath(imageUrl);
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
      setResolution('medium');
      setImagePath('');
      setError('');
    };

    const handleDownload = () => {
      window.open(imagePath, '_blank');
    };

    return (
      <>
        <header>
          {imagePath && <button className="back-button" onClick={handleBack}>←</button>}
          <h1>Image Generator</h1>
        </header>
        <div className="main-content">
          <div className="instructions">
            <ul>
              <li>Enter a descriptive prompt in the input field.</li><br />
              <li>Select a model from the options below ↓</li><br />
              <li>Nebula Vision: Dreamy, ethereal quality.</li><br />
              <li>Quantum Realm: Futuristic, high-tech appearance.</li><br />
              <li>Choose an aspect ratio (Portrait or Landscape) for your image.</li><br />
              <li>Select a resolution for the image:</li><br />
              <li><b>Low (512×512)</b> – Faster on <b>any system</b>, suitable for <b>low VRAM GPUs (4GB+) or CPU users</b>.</li><br />
              <li><b>Medium (768×768)</b> – Default setting, <b>balanced speed & quality</b>. Works best on <b>6GB+ VRAM GPUs</b> but <b>can run on CPUs (slower performance)</b>.</li><br />
              <li><b>High (1024×1024)</b> – <b>Highest quality</b>, requires <b>8GB+ VRAM</b> for smooth performance. <b>CPU users can still run it, but it will take much longer.</b></li><br />
              <li>Click "Generate Image" to start the process.</li><br />
              <li>Wait a few moments for the image to be generated.</li><br />
              <li>View and download the generated image below.</li>
            </ul>
          </div>
          <div className="content-container">
            <div className="form-section">
              <form onSubmit={handleSubmit}>
                <div className="prompt-container">
                  <label htmlFor="prompt">Imagine what you want to see</label>
                  <textarea
                    id="prompt"
                    placeholder="A serene landscape at sunset, with a calm lake reflecting the vibrant orange and pink hues of the sky. Lush green hills surround the lake, and a small wooden boat floats gently near the shore. A few trees with thick trunks are scattered along the water’s edge, and soft mist rises from the surface of the lake. The scene evokes a peaceful, tranquil atmosphere, with a few birds soaring in the sky."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={handleTextAreaFocus}
                    required
                    className="prompt-input"
                  />

                {/* Dropdowns */}
                <div className={`selections-container ${showSelections ? 'visible' : ''}`}>
                  
                  {/* Aspect Ratio Dropdown */}
                  <div className="dropdown">
                    <button type="button" className={`dropdown-button ${aspectRatio !== 'Aspect Ratio' ? 'selected' : ''}`}>
                      {aspectRatio.charAt(0).toUpperCase() + aspectRatio.slice(1)}
                    </button>
                    <div className="dropdown-options">
                      <div className={`dropdown-option ${aspectRatio === 'portrait' ? 'selected' : ''}`} 
                          onClick={() => setAspectRatio('portrait')}>
                        Portrait
                      </div>
                      <div className={`dropdown-option ${aspectRatio === 'landscape' ? 'selected' : ''}`} 
                          onClick={() => setAspectRatio('landscape')}>
                        Landscape
                      </div>
                    </div>
                  </div>

                  {/* Resolution Dropdown */}
                  <div className="dropdown">
                    <button type="button" className={`dropdown-button ${resolution !== 'Resolution' ? 'selected' : ''}`}>
                      {resolution.charAt(0).toUpperCase() + resolution.slice(1)}
                    </button>
                    <div className="dropdown-options">
                      <div className={`dropdown-option ${resolution === 'low' ? 'selected' : ''}`} 
                          onClick={() => setResolution('low')}>
                        Low
                      </div>
                      <div className={`dropdown-option ${resolution === 'medium' ? 'selected' : ''}`} 
                          onClick={() => setResolution('medium')}>
                        Medium
                      </div>
                      <div className={`dropdown-option ${resolution === 'high' ? 'selected' : ''}`} 
                          onClick={() => setResolution('high')}>
                        High
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`small-light-button ${loading ? 'loading' : ''}`}
                  >
                    {loading ? 'Generating Please Wait...' : 'Generate Image'}
                  </button>
                </div>
                <div className="model-selection">
                  <div className="model-container">
                    <div
                      className={`model-card ${modelChoice === 'Nebula Vision' ? 'selected' : ''}`}
                      onClick={() => setModelChoice('Nebula Vision')}
                    >
                      <img src="/img/front-view-woman-posing-ethereal-environment.jpg" alt="Nebula Vision" loading="lazy" />
                      Nebula Vision
                    </div>
                    <div
                      className={`model-card ${modelChoice === 'Quantum Realm' ? 'selected' : ''}`}
                      onClick={() => setModelChoice('Quantum Realm')}
                    >
                      <img src="/img/futuristic.jpg" alt="Quantum Realm" loading="lazy" />
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
                {imagePath && <a href={imagePath} download="generated_image.png" className="download-button">Download Image</a>}
                {error && <p className="error">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  export default App;
