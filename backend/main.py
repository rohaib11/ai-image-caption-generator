from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from captioner import generate_caption
import os
import shutil
import uuid
import logging

# === Config ===
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

# === Ensure uploads directory exists ===
os.makedirs(UPLOAD_DIR, exist_ok=True)

# === Logger setup ===
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === FastAPI App ===
app = FastAPI(title="Image Caption Generator API", version="1.1")

# === CORS Setup ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # replace with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === File Size Limit Middleware ===
@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > MAX_FILE_SIZE:
        return JSONResponse(content={"error": "File too large (max 5MB)"}, status_code=413)
    return await call_next(request)

# === Image Caption Endpoint ===
@app.post("/caption/")
async def caption_image(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")

        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

        # Generate unique file path
        ext = os.path.splitext(file.filename)[-1]
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        # Save file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Generate caption using BLIP
        caption = generate_caption(file_path)

        # Clean up uploaded file
        os.remove(file_path)

        return {"caption": caption}

    except HTTPException as he:
        logger.warning(f"HTTP error: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process image.")
