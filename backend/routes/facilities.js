const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');
const {
  getAllFacilities,
  addFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facilityController');

// Get all facilities — any authenticated user
router.get('/', authenticateToken, getAllFacilities);

// Add facility — admin & health_worker
router.post('/', authenticateToken, authorizeRoles('admin', 'health_worker'), addFacility);

// Update facility — admin & health_worker
router.put('/:id', authenticateToken, authorizeRoles('admin', 'health_worker'), updateFacility);

// Delete facility — admin & health_worker
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'health_worker'), deleteFacility);

module.exports = router;
