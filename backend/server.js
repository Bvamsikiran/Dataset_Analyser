/**
 * =====================================================
 * BACKEND SERVER: Phase 1 Dataset Analyser Pipeline
 * =====================================================
 * 
 * Main Express server handling:
 * - CSV file uploads
 * - Column detection & metadata
 * - Regression analysis via Python subprocess
 * - In-memory file metadata storage
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import analysisRoutes from './routes/analysis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================
app.use('/api', analysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`🚀 Dataset Analyser Backend running on http://localhost:${PORT}`);
  console.log(`📊 Upload CSV at: POST http://localhost:${PORT}/api/upload`);
  console.log(`📈 Analyze regression at: POST http://localhost:${PORT}/api/regression`);
});
