const express = require('express');
const router  = express.Router();
const { createRating, getFarmerRatings } = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/farmer/:farmerId',  getFarmerRatings);
router.post('/',                 protect, authorize('buyer'), createRating);

module.exports = router;
