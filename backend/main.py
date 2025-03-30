from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
import torch
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from fastapi.responses import StreamingResponse
import os
import time
import threading

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
MODEL_IDS = {
    1: "dreamlike-art/dreamlike-diffusion-1.0",
    2: "runwayml/stable-diffusion-v1-5"
}

# Detect if CUDA is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Model cache and tracking last usage time
model_cache = {}
model_last_used = {}

def get_model(model_choice: int):
    """Load the model if not already cached"""
    if model_choice not in MODEL_IDS:
        raise HTTPException(status_code=400, detail="Invalid model choice. Choose 1 or 2.")

    if model_choice not in model_cache:
        model_id = MODEL_IDS[model_choice]
        print(f"Loading model {model_id}...")
        model_cache[model_choice] = StableDiffusionPipeline.from_pretrained(
            model_id, torch_dtype=torch.float16 if device == "cuda" else torch.float32, use_safetensors=True
        ).to(device)
        print(f"Model {model_id} loaded.")

    # Update last used timestamp
    model_last_used[model_choice] = time.time()

    return model_cache[model_choice]

def unload_unused_models():
    """Periodically check and unload unused models"""
    while True:
        time.sleep(60)  # Check every 60 seconds
        current_time = time.time()

        for model_choice in list(model_last_used.keys()):
            if current_time - model_last_used[model_choice] > 300:  # Unload after 5 mins
                print(f"Unloading model {MODEL_IDS[model_choice]} due to inactivity...")
                model_cache[model_choice].to("cpu")  # Move model to CPU
                del model_cache[model_choice]
                del model_last_used[model_choice]
                torch.cuda.empty_cache()
                print(f"Model {MODEL_IDS[model_choice]} unloaded.")

# Start background thread for model unloading
threading.Thread(target=unload_unused_models, daemon=True).start()

# Request schema
class PromptRequest(BaseModel):
    prompt: str
    model_choice: int  # 1 or 2
    aspect_ratio: str  # 'portrait' or 'landscape'
    resolution: str  # 'low', 'medium', 'high'

@app.get("/status")
async def get_status():
    return {"status": "Server is running"}

@app.post("/generate")
async def generate_image(request: PromptRequest, background_tasks: BackgroundTasks):
    prompt = request.prompt
    model_choice = request.model_choice
    aspect_ratio = request.aspect_ratio
    resolution = request.resolution

    # Load model lazily
    pipe = get_model(model_choice)

    # Set base dimensions based on aspect ratio
    if aspect_ratio == 'portrait':
        base_height, base_width = 512, 384
    elif aspect_ratio == 'landscape':
        base_height, base_width = 384, 512
    else:
        raise HTTPException(status_code=400, detail="Invalid aspect ratio. Choose 'portrait' or 'landscape'.")

    # Adjust dimensions based on resolution
    if resolution == "low":
        height, width = 512, 512
    elif resolution == "medium":
        height, width = 768, 768
    elif resolution == "high":
        height, width = 1024, 1024
    else:
        raise HTTPException(status_code=400, detail="Invalid resolution. Choose 'low', 'medium', or 'high'.")

    # Optimize inference steps based on device
    num_inference_steps = 50 if device == "cuda" else 25  # 50 on GPU, 25 on CPU

    try:
        print(f"Generating image with Model {model_choice}, Steps: {num_inference_steps}, Device: {device}, Resolution: {resolution}, aspect_ratio: {aspect_ratio}")

        # Generate image efficiently
        with torch.no_grad():
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
