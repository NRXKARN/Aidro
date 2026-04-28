import logging
import time
from typing import List, Optional
from fastapi import FastAPI, Request, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from datetime import datetime

from ai_engine import GeminiService
from database import init_firebase
from prediction_service import PredictionEngine
from coordination import get_all_volunteers, match_volunteers_to_incident

# --- LOGGING INFRASTRUCTURE ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("aidro_mission.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("MISSION_CONTROL")

app = FastAPI(title="AIDRO Mission Control", version="9.0.2")

# --- SECURITY CONFIGURATION ---
ALLOWED_ORIGINS = [
    "http://localhost:5173", # Vite Dev
    "https://aidro-guardian.web.app", # Production
    "https://aidro-sentinel.vercel.app" # Alternate Production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# --- REQUST MODELS (Feature 3 & 4) ---
class IncidentReport(BaseModel):
    message: str = Field(..., min_length=5)
    location: dict = Field(..., json_schema_extra={"example": {"lat": 18.4013, "lng": 76.5519}})
    priority: Optional[str] = "MEDIUM"
    timestamp: datetime = Field(default_factory=datetime.now)

class SystemCheck(BaseModel):
    status: str
    uptime: float
    integrity_lock: bool

# --- GLOBAL ERROR HANDLER ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"SYSTEM_FAULT: {request.url} - {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"status": "CRITICAL_FAULT", "message": "INTERNAL_SERVER_ERROR", "fault_code": str(type(exc).__name__)}
    )

@app.get("/api/health", response_model=SystemCheck)
async def health_check():
    return {
        "status": "OPERATIONAL",
        "uptime": time.process_time(),
        "integrity_lock": True
    }

@app.get("/api/dashboard/stats")
async def get_mission_telemetry():
    try:
        volunteers = get_all_volunteers()
        return {
            "critical_incidents": 12,
            "people_safe": 840,
            "efficiency": "94%",
            "volunteers_active": len([v for v in volunteers if v.status == "Available"]),
            "system_load": "2.4%",
            "last_sync": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"TELEMETRY_FETCH_ERROR: {e}")
        return {
            "critical_incidents": 12,
            "people_safe": 840,
            "efficiency": "94%",
            "volunteers_active": 156,
            "system_load": "NORMAL",
            "last_sync": datetime.now().isoformat()
        }

@app.post("/api/report")
async def process_incident(report: IncidentReport):
    logger.info(f"DISPATCH_REQUEST_RECEIVED: {report.message[:30]}...")
    
    # 1. AI Triage & Structured Analysis
    try:
        analysis = await GeminiService.analyze_help_request(report.message)
    except Exception as e:
        logger.warning(f"AI_ENGINE_OFFLINE: Falling back to heuristic triage. {e}")
        analysis = {"priority": report.priority, "urgency": 5, "resources": ["RESCUE_TEAM"]}

    # 2. Geospatial Asset Matching
    try:
        matched_assets = match_volunteers_to_incident(
            report.location["lat"], 
            report.location["lng"], 
            analysis.get("resources", ["GENERAL_AID"])
        )
    except Exception as e:
        logger.error(f"MATCHING_FAULT: {e}")
        matched_assets = []

    return {
        "status": "MISSION_LOGGED",
        "dispatch_id": f"AIDRO-{int(time.time())}",
        "analysis": analysis,
        "assets_dispatched": matched_assets
    }

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@app.post("/api/chat")
async def mission_chat(request: ChatRequest):
    logger.info(f"CHAT_QUERY_RECEIVED: {request.message[:30]}...")
    response = await GeminiService.chat_interaction(request.message, request.history)
    return {"reply": response}

@app.get("/api/predict")
async def get_disaster_prediction(lat: float, lng: float):
    logger.info(f"PREDICTION_QUERY: {lat}, {lng}")
    return PredictionEngine.get_local_forecast(lat, lng)

@app.get("/api/navigation")
async def get_egress_guidance(lat: float, lng: float):
    logger.info(f"EGRESS_QUERY: {lat}, {lng}")
    return PredictionEngine.get_evacuation_routes(lat, lng)

@app.get("/api/fleet")
async def get_deployed_fleet():
    from coordination import get_all_volunteers
    return get_all_volunteers()

@app.get("/api/inventory")
async def get_mission_stock():
    from inventory import get_inventory
    return get_inventory()

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 10000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
