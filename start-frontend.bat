@echo off
title Credit Assistant 2.0 - Frontend
echo ===================================================
echo Starting Credit Assistant 2.0 React 19 Frontend...
echo URL: http://localhost:5173
echo ===================================================
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)
npm run dev
pause
