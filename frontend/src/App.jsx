/**
 * =====================================================
 * FRONTEND APP: Phase 1 Dataset Analyser Dashboard
 * =====================================================
 * 
 * Interactive React dashboard with states:
 * 1. UPLOAD: Drag-and-drop CSV file upload
 * 2. PREVIEW: Display parsed dataset in scrollable table
 * 3. CONFIGURE: Select X and Y numeric columns
 * 4. VISUALIZE: Interactive scatter plot with regression line
 * 
 * Styling: Dark-themed, responsive, modern UI
 */

import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import './App.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ==================== STATE DEFINITIONS ====================
const STATES = {
  UPLOAD: 'upload',
  PREVIEW: 'preview',
  CONFIGURE: 'configure',
  VISUALIZE: 'visualize',
};

// ==================== MAIN APP COMPONENT ====================
function App() {
  const [state, setState] = useState(STATES.UPLOAD);
  const [filename, setFilename] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [numericColumns, setNumericColumns] = useState([]);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [regressionResult, setRegressionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // ==================== FILE UPLOAD HANDLER ====================
  const handleFileUpload = async (file) => {
    if (!file) return;

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { filename: fname, preview, numericColumns: numCols } = response.data;

      setFilename(fname);
      setDataset(preview);
      setNumericColumns(numCols);
      
      // Auto-select first two numeric columns if available
      if (numCols.length >= 2) {
        setXColumn(numCols[0]);
        setYColumn(numCols[1]);
        setState(STATES.PREVIEW);
      } else {
        setError('Dataset must have at least 2 numeric columns');
      }
    } catch (err) {
      setError(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== REGRESSION HANDLER ====================
  const handleRunRegression = async () => {
    if (!xColumn || !yColumn) {
      setError('Please select both X and Y columns');
      return;
    }

    if (xColumn === yColumn) {
      setError('X and Y columns must be different');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/regression', {
        filename,
        xColumn,
        yColumn,
      });

      const { points, line_coords, r2_score, mse, slope, intercept } = response.data;

      setRegressionResult({
        points,
        line_coords,
        r2_score,
        mse,
        slope,
        intercept,
      });

      setState(STATES.VISUALIZE);
    } catch (err) {
      setError(`Regression failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== DRAG-AND-DROP HANDLERS ====================
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // ==================== RENDER STATES ====================

  // STATE 1: UPLOAD
  const renderUpload = () => (
    <div className="container upload-container">
      <div className="header">
        <h1>📊 Dataset Analyser - Phase 1</h1>
        <p>Upload a CSV to begin</p>
      </div>

      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">📁</div>
        <h2>Drag & Drop your CSV here</h2>
        <p>or click to browse</p>
        <p className="file-types">.csv files only</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={(e) => handleFileUpload(e.target.files?.[0])}
        style={{ display: 'none' }}
      />

      {isLoading && <div className="loading">⏳ Processing file...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );

  // STATE 2: PREVIEW
  const renderPreview = () => (
    <div className="container preview-container">
      <div className="header">
        <h1>📋 Dataset Preview</h1>
        <p className="file-info">File: <strong>{filename}</strong> | Rows: <strong>{dataset?.length || 0}</strong></p>
      </div>

      <div className="dataset-table-wrapper">
        <table className="dataset-table">
          <thead>
            <tr>
              {numericColumns.map((col) => (
                <th key={col}>
                  {col}
                  <span className="column-badge">🔢</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset?.map((row, idx) => (
              <tr key={idx}>
                {numericColumns.map((col) => (
                  <td key={`${idx}-${col}`}>{row[col] || '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={() => setState(STATES.CONFIGURE)}>
          ➜ Continue to Configuration
        </button>
        <button className="btn btn-secondary" onClick={() => setState(STATES.UPLOAD)}>
          ↻ Upload Another File
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );

  // STATE 3: CONFIGURE
  const renderConfigure = () => (
    <div className="container configure-container">
      <div className="header">
        <h1>⚙️ Configure Regression</h1>
        <p>Select X and Y columns for linear regression analysis</p>
      </div>

      <div className="config-section">
        <div className="column-selector">
          <label htmlFor="x-select">
            📈 <strong>X Variable (Predictor)</strong>
          </label>
          <select
            id="x-select"
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
          >
            <option value="">Select X column...</option>
            {numericColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="column-selector">
          <label htmlFor="y-select">
            📊 <strong>Y Variable (Target)</strong>
          </label>
          <select
            id="y-select"
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
          >
            <option value="">Select Y column...</option>
            {numericColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="formula-display">
        <p>Formula: <code>y = mx + c</code></p>
        <p>where <code>m</code> is the slope and <code>c</code> is the intercept</p>
      </div>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleRunRegression}
          disabled={isLoading || !xColumn || !yColumn}
        >
          {isLoading ? '⏳ Analyzing...' : '🚀 Run Regression'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setState(STATES.PREVIEW)}
          disabled={isLoading}
        >
          ← Back to Preview
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );

  // STATE 4: VISUALIZE
  const renderVisualize = () => {
    if (!regressionResult) return null;

    const { points, line_coords, r2_score, mse, slope, intercept } = regressionResult;

    // Prepare scatter data
    const scatterData = {
      datasets: [
        {
          label: 'Actual Data',
          data: points.map((p) => ({ x: p[0], y: p[1] })),
          backgroundColor: 'rgba(100, 200, 255, 0.6)',
          borderColor: 'rgba(100, 200, 255, 0.9)',
          borderWidth: 1.5,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Regression Line',
          data: line_coords.map((p) => ({ x: p[0], y: p[1] })),
          borderColor: 'rgba(255, 100, 100, 0.9)',
          borderWidth: 3,
          borderDash: [],
          fill: false,
          pointRadius: 0,
          tension: 0,
          showLine: true,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#e0e0e0',
            font: { size: 12 },
          },
        },
        title: {
          display: true,
          text: `${xColumn} vs ${yColumn}`,
          color: '#e0e0e0',
          font: { size: 16 },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xColumn,
            color: '#b0b0b0',
          },
          ticks: { color: '#b0b0b0' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
        },
        y: {
          title: {
            display: true,
            text: yColumn,
            color: '#b0b0b0',
          },
          ticks: { color: '#b0b0b0' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
        },
      },
    };

    return (
      <div className="container visualize-container">
        <div className="header">
          <h1>📈 Regression Analysis Results</h1>
          <p>Linear regression visualization with computed metrics</p>
        </div>

        <div className="visualization-layout">
          <div className="chart-area">
            <Scatter data={scatterData} options={chartOptions} />
          </div>

          <div className="metrics-panel">
            <div className="metrics-header">📊 Metrics</div>

            <div className="metric-item">
              <span className="metric-label">Slope (m):</span>
              <span className="metric-value">{slope.toFixed(6)}</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Intercept (c):</span>
              <span className="metric-value">{intercept.toFixed(6)}</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">R² Score:</span>
              <span className="metric-value">{r2_score.toFixed(6)}</span>
              <span className="metric-explanation">(0-1, higher is better)</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Mean Squared Error:</span>
              <span className="metric-value">{mse.toFixed(6)}</span>
            </div>

            <div className="equation-box">
              <strong>Linear Equation:</strong>
              <code>y = {slope.toFixed(6)}x + {intercept.toFixed(6)}</code>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={() => {
              setState(STATES.CONFIGURE);
              setRegressionResult(null);
            }}
          >
            ⚙️ Adjust Configuration
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setState(STATES.UPLOAD);
              setDataset(null);
              setFilename(null);
              setRegressionResult(null);
            }}
          >
            📁 Upload New File
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <>
      {state === STATES.UPLOAD && renderUpload()}
      {state === STATES.PREVIEW && renderPreview()}
      {state === STATES.CONFIGURE && renderConfigure()}
      {state === STATES.VISUALIZE && renderVisualize()}
    </>
  );
}

export default App;
