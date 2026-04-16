import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
# Requires serviceAccountKey.json in the same directory
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Warning: Firebase could not be initialized (Missing credentials). Using mock DB. Error: {e}")
    # Mock database object for development
    class MockDB:
        def collection(self, name):
            return self
        def add(self, data):
            return [None, type('obj', (object,), {'id': 'mock_id'})]
    db = MockDB()

def get_live_incidents():
    """Fetches high priority incidents from Firestore"""
    docs = db.collection('reports').where('priority_score', '>', 80).stream()
    return [doc.to_dict() for doc in docs]
