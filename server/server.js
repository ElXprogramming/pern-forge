const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Async handler helper to avoid repetitive try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. Health & Status Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', stack: 'PERN', timestamp: new Date().toISOString() });
});

// 2. GET all projects
app.get('/api/projects', asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    'SELECT id, title, description, stack_tags, metadata, is_published, created_at FROM projects ORDER BY id DESC'
  );
  res.json({ success: true, count: rows.length, data: rows });
}));

// 3. GET project by ID (Parameterized Query to prevent SQL Injection)
app.get('/api/projects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);

  if (rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  res.json({ success: true, data: rows[0] });
}));

// 4. POST create a new project
app.post('/api/projects', asyncHandler(async (req, res) => {
  const { title, description, stack_tags, metadata } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  const queryText = `
    INSERT INTO projects (title, description, stack_tags, metadata)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [
    title.trim(),
    description || '',
    stack_tags || ['PostgreSQL', 'Express', 'React', 'Node.js'],
    metadata || {}
  ];

  const { rows } = await db.query(queryText, values);
  res.status(201).json({ success: true, message: 'Project created successfully', data: rows[0] });
}));

// 5. DELETE project by ID
app.delete('/api/projects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await db.query('DELETE FROM projects WHERE id = $1', [id]);

  if (rowCount === 0) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  res.json({ success: true, message: 'Project deleted successfully' });
}));

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 PERN Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
