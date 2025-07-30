const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');

// Map routes to their respective handlers
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
