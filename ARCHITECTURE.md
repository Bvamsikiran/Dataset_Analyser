# Dataset Analyser Pipeline - Phase 1 Architecture

## 📋 Overview
A modular web application for uploading CSV datasets, selecting numerical columns, and visualizing linear regression analysis with interactive charts.

---

## 📁 Project Structure

```
Dataset_Analyser/
├── Phase_1_Regression.py           # (READ-ONLY) Reference Streamlit app
├── README.md
├── ARCHITECTURE.md                 # This file
├── .gitignore
│
├── backend/                         # Node.js Express API
│   ├── package.json
│   ├── .env
│   ├── server.js                   # Express server & middleware setup
│   ├── routes/
│   │   └── analysis.js             # CSV upload & regression endpoints
│   └── engine/
│       └── reg_runner.py           # Python micro-script for regression
│
└── frontend/                        # React.js Dashboard
    ├── package.json
    ├── vite.config.js
    ├── .env
    ├── public/
    │   └── index.html
    └── src/
        ├── index.jsx               # React entry point
        ├── index.css
        ├── App.jsx                 # Main dashboard component
        └── App.css                 # Dark-themed responsive styles
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. UPLOAD STATE: Drag-and-drop CSV file input           │   │
│  │     └─> FormData → POST /api/upload                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  2. PREVIEW STATE: Display dataset table                 │   │
│  │     ← Response: headers, numericColumns, preview rows    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  3. CONFIGURE STATE: Select X & Y columns               │   │
│  │     └─> POST /api/regression {filename, xCol, yCol}     │   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  In-Memory Storage                                       │   │
│  │  { 'filename.csv': {data, headers, numericColumns} }    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Extract X and Y values → spawn Python subprocess       │   │
│  │  Input: {x_values: [...], y_values: [...]}              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                 PYTHON ENGINE (scikit-learn)                    │
│                    (backend/engine/reg_runner.py)               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. Parse JSON input from Node.js stdin                 │   │
│  │  2. Fit LinearRegression model                          │   │
│  │  3. Calculate metrics: slope, intercept, R², MSE        │   │
│  │  4. Output clean JSON to stdout                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Parse Python output JSON                               │   │
│  │  Response to frontend:                                  │   │
│  │  {                                                       │   │
│  │    "slope": 0.5,                                         │   │
│  │    "intercept": 1.5,                                     │   │
│  │    "r2_score": 0.95,                                     │   │
│  │    "mse": 0.25,                                          │   │
│  │    "points": [[1,2], [2,4], ...],                       │   │
│  │    "line_coords": [[1,2.0], [5,4.0]]                    │   │
│  │  }                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  4. VISUALIZE STATE: Interactive scatter + regression   │   │
│  │     - Plot data points (blue dots)                      │   │
│  │     - Overlay regression line (red line)                │   │
│  │     - Display metrics panel                             │   │
│  │     - Show equation: y = mx + c                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technical Stack

### Backend
- **Framework**: Express.js (Node.js)
- **File Handling**: Multer (in-memory storage)
- **CSV Parsing**: csv-parser
- **Process Management**: Node.js `child_process.spawn()`
- **CORS**: Express CORS middleware

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Charting**: Chart.js + react-chartjs-2
- **HTTP Client**: Axios
- **Styling**: Custom CSS (dark theme, responsive)

### Data Engine
- **Language**: Python 3
- **ML Library**: scikit-learn (LinearRegression)
- **Data Processing**: Pandas
- **Communication**: JSON via stdin/stdout

---

## 📡 API Endpoints

### POST /api/upload
**Purpose**: Receive CSV file, parse headers, detect numeric columns  
**Request**: Multipart form-data with `file` field  
**Response**:
```json
{
  "success": true,
  "filename": "data.csv",
  "totalRows": 100,
  "headers": ["age", "salary", "name"],
  "numericColumns": ["age", "salary"],
  "preview": [
    {"age": "25", "salary": "50000", "name": "John"},
    ...
  ]
}
```

### POST /api/regression
**Purpose**: Compute linear regression for selected columns  
**Request**:
```json
{
  "filename": "data.csv",
  "xColumn": "age",
  "yColumn": "salary"
}
```
**Response**:
```json
{
  "success": true,
  "xColumn": "age",
  "yColumn": "salary",
  "slope": 2500.5,
  "intercept": 10000.2,
  "r2_score": 0.87,
  "mse": 15000000,
  "points": [[25, 52000], [30, 65000], ...],
  "line_coords": [[25, 52000.5], [60, 160000.2]]
}
```

---

## 🎨 UI Workflow States

1. **UPLOAD**: Drag-and-drop zone for CSV files
2. **PREVIEW**: Scrollable table showing first 5 rows and all columns
3. **CONFIGURE**: Dual dropdowns for selecting X and Y numeric columns
4. **VISUALIZE**: Interactive scatter plot with:
   - Blue data points
   - Red regression line
   - Metrics panel (slope, intercept, R², MSE)
   - Linear equation display

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+ with scikit-learn and pandas

### Backend Setup
```bash
cd backend
npm install
node server.js
```
Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:3000`

### Python Dependencies
```bash
pip install scikit-learn pandas numpy
```

---

## ✨ Key Features

✅ **Modular Architecture**: Separate frontend/backend/engine for scalability  
✅ **In-Memory Storage**: No database setup required for Phase 1  
✅ **Automatic Column Detection**: Identifies numeric columns automatically  
✅ **Real-Time Visualization**: Interactive Chart.js rendering  
✅ **Dark Theme**: Modern, easy-on-the-eyes UI  
✅ **Responsive Design**: Works on desktop, tablet, mobile  
✅ **Subprocess Communication**: Clean JSON piping between Node.js and Python  

---

## 🔮 Future Phases

- **Phase 2**: Multiple regression (3+ variables)
- **Phase 3**: Polynomial regression options
- **Phase 4**: Database persistence (MongoDB/PostgreSQL)
- **Phase 5**: Advanced statistical tests and visualizations
- **Phase 6**: Export reports (PDF, PNG charts)

---

## 📝 Notes

- **Phase_1_Regression.py** remains unmodified and serves as a mathematical reference
- All CSV file data is stored in-memory; data resets on server restart
- Python subprocess calls are synchronous (blocks until computation completes)
- Production deployment would replace in-memory storage with persistent database

---

Created: 2025 | Phase 1 Prototype
