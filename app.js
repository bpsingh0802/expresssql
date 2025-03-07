const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// MySQL connection pool for serverless compatibility
const pool = mysql.createPool({
  host: 'database-1.c12wio0iwfy7.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Bharat0802',
  database: 'mydb',
  port: 3306,
  connectionLimit: 10, // Max connections in pool
  waitForConnections: true, // Queue requests if pool is busy
  queueLimit: 0 // Unlimited queue
});

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM students');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  try {
    const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email, created_at: new Date() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  try {
    const [result] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel
module.exports = app;
