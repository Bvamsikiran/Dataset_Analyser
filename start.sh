#!/bin/bash

# =====================================================
# Dataset Analyser Pipeline - Phase 1 Quick Start
# =====================================================
# This script automates setup and startup

echo "🚀 Dataset Analyser Pipeline - Phase 1"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check Python
echo -e "${BLUE}Checking Python...${NC}"
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python not found. Please install Python 3.8+${NC}"
    exit 1
fi
PYTHON_CMD=$(command -v python3 || command -v python)
echo -e "${GREEN}✅ Python ($($PYTHON_CMD --version))${NC}"

# Check Python packages
echo -e "${BLUE}Checking Python packages...${NC}"
$PYTHON_CMD -c "import sklearn; import pandas; import numpy" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Installing Python packages: scikit-learn, pandas, numpy${NC}"
    $PYTHON_CMD -m pip install scikit-learn pandas numpy -q
    echo -e "${GREEN}✅ Python packages installed${NC}"
else
    echo -e "${GREEN}✅ Python packages found${NC}"
fi

# Backend setup
echo ""
echo -e "${BLUE}Setting up Backend...${NC}"
if [ -d "backend" ]; then
    cd backend
    if [ ! -d "node_modules" ]; then
        echo "Installing backend dependencies..."
        npm install -q
    fi
    cd ..
    echo -e "${GREEN}✅ Backend ready${NC}"
else
    echo -e "${YELLOW}⚠️  backend directory not found${NC}"
fi

# Frontend setup
echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install -q
    fi
    cd ..
    echo -e "${GREEN}✅ Frontend ready${NC}"
else
    echo -e "${YELLOW}⚠️  frontend directory not found${NC}"
fi

# Start servers
echo ""
echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}📊 Starting Dataset Analyser Pipeline${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""

# Start backend in background
echo -e "${BLUE}Starting Backend on port 5000...${NC}"
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${YELLOW}⚠️  Backend failed to start. Check backend.log${NC}"
    cat backend.log
    exit 1
fi
echo -e "${GREEN}✅ Backend running (PID: $BACKEND_PID)${NC}"

# Start frontend
echo -e "${BLUE}Starting Frontend on port 3000...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${YELLOW}⚠️  Frontend failed to start. Check frontend.log${NC}"
    cat frontend.log
    kill $BACKEND_PID
    exit 1
fi
echo -e "${GREEN}✅ Frontend running (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}✨ All systems operational!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
echo -e "${BLUE}🌐 Dashboard: http://localhost:3000${NC}"
echo -e "${BLUE}🔌 API: http://localhost:5000/api${NC}"
echo ""
echo "📊 Sample data available: sample_data.csv"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Handle Ctrl+C
trap "
echo ''
echo 'Stopping services...'
kill $BACKEND_PID $FRONTEND_PID
echo 'Services stopped'
exit 0
" SIGINT

# Wait for processes
wait
