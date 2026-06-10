/**
 * =====================================================
 * ANALYSIS ROUTES: CSV Upload & Regression Processing
 * =====================================================
 * 
 * Endpoints:
 * - POST /upload: Handles CSV file upload, parses headers, detects numeric columns
 * - POST /regression: Calls Python engine to compute regression coefficients and metrics
 * 
 * In-Memory Storage: Maintains file metadata indexed by filename
 */

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== IN-MEMORY STORAGE ====================
/**
 * Global file storage:
 * {
 *   'filename.csv': {
 *     data: [[row1], [row2], ...],
 *     headers: ['col1', 'col2', ...],
 *     numericColumns: ['col1', 'col3', ...]
 *   }
 * }
 */
const fileStorage = {};

// ==================== MULTER CONFIGURATION ====================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ==================== HELPER FUNCTION ====================
/**
 * Detect numeric columns from a dataset
 * @param {Array} rows - Array of objects representing CSV rows
 * @returns {Array} - Array of column names that contain only numeric values
 */
function detectNumericColumns(rows) {
  if (rows.length === 0) return [];

  const headers = Object.keys(rows[0]);
  const numericColumns = [];

  for (const header of headers) {
    // Check if all non-null values in this column are numeric
    const allNumeric = rows.every((row) => {
      const value = row[header];
      return value === null || value === undefined || value === '' || !isNaN(parseFloat(value));
    });

    if (allNumeric) {
      numericColumns.push(header);
    }
  }

  return numericColumns;
}

// ==================== ROUTES ====================

/**
 * POST /upload
 * Receives a CSV file, parses it, detects numeric columns, and stores metadata in memory
 */
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const filename = req.file.originalname;
    const fileBuffer = req.file.buffer;

    // Parse CSV from buffer
    const rows = [];
    const readable = Readable.from([fileBuffer]);

    readable
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        // Detect numeric columns
        const numericColumns = detectNumericColumns(rows);

        // Store in memory
        fileStorage[filename] = {
          data: rows,
          headers: Object.keys(rows[0] || {}),
          numericColumns,
        };

        console.log(`✅ File uploaded: ${filename}`);
        console.log(`   Rows: ${rows.length}, Numeric columns: ${numericColumns.join(', ')}`);

        res.json({
          success: true,
          filename,
          totalRows: rows.length,
          headers: Object.keys(rows[0] || {}),
          numericColumns,
          preview: rows.slice(0, 5), // Return first 5 rows for preview
        });
      })
      .on('error', (error) => {
        res.status(400).json({ error: `CSV parsing error: ${error.message}` });
      });
  } catch (error) {
    res.status(500).json({ error: `Upload failed: ${error.message}` });
  }
});

/**
 * POST /regression
 * Accepts filename, X column, and Y column
 * Calls Python subprocess to compute regression coefficients, R², MSE, and scatter points
 * 
 * Request body:
 * {
 *   filename: 'data.csv',
 *   xColumn: 'age',
 *   yColumn: 'salary'
 * }
 */
router.post('/regression', (req, res) => {
  try {
    const { filename, xColumn, yColumn } = req.body;

    // Validate inputs
    if (!filename || !xColumn || !yColumn) {
      return res.status(400).json({ error: 'Missing filename, xColumn, or yColumn' });
    }

    if (!fileStorage[filename]) {
      return res.status(404).json({ error: `File not found in storage: ${filename}` });
    }

    const fileData = fileStorage[filename];

    // Verify columns exist and are numeric
    if (!fileData.numericColumns.includes(xColumn) || !fileData.numericColumns.includes(yColumn)) {
      return res.status(400).json({ error: `Invalid columns. Must be numeric: ${fileData.numericColumns.join(', ')}` });
    }

    // Extract X and Y values from data
    const xValues = fileData.data.map((row) => parseFloat(row[xColumn])).filter(v => !isNaN(v));
    const yValues = fileData.data.map((row) => parseFloat(row[yColumn])).filter(v => !isNaN(v));

    if (xValues.length < 2 || yValues.length < 2) {
      return res.status(400).json({ error: 'Insufficient numeric data for regression' });
    }

    // Prepare input for Python subprocess
    const pythonInput = JSON.stringify({
      x_values: xValues,
      y_values: yValues,
    });

    // ==================== SPAWN PYTHON SUBPROCESS ====================
    const pythonScript = path.join(__dirname, '../engine/reg_runner.py');
    const pythonProcess = spawn('python', [pythonScript]);

    let pythonOutput = '';
    let pythonError = '';

    // Send data to Python script
    pythonProcess.stdin.write(pythonInput);
    pythonProcess.stdin.end();

    // Collect output
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    // Handle completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python error:', pythonError);
        return res.status(500).json({ error: `Python computation failed: ${pythonError}` });
      }

      try {
        // Parse Python JSON output
        const result = JSON.parse(pythonOutput);
        
        console.log(`✅ Regression computed: ${filename} (${xColumn} vs ${yColumn})`);
        
        res.json({
          success: true,
          xColumn,
          yColumn,
          ...result, // Contains: points, line_coords, r2_score, mse, slope, intercept
        });
      } catch (parseError) {
        console.error('JSON parse error:', pythonOutput);
        res.status(500).json({ error: `Failed to parse Python output: ${parseError.message}` });
      }
    });

    // Handle process errors
    pythonProcess.on('error', (error) => {
      console.error('Python process error:', error);
      res.status(500).json({ error: `Failed to spawn Python process: ${error.message}` });
    });
  } catch (error) {
    res.status(500).json({ error: `Regression failed: ${error.message}` });
  }
});

export default router;
