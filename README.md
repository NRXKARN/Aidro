# AIDRO - Artificial Intelligence Disaster Resource Optimizer

AIDRO is a state-of-the-art, AI-powered platform designed to revolutionize resources allocation during large-scale emergencies. By combining predictive modeling with real-time NLP analysis from **Google Gemini**, AIDRO provides authorities with the intelligence needed to save lives faster.

## 🚀 Key Features

- **🔮 Disaster Prediction**: Integrated ML structures to identify high-risk zones early.
- **📍 Real-time SOS Reporting**: A mobile-optimized portal for survivors to submit requests.
- **🤖 Gemini AI Prioritization**: Uses Google Gemini to extract severity and urgency from free-text reports, generating a 1-100 "Life-Risk Score".
- **📊 Admin Dashboard**: A premium, data-driven command center for real-time tracking.
- **🗺️ Tactical Map View**: Interactive GIS mapping with heatmaps and zone analytics.

## ⚙️ Technical Stack

- **Frontend**: React.js 18, Vite, Framer Motion, Lucide Icons.
- **Styling**: Premium CSS (Glassmorphism, Dark Theme).
- **AI Engine**: Google Gemini Pro (via `@google/generative-ai`).
- **Icons**: Lucide React.
- **Deployment**: Prepared for Cloud (Firebase/Vercel).

## 🛠️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd aidro
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Keys**:
   Create a `.env` file in the root:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

## 🧠 AI Simulation Logic

The core logic resides in `src/services/GeminiService.js`. It takes raw text inputs from the SOS page and prompts Gemini Pro to:
1. Extract the specific emergency type.
2. Determine the urgency (1-10) and population impact.
3. Suggest the optimal distribution of food, water, and medical resources.

---
*Built for the betterment of humanitarian response.*
