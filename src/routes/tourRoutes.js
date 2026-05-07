const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTourBySlug,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getAllToursAdmin,
} = require('../controllers/tourController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllTours);
router.get('/admin/all', protect, getAllToursAdmin);
router.get('/id/:id', protect, getTourById);
router.get('/:slug', getTourBySlug);

// Protected routes
router.post('/', protect, createTour);
router.put('/:id', protect, updateTour);
router.delete('/:id', protect, deleteTour);

module.exports = router;
