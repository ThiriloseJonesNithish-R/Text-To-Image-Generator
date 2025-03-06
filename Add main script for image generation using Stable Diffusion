# diffusers is a hugging face page for using diffusion models from huggingface hub
!pip install diffusers transformers gradio accelerate

from diffusers import StableDiffusionPipeline
import matplotlib.pyplot as plt
import torch

!pip show torch

model_id1 = "dreamlike-art/dreamlike-diffusion-1.0"
model_id2 = "stabilityai/stable-diffusion-xl-base-1.0"

pipe = StableDiffusionPipeline.from_pretrained(model_id1, torch_dtype=torch.float16, use_safetensors=True)
pipe = pipe.to("cuda")

prompt = """A tranquil forest scene at sunrise, with rays of golden light filtering through tall, lush trees. 
In the foreground, a serene stream flows over smooth stones, surrounded by colorful wildflowers. 
A gentle mist rises from the water, adding a mystical touch to the peaceful atmosphere."""

image = pipe(prompt).images[0]
print("[PROMPT]: ", prompt)
plt.imshow(image)
plt.axis('off')

prompt2 = """dreamlike, Goddess Durga coming down from the heaven with a weapon in one hand 
and other hand in the pose of blessing. Anger and divine energy reflecting from her eyes. 
She is in the form of a soldier and savior coming to protect the world from misery. 
She is accompanied by her tiger. Make sure to keep it cinematic and color to be golden iris"""

image = pipe(prompt2).images[0]
print('[PROMPT]: ', prompt2)
plt.imshow(image)
plt.axis('off')
