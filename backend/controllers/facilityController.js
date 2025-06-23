const db = require('../db');

// GET /api/facilities
const getAllFacilities = (req, res) => {
  const sql = 'SELECT id, name FROM Facilities';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST /api/facilities
const addFacility = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Facility name is required' });
  }

  const sql = 'INSERT INTO Facilities (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Facility added successfully', facilityId: result.insertId });
  });
};


// PUT /api/facilities/:id
const updateFacility = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Facility name is required' });
  }

  const sql = 'UPDATE Facilities SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Facility updated successfully' });
  });
};

// DELETE /api/facilities/:id
const deleteFacility = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM Facilities WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Facility deleted successfully' });
  });
};

module.exports = {
  getAllFacilities,
  addFacility,
  updateFacility,
  deleteFacility
};
