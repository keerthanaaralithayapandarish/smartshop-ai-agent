"""Sample data so Member 2 can build/test without waiting for Members 3 and 4.
Shapes here define the CONTRACT the real services should return (see README)."""

PRODUCTS = [
    {"id": "L-A", "name": "Laptop A", "category": "laptop", "price": 55000, "ram_gb": 16, "storage_gb": 512,
     "processor": "Intel i5", "ram_type": "DDR4", "max_ram_gb": 32, "m2_slots": 1, "screen_in": 15.6,
     "battery_wh": 56, "weight_kg": 1.7},
    {"id": "L-B", "name": "Laptop B", "category": "laptop", "price": 45000, "ram_gb": 8, "storage_gb": 1000,
     "processor": "Ryzen 5", "ram_type": "DDR4", "max_ram_gb": 16, "m2_slots": 1, "screen_in": 14.0,
     "battery_wh": 45, "weight_kg": 1.4},
    {"id": "L-C", "name": "Laptop C", "category": "laptop", "price": 78000, "ram_gb": 16, "storage_gb": 1000,
     "processor": "Intel i7", "ram_type": "DDR5", "max_ram_gb": 64, "m2_slots": 2, "screen_in": 15.6,
     "battery_wh": 72, "weight_kg": 1.9},
    {"id": "ACC-RAM", "name": "DDR4 16GB RAM Module", "category": "ram", "price": 3200, "ram_type": "DDR4",
     "capacity_gb": 16},
    {"id": "ACC-SSD", "name": "NVMe 1TB SSD", "category": "ssd", "price": 5500, "interface": "M.2 NVMe",
     "capacity_gb": 1000},
    {"id": "ACC-BAG", "name": "Laptop Sleeve 15.6 inch", "category": "bag", "price": 900, "max_screen_in": 15.6},
]

DOCS = [
    {"product_id": "L-A", "source": "Laptop A user manual, p.12",
     "text": "Laptop A has two SODIMM slots supporting DDR4 memory up to 32 GB total. One M.2 NVMe slot is available."},
    {"product_id": "L-A", "source": "Laptop A spec sheet",
     "text": "Battery: 56 Wh, up to 8 hours of mixed use. Warranty: 1 year manufacturer warranty."},
    {"product_id": "L-B", "source": "Laptop B user manual, p.9",
     "text": "Laptop B supports DDR4 memory up to 16 GB. Only one SODIMM slot is user accessible."},
    {"product_id": "L-B", "source": "Laptop B spec sheet",
     "text": "Battery: 45 Wh, up to 6 hours of mixed use. Warranty: 1 year manufacturer warranty. Ports: 2 USB-A, 1 USB-C, HDMI."},
    {"product_id": "L-C", "source": "Laptop C user manual, p.15",
     "text": "Laptop C supports DDR5 memory up to 64 GB and two M.2 NVMe slots. DDR4 modules are NOT compatible."},
    {"product_id": "L-C", "source": "Laptop C spec sheet",
     "text": "Battery: 72 Wh, up to 10 hours of mixed use. Warranty: 2 years. Ports: 2 USB-C (Thunderbolt 4), 2 USB-A, HDMI 2.1."},
]

STORES = {
    "S-A": {"id": "S-A", "name": "Store A", "city": "Bengaluru", "area": "Koramangala", "distance_km": 2.1},
    "S-B": {"id": "S-B", "name": "Store B", "city": "Bengaluru", "area": "Indiranagar", "distance_km": 5.4},
    "S-C": {"id": "S-C", "name": "Store C", "city": "Bengaluru", "area": "Whitefield", "distance_km": 14.8},
}

# product_id -> store_id -> qty
STOCK = {
    "L-A": {"S-A": 5, "S-B": 0, "S-C": 3},
    "L-B": {"S-A": 0, "S-B": 2, "S-C": 0},
    "L-C": {"S-A": 1, "S-B": 0, "S-C": 0},
    "ACC-RAM": {"S-A": 10, "S-B": 4, "S-C": 0},
    "ACC-SSD": {"S-A": 0, "S-B": 0, "S-C": 6},
    "ACC-BAG": {"S-A": 20, "S-B": 20, "S-C": 20},
}
