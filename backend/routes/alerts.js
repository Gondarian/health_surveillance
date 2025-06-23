const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const ALERT_THRESHOLD = 2; // Customize as needed

// GET /api/alerts
router.get('/', authenticateToken, (req, res) => {
  const sql = `
    SELECT region_id, COUNT(*) AS total_cases
    FROM Cases
    WHERE status = 'confirmed'
    GROUP BY region_id
    HAVING total_cases > ?
  `;

  db.query(sql, [ALERT_THRESHOLD], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
