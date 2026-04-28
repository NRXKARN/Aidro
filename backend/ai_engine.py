import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai
from dotenv import load_dotenv
import json
import logging
from typing import Dict, Any, List

load_dotenv()
logger = logging.getLogger("AI_ENGINE")

# --- ENGINE CONFIGURATION ---
API_KEY = os.getenv("GEMINI_API_KEY")

# Force Gemini to use API Key instead of any corrupted Firebase service accounts
if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
    del os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    logger.warning("GEMINI_API_KEY_MISSING: Intelligence features will operate in Fallback Mode.")

class GeminiService:
    """
    Industrial-grade AI Triage System.
    Processes distress signals into structured tactical intelligence.
    """
    
    @staticmethod
    async def analyze_help_request(sos_text: str) -> Dict[str, Any]:
        if not API_KEY:
            return GeminiService._get_fallback_triage("API_KEY_MISSING")

        try:
            # Using structured JSON output and async calling
            model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction="You are the AIDRO Mission Control AI. Provide precise triage data in JSON format only."
            )
            
            prompt = f"""
            Analyze distress transmission: "{sos_text}"

            JSON Schema Requirement:
            {{
                "rating": integer (0-100),
                "priority": "CRITICAL" | "URGENT" | "STANDARD",
                "disaster_type": "FLOOD" | "EARTHQUAKE" | "FIRE" | "MEDICAL",
                "victim_estimate": integer,
                "logic": "string",
                "resources": ["string"],
                "instructions": ["string"]
            }}
            """

            # ASYNC_API_CALL with JSON enforcement
            response = await model.generate_content_async(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            return json.loads(response.text)
            
        except Exception as e:
            logger.error(f"AI_TRIAGE_FAULT: {e}")
            return GeminiService._get_fallback_triage(str(e))

    @staticmethod
    def _get_fallback_triage(reason: str) -> Dict[str, Any]:
        return {
            "rating": 50,
            "priority": "STANDARD",
            "disaster_type": "UNCATEGORIZED",
            "victim_estimate": 1,
            "logic": f"Heuristic fallback triggered. Reason: {reason}",
            "resources": ["BASIC_MEDICAL_KIT", "WATER_SUPPLY"],
            "instructions": [
                "Stay in your current secure location.",
                "Conserve device power and drinking water.",
                "Wait for verified AIDRO field assets."
            ]
        }

    @staticmethod
    async def chat_interaction(user_input: str, history: List[Dict[str, str]] = []) -> str:
        """
        SENTINEL INTELLIGENCE CORE: Persistent Mission Context.
        Mission: Global Guardian Protocol.
        """
        if not API_KEY:
             return "OFFLINE_PROTOCOL: Move to Sector Primary (High Ground). Signal via 3-pulse light flashes. Stand by."

        try:
            # Transform history into Google Gemini format
            formatted_history = []
            for h in history:
                # Gemini requires history to start with 'user'
                if len(formatted_history) == 0 and h["type"] != "user":
                    continue
                role = "user" if h["type"] == "user" else "model"
                # Ensure strictly alternating roles
                if len(formatted_history) > 0 and formatted_history[-1]["role"] == role:
                    # Skip or merge if roles don't alternate
                    continue
                formatted_history.append({"role": role, "parts": [h["text"]]})

            model = genai.GenerativeModel('gemini-1.5-flash-latest')
            chat = model.start_chat(history=formatted_history)
            
            prompt = f"""
            SYSTEM ROLE: You are the AIDRO Tactical Coordinator (ATC). 
            OPERATIONAL ENVIRONMENT: Global Sentinel Command (Google Solution Challenge Grade).
            MISSION: Absolute Human Life Preservation.
            
            TACTICAL PROTOCOLS:
            1. RECOGNIZE CONTEXT: Use previous messages to offer continuous guidance.
            2. PERSONALITY: Authoritative, calm, surgical precision.
            3. OUTPUT: Step-by-step survival vectors (1.1, 1.2, 1.3).
            4. If user is in shock: LOCK IN on grounding.
            
            FIELD_INPUT: "{user_input}"
            
            ATC_RESPONSE:
            """
            response = await chat.send_message_async(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"ENGINE_CRITICAL_FAULT: {e}")
            return "SIGNAL_DROPOUT: Execute 'Grounding Alpha' - In for 4, Hold for 4, Out for 4."
