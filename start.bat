@echo off
REM =====================================================
REM Dataset Analyser Pipeline - Phase 1 Quick Start (Windows)
REM =====================================================

echo.
echo 🚀 Dataset Analyser Pipeline - Phase 1
echo =======================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Node.js not found. Please install Node.js 16+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✅ Node.js %NODE_VER%

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Python not found. Please install Python 3.8+
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VER=%%i
echo ✅ Python %PYTHON_VER%

REM Check Python packages
echo Checking Python packages...
python -c "import sklearn; import pandas; import numpy" >nul 2>&1
if errorlevel 1 (
    echo Installing Python packages: scikit-learn, pandas, numpy
    python -m pip install scikit-learn pandas numpy -q
    echo ✅ Python packages installed
) else (
    echo ✅ Python packages found
)

REM Backend setup
echo.
echo Setting up Backend...
if exist backend (
    cd backend
    if not exist node_modules (
        echo Installing backend dependencies...
        call npm install -q
    )
    cd ..
    echo ✅ Backend ready
) else (
    echo ⚠️  backend directory not found
)

REM Frontend setup
echo.
echo Setting up Frontend...
if exist frontend (
    cd frontend
    if not exist node_modules (
        echo Installing frontend dependencies...
        call npm install -q
    )
    cd ..
    echo ✅ Frontend ready
) else (
    echo ⚠️  frontend directory not found
)

REM Start servers
echo.
echo =======================================
echo 📊 Starting Dataset Analyser Pipeline
echo =======================================
echo.

REM Start backend in new window
echo Starting Backend on port 5000...
start cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start frontend in new window
echo Starting Frontend on port 3000...
start cmd /k "cd frontend && npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak

echo.
echo =======================================
echo ✨ All systems operational!
echo =======================================
echo.
echo 🌐 Dashboard: http://localhost:3000
echo 🔌 API: http://localhost:5000/api
echo.
echo 📊 Sample data available: sample_data.csv
echo.
echo Press Ctrl+C in the command windows to stop services
echo.

REM Open dashboard in browser
timeout /t 2 /nobreak
start http://localhost:3000
