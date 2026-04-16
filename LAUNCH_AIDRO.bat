@echo off
title Launching AIDRO...
echo [1/3] Checking environment...
cd /d %~dp0

echo [2/3] Starting Backend (FastAPI)...
start cmd /k "cd backend && pip install -r requirements.txt && python -m uvicorn main:app --reload"

echo [3/3] Starting Frontend (React)...
start cmd /k "npm install && npm run dev"

echo ----------------------------------------------------
echo AIDRO SHOULD BE LIVE IN A FEW SECONDS!
echo Dashboard: http://localhost:5173
echo API: http://localhost:8000
echo ----------------------------------------------------
pause
