# 🚀 Dataset Analyser Pipeline - Phase 1 Quick Start Guide

## ✅ Architecture Complete

Your project now has a complete **3-layer modular architecture**:
- **Frontend**: React + Vite (dark-themed interactive dashboard)
- **Backend**: Node.js + Express (CSV handling & API)
- **Engine**: Python micro-script (scikit-learn regression)

---

## 📦 Installation & Setup

### Step 1: Backend Setup
```bash
cd backend
npm install
```

**Required**: Python 3.8+ with scikit-learn installed:
```bash
pip install scikit-learn pandas numpy
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
```

### Step 3: Start the Backend Server
```bash
cd backend
npm start
# OR for development with auto-reload:
npm run dev
```
✅ Backend runs on: `http://localhost:5000`  
✅ API endpoints ready:
- `POST http://localhost:5000/api/upload`
- `POST http://localhost:5000/api/regression`
- `GET http://localhost:5000/api/health`

### Step 4: Start the Frontend Dev Server
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: `http://localhost:3000`  
✅ Dashboard opens automatically in your browser

---

## 📋 Complete Project Structure

```
Dataset_Analyser/
│
├── Phase_1_Regression.py          # (READ-ONLY) Reference Streamlit app
├── README.md                       # This file
├── ARCHITECTURE.md                 # Detailed system design
│
├── backend/                        # Node.js Express API
│   ├── package.json               # Backend dependencies
│   ├── .env                        # Backend config
│   ├── server.js                  # Express server setup
│   ├── routes/
│   │   └── analysis.js            # CSV & regression endpoints
│   └── engine/
│       └── reg_runner.py          # Python regression calculator
│
└── frontend/                       # React.js Dashboard
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite configuration
    ├── .env                        # Frontend config
    ├── public/
    │   └── index.html             # HTML entry point
    └── src/
        ├── index.jsx              # React entry point
        ├── index.css              # Global styles
        ├── App.jsx                # Main dashboard (4 states)
        └── App.css                # Component styles
```

---

## 🎯 How It Works

### User Journey:

1. **UPLOAD STATE**
   - User drags-and-drops a CSV file onto the upload zone
   - Frontend sends file to `POST /api/upload`
   - Backend parses CSV, detects numeric columns, stores in memory
   - Frontend receives: headers, numeric columns, preview rows

2. **PREVIEW STATE**
   - Dataset displays in scrollable table
   - Shows first 5 rows with all columns
   - User can scroll through data

3. **CONFIGURE STATE**
   - Two dropdowns show available numeric columns
   - User selects X column (predictor) and Y column (target)
   - Formula reference displayed: `y = mx + c`

4. **VISUALIZE STATE**
   - Frontend sends `POST /api/regression` with filename, xColumn, yColumn
   - Backend extracts X and Y values from in-memory dataset
   - Backend spawns Python subprocess (`reg_runner.py`)
   - Python script computes: slope, intercept, R², MSE, scatter points, line coords
   - Python outputs clean JSON to stdout
   - Backend parses JSON and returns to frontend
   - Frontend renders:
     - Scatter plot (blue data points)
     - Red regression line overlay
     - Metrics panel with equation

---

## 📊 Data Flow (Technical)

```
CSV File Upload
    ↓
[Frontend FormData] → POST /api/upload → [Backend Multer]
    ↓
[Backend In-Memory Storage] {filename: {data, headers, numericColumns}}
    ↓
User selects X and Y columns
    ↓
[Frontend] → POST /api/regression {filename, xColumn, yColumn}
    ↓
[Backend] Extracts X and Y arrays from memory
    ↓
[Node.js spawn] → Python subprocess (reg_runner.py)
    ↓
[Python] Receives JSON: {x_values: [...], y_values: [...]}
    ↓
[scikit-learn] LinearRegression.fit() → predictions
    ↓
[Python] Calculates: slope, intercept, R², MSE
    ↓
[Python] Outputs JSON to stdout
    ↓
[Backend] Parses stdout JSON
    ↓
[Backend] Returns JSON response to Frontend
    ↓
[Frontend] Renders Chart.js Scatter plot with metrics
```

---

## 🧪 Testing with Sample Data

### Option 1: Create Test CSV
```csv
age,salary,experience,performance
25,50000,1,78
30,65000,5,85
35,75000,10,88
40,85000,15,92
45,95000,20,95
50,105000,25,98
```

Save as `test_data.csv` and upload via the frontend dashboard.

### Option 2: Use Your Own Data
- Must have at least 2 numeric columns
- CSV format with headers in first row
- Any filename works

---

## 🎨 Frontend UI Features

### Dark Theme
- Background: Gradient from `#0f0f23` to `#1a0033`
- Accent colors: Indigo (`#6366f1`) & Pink (`#ec4899`)
- Text: Light gray (`#e0e0e0`)

