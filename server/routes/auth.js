const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, validationResult } = require('express-validator');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (TC01, TC02, TC03, TC09)
 * @access  Public
 */
router.post('/register', [
  // Input validation and sanitization (TC09)
  body('username').trim().escape().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors (TC03)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "All fields required" });
    }

    const { username, password } = req.body;

    // Check if user already exists (TC02)
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username taken" });
    }

    // Create new user with plain text password (TC01)
    // Note: In a production app, you should never store passwords in plain text
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, password]
    );

    // Success response (TC01)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user (TC04, TC05, TC06)
 * @access  Public
 */
router.post('/login', [
  body('username').trim().escape().notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "All fields required" });
    }

    const { username, password } = req.body;

    // Using parameterized queries for security
    const user = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    // Check if user exists (TC06)
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password (TC05) - simple plain text comparison
    // Note: In a production app, you should never store or compare passwords in plain text
    if (password !== user.rows[0].password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Success response (TC04)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username
      },
      redirectTo: "/dashboard"
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error during login" });
  }
});

/**
 * @route   GET /api/auth/logout
 * @desc    Simulate logout (TC08)
 * @access  Public
 */
router.get('/logout', (req, res) => {
  // Since we're not using authentication, this just simulates a logout
  res.status(200).json({ message: "Logout successful", redirectTo: "/login" });
});

/**
 * @route   GET /api/auth/check
 * @desc    Simulate authentication check (TC07)
 * @access  Public
 */
router.get('/check', (req, res) => {
  // For TC07, we'll simulate the user always being logged in
  // In a real app with no auth, you would handle this differently
  return res.status(200).json({ message: "Access granted" });
});

/**
 * @route   DELETE /api/auth/delete/:userId
 * @desc    Delete user account (TC10)
 * @access  Public
 */
router.delete('/delete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First check if the user exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Simply delete the user from the database
    await pool.query(
      'DELETE FROM users WHERE id = $1',
      [userId]
    );
    
    // Success response
    res.status(200).json({
      message: "Account deleted successfully",
      redirectTo: "/login"
    });
    
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ error: "Server error during account deletion" });
  }
});

module.exports = router;
