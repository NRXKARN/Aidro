@echo off
title AIDRO MISSION ACTIVATION
cd /d %~dp0

echo [1/2] INITIALIZING BACKEND...
if exist "backend\venv\Scripts\python.exe" (
    start "AIDRO_BACKEND" cmd /k "cd backend && .\venv\Scripts\python main.py"
) else (
    echo [WARNING] Virtual environment not detected. Attempting global python...
    start "AIDRO_BACKEND" cmd /k "cd backend && python main.py"
)

echo [2/2] INITIALIZING FRONTEND...
if exist "node_modules\.bin\vite.exe" (
    start "AIDRO_FRONTEND" cmd /k "npm run dev"
) else (
    echo [ERROR] Dependencies missing. Attempting install...
    start "AIDRO_FRONTEND" cmd /k "npm install && npm run dev"
)

echo ----------------------------------------------------
echo SYSTEM IS BOOTING. PLEASE CHECK THE NEW WINDOWS.
echo If a window closes immediately, look for errors.
echo Ready Link: http://localhost:5173
echo ----------------------------------------------------
pause
