from typing import Dict, List
from pydantic import BaseModel

class Resource(BaseModel):
    id: str
    name: str
    quantity: int
    threshold: int
    unit: str

# Mock Inventory State
inventory_db: Dict[str, Resource] = {
    "MED-001": Resource(id="MED-001", name="Medical Kits", quantity=450, threshold=100, unit="Kits"),
    "WTR-001": Resource(id="WTR-001", name="Water Gallons", quantity=1200, threshold=500, unit="Liters"),
    "FOD-001": Resource(id="FOD-001", name="Survival Rations", quantity=80, threshold=200, unit="Packs"),
}

def get_inventory() -> List[Resource]:
    return list(inventory_db.values())

def update_stock(resource_id: str, amount: int):
    if resource_id in inventory_db:
        inventory_db[resource_id].quantity += amount
        return inventory_db[resource_id]
    return None

def check_shortages() -> List[str]:
    """Generates alerts for resources below threshold"""
    alerts = []
    for res in inventory_db.values():
        if res.quantity < res.threshold:
            alerts.append(f"CRITICAL SHORTAGE: {res.name} is at {res.quantity} {res.unit} (Threshold: {res.threshold})")
    return alerts
