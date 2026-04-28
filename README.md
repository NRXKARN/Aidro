# AIDRO MISSION CONTROL // NATIONAL COMMAND CENTER
**Artificial Intelligence Disaster Response & Optimization Platform**

AIDRO v9.0 is a production-grade, high-integrity mission control system designed for government-led humanitarian response. It integrates real-time geospatial telemetry with advanced NLP triage logic powered by Google Gemini to optimize life-saving resource allocation during urban and rural disasters.

---

## 🏛️ Tactical Capabilities

*   **GEOSPATIAL COMMAND**: Real-time asset tracking and threat visualization with surgical precision.
*   **AI DISPATCH PROTOCOL**: Multi-tier incident triage using LLM-driven severity assessment (Google Gemini).
*   **LOGISTICS INTEGRITY**: Secure supply chain audit trails and predictive resource shortage alerts.
*   **RESILIENT COMMS**: Integrated SMS-fallback protocol for zero-bandwidth survival scenarios.
*   **RECONSTRUCTION PORTAL**: Automated eligibility estimation for post-disaster government aid (NDRF/SDRF).

## 🛠️ Technical Infrastructure

| Layer | Technology | Service |
| :--- | :--- | :--- |
| **Core UI** | React 18 / Vite | Mission Control Shell |
| **Telemetry** | Chart.js / Lucide | High-Precision Data Viz |
| **Intelligence** | FastAPI / Gemini Pro | Structured AI Triage Engine |
| **Storage** | Firebase Firestore | Global Real-time Persistence |
| **Security** | Pydantic / Python 3.10 | Request Validation & Robust Logs |

## ⚙️ Deployment Protocol

### 1. Environment Configuration
Establish a `.env` secure link in the root directory:
```env
# MISSION CRITICAL: API KEYS
GEMINI_API_KEY=your_secure_credential_here
VITE_API_BASE=/api
```

### 2. Frontend Initialization
```bash
npm install
npm run dev
```

### 3. Backend Command Activation
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 📋 Operational Integrity
This system is designed for high-stress environments. Log files are generated at `backend/aidro_mission.log` for post-operational audit and accountability.

---
*FOR AUTHORIZED HUMANITARIAN USE ONLY. SECURING THE HORIZON.*
