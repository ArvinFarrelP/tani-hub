const express = require('express');
const router  = express.Router();
const { updateProfile, changePassword, getFarmers, getFarmerById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/farmers',          getFarmers);
router.get('/farmers/:id',      getFarmerById);
router.put('/profile',          protect, updateProfile);
router.put('/change-password',  protect, changePassword);

module.exports = router;
