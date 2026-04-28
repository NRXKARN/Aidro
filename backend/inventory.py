from typing import Dict, List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_global_inventory, update_document

class ItemStatus:
    WAREHOUSE = "In Warehouse"
    TRANSIT = "In Transit"
    DISTRIBUTED = "Distributed"
    EXPIRED = "Expired"

class Resource(BaseModel):
    id: str
    name: str
    category: str
    quantity: int
    threshold: int
    unit: str
    expiry: Optional[str] = None
    location: str = "Central Hub"
    status: str = ItemStatus.WAREHOUSE

def get_inventory() -> List[Dict]:
    return get_global_inventory()

def update_stock(resource_id: str, amount: int, action: str, actor: str, notes: str = ""):
    """Updates stock levels with persistence."""
    current_inventory = get_global_inventory()
    resource = next((r for r in current_inventory if r["id"] == resource_id), None)
    
    if resource:
        new_quantity = resource["quantity"] + amount
        update_document('inventory', resource_id, {"quantity": new_quantity})
        return {**resource, "quantity": new_quantity}
    return None

def check_shortages() -> List[str]:
    inventory = get_global_inventory()
    alerts = []
    for res in inventory:
        if res["quantity"] < res.get("threshold", 0):
            alerts.append(f"CRITICAL SHORTAGE: {res['name']} (Qty: {res['quantity']})")
    return alerts
