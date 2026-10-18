
const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'jobportal',
  ssl: {
    ca: fs.readFileSync(
      process.env.DB_SSL_CA || '/app/global-bundle.pem',
      'utf8'
    ),
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      application: 'job-seeking-website-backend'
    });
  } catch (err) {
    console.error('Database health check failed:', err.message);
    res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, company, location FROM jobs ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch jobs:', err.message);
    res.status(500).json({
      error: 'Unable to fetch jobs'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
