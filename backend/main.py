from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICE_ACCOUNT_PATH = "/Users/munewerkiar/Desktop/App_Dev/credentials/serviceAccount.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

@app.get("/")
def home():
    return {"message": "Lost and Found API is running"}

@app.get("/api/items/search")
def search_items(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    room_num: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
):
    docs = db.collection("items").stream()

    items = []
    q_lower = q.strip().lower() if q else None
    category_lower = category.strip().lower() if category else None
    color_lower = color.strip().lower() if color else None
    location_lower = location.strip().lower() if location else None
    room_lower = room_num.strip().lower() if room_num else None
    status_lower = status.strip().lower() if status else None

    selected_date = None
    if date:
        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD."}

    for doc in docs:
        item = doc.to_dict()
        item["id"] = doc.id

        name = str(item.get("name", "")).lower()
        description = str(item.get("description", "")).lower()
        item_category = str(item.get("category", "")).lower()
        item_color = str(item.get("color", "")).lower()
        item_location = str(item.get("location", "")).lower()
        item_room = str(item.get("room_num", "")).lower()
        item_status = str(item.get("status", "")).lower()

        if q_lower and q_lower not in name and q_lower not in description:
            continue
        if category_lower and category_lower not in item_category:
            continue
        if color_lower and color_lower not in item_color:
            continue
        if location_lower and location_lower not in item_location:
            continue
        if room_lower and room_lower not in item_room:
            continue
        if status_lower and status_lower not in item_status:
            continue

        if selected_date:
            reported_at = item.get("reportedAt")
            if not reported_at:
                continue

            try:
                item_date = datetime.fromtimestamp(reported_at / 1000).date()
            except Exception:
                continue

            if item_date != selected_date:
                continue

        items.append(item)

    items.sort(key=lambda x: x.get("reportedAt", 0), reverse=True)
    return items
