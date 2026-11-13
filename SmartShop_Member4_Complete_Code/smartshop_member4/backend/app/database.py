import os
import sqlite3
from pathlib import Path

DB_PATH = Path(os.getenv("SMARTSHOP_DB_PATH", Path(__file__).resolve().parents[1] / "smartshop.db"))

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    with get_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS stores (
            store_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            phone TEXT
        );

        CREATE TABLE IF NOT EXISTS inventory (
            store_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0 CHECK(quantity >= 0),
            PRIMARY KEY (store_id, product_id),
            FOREIGN KEY (store_id) REFERENCES stores(store_id)
        );
        """)
        store_count = conn.execute("SELECT COUNT(*) FROM stores").fetchone()[0]
        if store_count == 0:
            stores = [
                ("store-a", "SmartShop Central", "MG Road", "Bengaluru", 12.9750, 77.6060, "+91-80000-10001"),
                ("store-b", "SmartShop North", "Yelahanka", "Bengaluru", 13.1007, 77.5963, "+91-80000-10002"),
                ("store-c", "SmartShop South", "Jayanagar", "Bengaluru", 12.9250, 77.5838, "+91-80000-10003"),
            ]
            conn.executemany("INSERT INTO stores VALUES (?, ?, ?, ?, ?, ?, ?)", stores)
            stock = [
                ("store-a", "laptop-a", 5), ("store-b", "laptop-a", 0), ("store-c", "laptop-a", 3),
                ("store-a", "laptop-b", 2), ("store-b", "laptop-b", 6), ("store-c", "laptop-b", 1),
                ("store-a", "laptop-c", 0), ("store-b", "laptop-c", 4), ("store-c", "laptop-c", 2),
            ]
            conn.executemany("INSERT INTO inventory VALUES (?, ?, ?)", stock)
