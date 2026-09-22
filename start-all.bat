@echo off
title Credit Assistant 2.0 Launcher
echo Launching Credit Assistant 2.0 Full-Stack Environment...
start "Credit Assistant Backend" "%~dp0start-backend.bat"
timeout /t 3 /nobreak >nul
start "Credit Assistant Frontend" "%~dp0start-frontend.bat"
echo Done! Backend running on http://127.0.0.1:8000 and Frontend on http://localhost:5173
