const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// 1. Confirmed cases by region per month
router.get('/confirmed-by-region-month', authenticateToken, (req, res) => {
  const sql = `
    SELECT r.name AS region_name,
           DATE_FORMAT(c.report_date, '%Y-%m') AS month,
           COUNT(*) AS confirmed_cases
    FROM Cases c
    JOIN Regions r ON c.region_id = r.id
    WHERE c.status = 'confirmed'
    GROUP BY r.name, month
    ORDER BY month, r.name;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Fastest growing disease over the past week
router.get('/fastest-growth', authenticateToken, (req, res) => {
  const sql = `
    SELECT d.name AS disease_name,
           ROUND(COUNT(*) / 7, 2) AS daily_growth
    FROM Cases c
    JOIN Diseases d ON c.disease_id = d.id
    WHERE c.report_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY d.name
    ORDER BY daily_growth DESC
    LIMIT 1;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

// 3. Facilities with the highest number of reported cases
router.get('/top-facilities', authenticateToken, (req, res) => {
  const sql = `
    SELECT f.name AS facility_name,
           COUNT(*) AS reported_cases
    FROM Cases c
    JOIN Facilities f ON c.facility_id = f.id
    GROUP BY f.name
    ORDER BY reported_cases DESC
    LIMIT 5;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. Recovery rate by disease
router.get('/recovery-rate', authenticateToken, (req, res) => {
  const sql = `
    SELECT d.name AS disease_name,
           ROUND(SUM(CASE WHEN c.status = 'recovered' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS recovery_rate
    FROM Cases c
    JOIN Diseases d ON c.disease_id = d.id
    GROUP BY d.name;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
