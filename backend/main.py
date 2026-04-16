from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import GeminiService
from database import init_firebase
from inventory import get_inventory, update_stock, check_shortages

app = FastAPI()

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is working 🚀"}

@app.get("/api/dashboard/stats")
async def get_stats():
    # Integrated from previous build
    return {
        "critical_incidents": 15,
        "people_safe": 1240,
        "efficiency": "88%",
        "alerts": check_shortages()
    }

@app.post("/api/report")
async def report_incident(data: dict):
    # Integrated Gemini AI logic
    analysis = await GeminiService.analyzeHelpRequest(data.get("description", ""))
    return {"status": "success", "analysis": analysis}
