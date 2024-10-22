const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET all todos
router.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stock');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new todo
router.post('/todos', async (req, res) => {
  const { description } = req.body;

  try {
    const result = await pool.query('INSERT INTO todos (description) VALUES ($1) RETURNING *', [description]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
