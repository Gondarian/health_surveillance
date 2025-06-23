const db = require('../db');

// GET /api/regions
const getAllRegions = (req, res) => {
  const sql = 'SELECT * FROM Regions';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST /api/regions
const addRegion = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Region name is required' });

  const sql = 'INSERT INTO Regions (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Region added successfully', regionId: result.insertId });
  });
};

// PUT /api/regions/:id
const updateRegion = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Region name is required' });

  const sql = 'UPDATE Regions SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Region updated successfully' });
  });
};

// DELETE /api/regions/:id
const deleteRegion = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM Regions WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Region deleted successfully' });
  });
};

module.exports = {
  getAllRegions,
  addRegion,
  updateRegion,
  deleteRegion
};
