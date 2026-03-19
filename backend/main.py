from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "lost_found.db"

@app.get("/")
def home():
    return {"message": "Lost and Found API is running"}

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/items/search")
def search_items(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
):
    sql = "SELECT * FROM items WHERE 1=1"
    params = []

    if q:
        sql += " AND (title LIKE ? OR description LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%"])

    if category:
        sql += " AND category = ?"
        params.append(category)

    if color:
        sql += " AND color LIKE ?"
        params.append(f"%{color}%")

    if location:
        sql += " AND location_found LIKE ?"
        params.append(f"%{location}%")

    if status:
        sql += " AND status = ?"
        params.append(status)

    if date:
        sql += " AND date_reported = ?"
        params.append(date)

    sql += " ORDER BY date_reported DESC"

    conn = get_connection()
    rows = conn.execute(sql, params).fetchall()
    conn.close()

    return [dict(row) for row in rows]