@echo off
title Credit Assistant 2.0 - Backend API
echo ===================================================
echo Starting Credit Assistant 2.0 FastAPI Backend...
echo URL: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo ===================================================
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
