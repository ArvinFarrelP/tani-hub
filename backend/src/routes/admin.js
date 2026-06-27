const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, verifySupplier, toggleUserStatus, getAllTransactions } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/transactions', getAllTransactions);
router.put('/users/:id/verify', verifySupplier);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
