# 📖 Dataset Analyser - Quick Reference Guide

## ⚡ Quick Start (30 seconds)

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install

# Python packages
pip install scikit-learn pandas numpy
```

### 2. Start Services
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Open Dashboard
Visit: `http://localhost:3000`

---

## 🎮 Using the Dashboard

### Step 1: Upload
- Drag & drop a CSV file or click to browse
- CSV must have at least 2 numeric columns

### Step 2: Preview
- Review the dataset in the table
- Click "Continue to Configuration"

### Step 3: Configure
- Select **X Variable** (predictor) from dropdown
- Select **Y Variable** (target) from dropdown
- Click "Run Regression"

### Step 4: Visualize
- View interactive scatter plot with regression line
- Check metrics panel for statistics
- See linear equation at bottom

### Actions
- **Adjust Configuration**: Go back to step 3
- **Upload New File**: Start over with different dataset

---

## 📊 Understanding the Metrics

| Metric | Range | Interpretation |
|--------|-------|-----------------|
| **Slope (m)** | Any number | Change in Y per unit of X |
| **Intercept (c)** | Any number | Y-value when X = 0 |
| **R² Score** | 0 to 1 | How well line fits data (higher = better) |
| **MSE** | 0 to ∞ | Average squared error (lower = better) |

**Quick Interpretation:**
- R² = 0.95+ : **Excellent fit** 🟢
- R² = 0.80-0.95 : **Good fit** 🟡
- R² = 0.50-0.80 : **Moderate fit** 🟠
- R² < 0.50 : **Poor fit** 🔴

---

## 🗂️ Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server setup |
| `backend/routes/analysis.js` | Upload & regression endpoints |
| `backend/engine/reg_runner.py` | Python regression calculator |
| `frontend/src/App.jsx` | Main React component |
| `frontend/src/App.css` | UI styling |

---

## 🔌 API Endpoints

### Upload CSV
```bash
curl -F "file=@data.csv" \
  http://localhost:5000/api/upload
```

### Run Regression
```bash
curl -X POST http://localhost:5000/api/regression \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "data.csv",
    "xColumn": "age",
    "yColumn": "salary"
  }'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 🧪 Test with Sample Data

A sample dataset is included: `sample_data.csv`

**Contains:**
- age (25-50)
- salary (45,000-325,000)
- years_experience (1-24)
- performance_score (72-100)
- department_rating (3.2-5.0)

**Try These Regression Tests:**
1. Age vs Salary (strong correlation)
2. Years Experience vs Salary (strong correlation)
3. Performance Score vs Salary (moderate correlation)

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Python Not Found
```bash
# Use full path in analysis.js:
# Change: spawn('python', ...)
# To: spawn('python3', ...)
# Or: spawn('C:\\Python39\\python.exe', ...)
```

### npm Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Make sure backend runs on `:5000`
- Make sure frontend runs on `:3000`
- Check `backend/server.js` line 19

---

## 📋 Project Dependencies

### Backend
- `express` - Web framework
- `cors` - Cross-origin requests
- `multer` - File upload handling
- `csv-parser` - CSV parsing

### Frontend
- `react` - UI framework
- `axios` - HTTP client
- `chart.js` - Charting library
- `react-chartjs-2` - Chart wrapper

### Python
- `scikit-learn` - Machine learning
- `pandas` - Data manipulation
- `numpy` - Numerical computing

---

## 🌐 Directory Layout

```
Dataset_Analyser/
├── backend/
│   ├── server.js           Main server
│   ├── routes/
│   │   └── analysis.js     CSV & regression
│   ├── engine/
│   │   └── reg_runner.py   Regression engine
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         Dashboard UI
│   │   └── App.css         Styles
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── sample_data.csv         Test dataset
├── SETUP_GUIDE.md          Detailed setup
└── ARCHITECTURE.md         System design
```

---

## 💡 Tips & Tricks

### For Better Results
- **Upload 30+ data points** for more accurate regression
- **Avoid columns with extreme outliers** (can skew R²)
- **Use continuous numeric data** (integers or decimals)
- **Check if variables have logical relationship** (age vs salary makes sense; salary vs random doesn't)

### Performance
- Files under 10MB load instantly
- Python subprocess takes 1-2 seconds
- Chart renders in real-time

### Styling
- Toggle dark theme by modifying `frontend/src/App.css`
- Change gradient colors in `:root` section
- Adjust chart colors in `App.jsx` line 190+

---

## 📚 Learning Resources

### Linear Regression Basics
- Y = mX + c (equation of a line)
- m (slope) = rise/run
- c (intercept) = Y when X = 0
- R² = how well line fits data

### Python Regression
```python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y = np.array([2, 4, 5, 4, 6])

model = LinearRegression()
model.fit(X, y)
predictions = model.predict(X)
```

### React Hooks (Frontend)
```jsx
const [state, setState] = useState(initialValue);
const [data, setData] = useState([]);
```

---

## 🚀 Next Steps

### Phase 2
- Multiple regression (3+ variables)
- Polynomial regression
- Feature selection UI

### Phase 3
- Export plots as PNG/PDF
- Statistical significance tests
- Confidence intervals

---

## ❓ FAQ

**Q: Why does it need Python?**  
A: scikit-learn is the best ML library; Node.js has poor ML support.

**Q: Can I use this without Node.js?**  
A: Not easily. Consider using Streamlit (`Phase_1_Regression.py`) as alternative.

**Q: Is my data stored?**  
A: No, data is in-memory only. Resets when server restarts.

**Q: Can I deploy this?**  
A: Yes! Replace in-memory storage with MongoDB for persistence.

**Q: How do I debug the Python script?**  
A: Check `backend.log` for error output or add print statements.

---

## 📞 Support

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check `ARCHITECTURE.md` for system design
3. Review error messages in browser console
4. Check terminal logs for backend errors

---

**Version**: 1.0.0 | **Status**: ✅ Production Ready
