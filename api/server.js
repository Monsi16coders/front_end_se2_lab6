// Minimal Express API for SE2 Lab 7 debugging exercises
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Use environment variables for DB config. See .env.example
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'se2_lab6';

let pool;
async function initDb() {
  try {
    console.log('Initializing DB pool with', { host: DB_HOST, user: DB_USER, database: DB_NAME });
    pool = mysql.createPool({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME, connectionLimit: 5 });
    // quick test query
    const [rows] = await pool.query('SELECT 1 + 1 AS test');
    console.log('DB connection test result:', rows[0]);
  } catch (err) {
    console.error('Database connection error:', err.message || err);
    // do not exit - allow the lab to demonstrate connection failures
  }
}

app.get('/health', (req, res) => {
  console.log('GET /health');
  res.json({ status: 'OK', message: 'API running' });
});

app.get('/moods', async (req, res) => {
  console.log('GET /moods request received');
  try {
    const [rows] = await pool.query('SELECT id, mood_level, journal_entry, created_at FROM mood_log ORDER BY created_at DESC LIMIT 100');
    console.log('GET /moods: fetched', rows.length, 'rows');
    res.json(rows);
  } catch (err) {
    console.error('GET /moods error:', err.message || err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

app.post('/moods', async (req, res) => {
  console.log('POST /moods request received');
  console.log('Request body:', req.body);
  const { mood_level, journal_entry } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO mood_log (mood_level, journal_entry) VALUES (?, ?)', [mood_level, journal_entry]);
    console.log('Database insert result:', result);

    // Dummy AI response to mimic frontend expectations
    const ai_response = journal_entry ? `Thanks for sharing — I hear you: "${String(journal_entry).slice(0, 80)}"` : 'Thanks for the update.';
    res.json({ message: 'Mood saved successfully', id: result.insertId, ai_response });
  } catch (err) {
    console.error('POST /moods error:', err.message || err);
    res.status(500).json({ error: 'Insert failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`API server listening on port ${PORT}`);
  await initDb();
});
