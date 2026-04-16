# AIDRO Project Setup Script (Windows PowerShell)

Write-Host "--- Initializing AIDRO Development Environment ---" -ForegroundColor Cyan

# 1. Frontend Setup
Write-Host "`n[1/3] Setting up Frontend (React)..." -ForegroundColor Yellow
cd e:\aidro
if (!(Test-Path "node_modules")) {
    Write-Host "Note: No node_modules found. Please run 'npm install' manually in e:\aidro." -ForegroundColor Gray
}

# 2. Backend Setup
Write-Host "`n[2/3] Setting up Backend (Python)..." -ForegroundColor Yellow
cd e:\aidro\backend
if (!(Test-Path "venv")) {
    python -m venv venv
    Write-Host "Virtual environment created." -ForegroundColor Green
}
Write-Host "Note: Please activate venv and run 'pip install -r requirements.txt'." -ForegroundColor Gray

# 3. Environment Config
Write-Host "`n[3/3] Finalizing Config..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    "VITE_GEMINI_API_KEY=YOUR_KEY_HERE" | Out-File -FilePath "e:\aidro\.env" -Encoding utf8
    "GEMINI_API_KEY=YOUR_KEY_HERE" | Out-File -FilePath "e:\aidro\backend\.env" -Encoding utf8
    Write-Host ".env templates created." -ForegroundColor Green
}

Write-Host "`n--- SETUP COMPLETE ---" -ForegroundColor Cyan
Write-Host "To start the system:"
Write-Host "1. Frontend: npm run dev (in e:\aidro)"
Write-Host "2. Backend: uvicorn main:app --reload (in e:\aidro\backend)"
