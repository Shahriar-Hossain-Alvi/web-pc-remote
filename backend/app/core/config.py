import os
from pathlib import Path

from dotenv import load_dotenv

# Load the .env file from the backend directory
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

VLC_HOST = os.getenv("VLC_HOST", "http://127.0.0.1:8080")
VLC_PASSWORD = os.getenv("VLC_PASSWORD", "")
