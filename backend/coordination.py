import math
from typing import List, Dict
from pydantic import BaseModel
from database import get_rescue_volunteers

class Volunteer(BaseModel):
    id: str
    name: str
    skills: List[str]
    lat: float
    lng: float
    status: str = "Available"

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """Calculates the great-circle distance between two points on Earth."""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def match_volunteers_to_incident(incident_lat: float, incident_lng: float, required_skills: List[str]) -> List[Dict]:
    """Finds available volunteers who match skills and are closest."""
    volunteers = get_rescue_volunteers()
    matches = []
    
    for v_data in volunteers:
        if v_data.get("status") == "Available":
            v_skills = v_data.get("skills", [])
            # Skill check
            if any(skill in v_skills for skill in required_skills):
                dist = calculate_haversine_distance(incident_lat, incident_lng, v_data["lat"], v_data["lng"])
                matches.append((dist, v_data))
    
    matches.sort(key=lambda x: x[0])
    return [m[1] for m in matches[:3]]

def get_all_volunteers():
    return get_rescue_volunteers()
