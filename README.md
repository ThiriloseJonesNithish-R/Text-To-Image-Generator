![image](https://github.com/user-attachments/assets/c9fb3664-0896-4f17-9ad0-eabfcc711ecb)

# AI Image Generator Web App

A modern web application that generates AI-powered images based on text prompts, with two distinct artistic models to choose from.

## Features

- **Dual Model Selection**:
  - Nebula Vision: Creates dreamy, ethereal images
  - Quantum Realm: Generates futuristic, high-tech visuals
- **Customization Options**:
  - Adjustable aspect ratio (portrait/landscape)
  - Multiple resolution settings (low/medium/high)
- **Efficient Backend**:
  - Automatic model loading/unloading
  - GPU/CPU compatibility
  - Rate limiting (5 requests per minute)
- **Modern UI**:
  - Animated transitions
  - Responsive design
  - Interactive elements

## Technologies Used

- **Frontend**:
  - React.js
  - CSS animations
  - Responsive design principles
- **Backend**:
  - FastAPI
  - Stable Diffusion models
  - PyTorch
- **Deployment**:
  - Local server setup

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm/yarn
- GPU recommended (but works on CPU)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ThiriloseJonesNithish-R/Text-To-Image-Generator.git
   cd Text-To-Image-Generator/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up Hugging Face cache (optional):
   ```bash
   export HF_HOME="path/to/cache"  # Or set in .env file
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open the web app in your browser (typically `http://localhost:3000`)
2. Enter a descriptive prompt in the text area
3. Select your preferred model, aspect ratio, and resolution
4. Click "Generate Image" (first request will load the model)
5. View and download your generated image

## Configuration

### Backend Options

Edit `backend/main.py` to:
- Change model unloading timeout (default: 10 minutes)
- Adjust inference steps
- Modify resolution presets

### Frontend Options

Edit `frontend/src/App.js` to:
- Change animation timings
- Add new models
- Modify UI elements

## Project Structure

```
ai-image-generator/
├── backend/
│   ├── main.py             # FastAPI server and model logic
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hugging Face for the Stable Diffusion models
- FastAPI for the efficient backend
- React community for frontend tools