### Interactive Elements
- **Drag-and-drop upload** with visual feedback
- **Responsive table** with hover effects
- **Smooth transitions** between states
- **Real-time chart** with Chart.js Scatter plot
- **Metrics dashboard** showing regression statistics

### Mobile Responsive
- Desktop: Full layout with side-by-side chart + metrics
- Tablet: Stacked layout
- Mobile: Single column with touch-friendly buttons

---

## 🔧 Backend API Reference

### POST /api/upload
**Uploads and parses CSV file**

**Request:**
```bash
curl -F "file=@data.csv" http://localhost:5000/api/upload
```

**Response:**
```json
{
  "success": true,
  "filename": "data.csv",
  "totalRows": 100,
  "headers": ["age", "salary", "experience"],
  "numericColumns": ["age", "salary", "experience"],
  "preview": [
    {"age": "25", "salary": "50000", "experience": "1"},
    {"age": "30", "salary": "65000", "experience": "5"}
  ]
}
```

---

### POST /api/regression
**Computes linear regression for selected columns**

**Request:**
```bash
curl -X POST http://localhost:5000/api/regression \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "data.csv",
    "xColumn": "age",
    "yColumn": "salary"
  }'
```

**Response:**
```json
{
  "success": true,
  "xColumn": "age",
  "yColumn": "salary",
  "slope": 2050.5,
  "intercept": 25000.2,
  "r2_score": 0.92,
  "mse": 12500000,
  "points": [
    [25, 52000],
    [30, 66500],
    [35, 81000],
    [40, 95500],
    [45, 110000],
    [50, 124500]
  ],
  "line_coords": [
    [25, 76264.8],
    [50, 127525.2]
  ]
}
```

---

## 🐍 Python Engine Details

**File**: `backend/engine/reg_runner.py`

**Input** (via stdin):
```json
{
  "x_values": [25, 30, 35, 40, 45, 50],
  "y_values": [50000, 65000, 75000, 85000, 95000, 105000]
}
```

**Output** (to stdout):
```json
{
  "slope": 2050.5,
  "intercept": 25000.2,
  "r2_score": 0.92,
  "mse": 12500000,
  "points": [[25, 50000], [30, 65000], ...],
  "line_coords": [[25, 76264.8], [50, 127525.2]]
}
```

**Key Functions:**
- `run_regression(x_values, y_values)`: Fits model, calculates metrics
- `main()`: Reads stdin JSON, calls `run_regression()`, outputs to stdout

---

## ⚙️ Configuration

### Backend (.env)
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Python not found
**Error**: `Failed to spawn Python process`
- Make sure Python is installed: `python --version`
- Add Python to PATH (Windows users)
- Try `python3` instead of `python` in `backend/routes/analysis.js` line 115

### Module not found errors
**For Python**:
```bash
pip install scikit-learn pandas numpy
```

**For Node.js**:
```bash
cd backend && npm install
cd frontend && npm install
```

### CORS errors
- Backend CORS is set to `http://localhost:3000`
- Make sure frontend runs on port 3000
- Check `backend/server.js` line 19

### Chart not rendering
- Make sure API response contains `points` and `line_coords` arrays
- Check browser console for errors
- Verify Chart.js is loaded: check Network tab

---

## 📈 Metrics Explained

### Slope (m)
The rate of change in Y per unit change in X. Positive = upward trend.

### Intercept (c)
The Y-value when X = 0. Where the line crosses the Y-axis.

### R² Score
Coefficient of determination (0-1). Higher = better fit.
- 1.0 = perfect fit
- 0.9+ = excellent
- 0.7-0.9 = good
- 0.5-0.7 = moderate

### Mean Squared Error (MSE)
Average of squared differences between predicted and actual values. Lower = better.

---

## 🚀 Production Deployment Checklist

- [ ] Replace in-memory storage with MongoDB/PostgreSQL
- [ ] Add authentication (JWT tokens)
- [ ] Implement file upload size limits
- [ ] Add input validation/sanitization
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure production environment variables
- [ ] Enable request rate limiting
- [ ] Add security headers (helmet.js)
- [ ] Implement dataset caching
- [ ] Set up CI/CD pipeline (GitHub Actions)

---

## 📝 Notes

✅ **Phase_1_Regression.py** remains completely untouched  
✅ All CSV data stored in-memory (no database required for Phase 1)  
✅ Subprocess calls are synchronous and block until Python completes  
✅ No external API calls or third-party services required  
✅ Modular design ready for future phase expansions  

---

## 🎓 Next Steps

### Phase 2 Ideas
- Multiple regression (3+ independent variables)
- Polynomial regression curve fitting
- Data preprocessing options (outlier removal, normalization)

### Phase 3 Ideas
- Export regression plots as PNG/PDF
- Statistical significance tests
- Confidence intervals on regression line

---

**Created**: 2025 | Phase 1 Prototype  
**Status**: ✅ Ready to Deploy

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)
