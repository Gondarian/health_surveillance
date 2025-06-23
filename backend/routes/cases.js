const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

// ✅ GET /api/cases — All authenticated users
router.get('/', authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      c.id,
      c.patient_id,
      d.name AS disease_name,
      c.status,
      f.name AS facility_name,
      r.name AS region_name,
      u.username AS reported_by,
      c.report_date
    FROM Cases c
    JOIN Diseases d ON c.disease_id = d.id
    JOIN Facilities f ON c.facility_id = f.id
    JOIN Regions r ON c.region_id = r.id
    JOIN Users u ON c.reported_by = u.id
    ORDER BY c.report_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ POST /api/cases — Only health_worker or admin can submit
router.post('/', authenticateToken, authorizeRoles('health_worker', 'admin'), (req, res) => {
  const { patient_id, disease_id, status, reported_by, facility_id, region_id, report_date } = req.body;

  if (!patient_id || !disease_id || !status || !reported_by || !facility_id || !region_id || !report_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO Cases (patient_id, disease_id, status, reported_by, facility_id, region_id, report_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [patient_id, disease_id, status, reported_by, facility_id, region_id, report_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Case reported successfully', caseId: result.insertId });
  });
});

// ✅ Don't forget this outside all routes
module.exports = router;
