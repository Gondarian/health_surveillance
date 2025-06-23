const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

// GET all
router.get('/', authenticateToken, (req, res) => {
  db.query('SELECT id, name FROM Diseases', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new
router.post('/', authenticateToken, authorizeRoles('admin', 'health_worker'), (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.query('INSERT INTO Diseases (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Disease added', id: result.insertId });
  });
});

// PUT update
router.put('/:id', authenticateToken, authorizeRoles('admin', 'health_worker'), (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  db.query('UPDATE Diseases SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Disease updated' });
  });
});

// DELETE
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'health_worker'), (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Diseases WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Disease deleted' });
  });
});

module.exports = router;
