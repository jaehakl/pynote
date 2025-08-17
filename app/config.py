from __future__ import annotations
import os, yaml
from dotenv import load_dotenv

APP_TITLE = "PyNote — Mission Control"
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "pynote.yaml")

load_dotenv()

def load_config() -> dict:
    try:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or {}
    except Exception as e:
        print("[WARN] config load:", e)
    return {}

CONFIG = load_config()