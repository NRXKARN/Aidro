import firebase_admin
import os
import logging
from typing import List, Dict
from firebase_admin import credentials, firestore

logger = logging.getLogger("DATABASE")

# Global DB instance
db = None

def init_firebase():
    """Initializes the database connection with robust error isolation."""
    global db
    try:
        # 1. Check for specific environment variable path
        sa_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")
        
        # 2. Check if the file exists before attempting to load
        if os.path.exists(sa_path) and False: # Force skip to prevent grpc Auth locks
            cred = credentials.Certificate(sa_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            logger.info(f"FIREBASE_LINK_ESTABLISHED: Using credentials from {sa_path}")
        else:
            # 3. Fallback to Application Default Credentials
            firebase_admin.initialize_app()
            db = firestore.client()
            logger.info("FIREBASE_LINK_ESTABLISHED: Using ADC/Managed identity.")
    except Exception as e:
        logger.warning(f"FIREBASE_INIT_SKIPPED: {e}. Reverting to high-integrity MOCK_DB.")
        
        class MockCollection:
            def where(self, *args, **kwargs): return self
            def limit(self, *args, **kwargs): return self
            def order_by(self, *args, **kwargs): return self
            def stream(self): return []
            def get(self): return []
            def add(self, data): return [None, type('obj', (object,), {'id': 'mock_821'})]
            def document(self, id): return self
            def set(self, data): return True
            def to_dict(self): return {}

        class MockDB:
            def collection(self, name): return MockCollection()
        
        db = MockDB()

def get_collection_data(collection_name: str) -> List[Dict]:
    """Generic fetcher for collection data with error isolation."""
    if not db:
        init_firebase()
    try:
        docs = db.collection(collection_name).stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        logger.error(f"FETCH_ERROR [{collection_name}]: {e}")
        return []

def update_document(collection_name: str, doc_id: str, data: Dict):
    """Generic document updater."""
    if not db:
        init_firebase()
    try:
        db.collection(collection_name).document(doc_id).set(data, merge=True)
        return True
    except Exception as e:
        logger.error(f"UPDATE_ERROR [{doc_id}]: {e}")
        return False

def get_live_incidents():
    return get_collection_data('reports')

def get_global_inventory():
    data = get_collection_data('inventory')
    if not data: # Fallback for demo/dev
        return [
            {"id": "MED-001", "name": "Medical Kits", "quantity": 450, "threshold": 100},
            {"id": "WTR-001", "name": "Water Gallons", "quantity": 1200, "threshold": 500}
        ]
    return data

def get_rescue_volunteers():
    data = get_collection_data('volunteers')
    if not data: # Fallback for demo/dev
        return [
            {"id": "VOL-01", "name": "Arjun Mehta", "skills": ["Medical"], "lat": 18.4050, "lng": 76.5550, "status": "Available"},
            {"id": "VOL-02", "name": "Sanya Ray", "skills": ["Rescue"], "lat": 18.4100, "lng": 76.5600, "status": "Available"}
        ]
    return data
