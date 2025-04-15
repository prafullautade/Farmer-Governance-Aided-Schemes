// routes/cropRoutes.js
const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

// Get all crops
router.get('/', cropController.getCrops);

// Create a new crop
router.post('/', cropController.createCrop);

// Update a crop by ID
router.put('/:id', cropController.updateCrop);

// Delete a crop by ID
router.delete('/:id', cropController.deleteCrop);

module.exports = router;
