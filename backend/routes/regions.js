const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');
const {
  getAllRegions,
  addRegion,
  updateRegion,
  deleteRegion
} = require('../controllers/regionController');

// Get all regions — any authenticated user
router.get('/', authenticateToken, getAllRegions);

// Add region — admin and health_worker
router.post('/', authenticateToken, authorizeRoles('admin', 'health_worker'), addRegion);

// Update region — admin and health_worker
router.put('/:id', authenticateToken, authorizeRoles('admin', 'health_worker'), updateRegion);

// Delete region — admin and health_worker
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'health_worker'), deleteRegion);

module.exports = router;
