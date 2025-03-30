from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
import torch
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from fastapi.responses import StreamingResponse
import os

# Set Hugging Face cache location
os.environ["HF_HOME"] = "E:/HuggingFaceCache"

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Length", "Content-Type"]
)

# Model IDs
model_id1 = "dreamlike-art/dreamlike-diffusion-1.0"
model_id2 = "runwayml/stable-diffusion-v1-5"

# Detect if CUDA is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load models dynamically
print(f"Loading model {model_id1}...")
pipe1 = StableDiffusionPipeline.from_pretrained(
    model_id1, torch_dtype=torch.float16 if device == "cuda" else torch.float32, use_safetensors=True
).to(device)
print(f"Model {model_id1} loaded.")

print(f"Loading model {model_id2}...")
pipe2 = StableDiffusionPipeline.from_pretrained(
    model_id2, torch_dtype=torch.float16 if device == "cuda" else torch.float32, use_safetensors=True
).to(device)
print(f"Model {model_id2} loaded.")

print("Models loaded successfully!")

# Request schema
class PromptRequest(BaseModel):
    prompt: str
    model_choice: int  # 1 or 2
    aspect_ratio: str  # 'portrait' or 'landscape'

@app.get("/status")
async def get_status():
    return {"status": "Server is running"}

@app.post("/generate")
async def generate_image(request: PromptRequest):
    prompt = request.prompt
    model_choice = request.model_choice
    aspect_ratio = request.aspect_ratio

    # Select model
    if model_choice == 1:
        pipe = pipe1
    elif model_choice == 2:
        pipe = pipe2
    else:
        raise HTTPException(status_code=400, detail="Invalid model choice. Choose 1 or 2.")

    # Set image dimensions based on aspect ratio
    if aspect_ratio == 'portrait':
        height, width = 512, 384
    elif aspect_ratio == 'landscape':
        height, width = 384, 512
    else:
        raise HTTPException(status_code=400, detail="Invalid aspect ratio. Choose 'portrait' or 'landscape'.")

    # Optimize inference steps based on device
    num_inference_steps = 50 if device == "cuda" else 25  # 50 on GPU, 25 on CPU

    try:
        print(f"Generating image with Model {model_choice}, Steps: {num_inference_steps}, Device: {device}")

        # Generate image
        image = pipe(prompt, height=height, width=width, num_inference_steps=num_inference_steps).images[0]

        # Convert image to bytes
        img_io = BytesIO()
        image.save(img_io, format="PNG")
        img_io.seek(0)

        # Return image as a direct download (No local storage)
        return StreamingResponse(
            img_io,
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=generated_image.png",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")
