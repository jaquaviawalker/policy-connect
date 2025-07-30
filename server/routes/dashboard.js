const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Access dashboard (TC07) - no authentication
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      message: "Dashboard access granted"
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
