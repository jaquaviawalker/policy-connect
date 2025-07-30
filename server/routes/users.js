const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin (in a real app would be restricted)
 */
router.get('/', async (req, res) => {
  try {
    // Query to get all users from the database
    const users = await pool.query(
      'SELECT id, username FROM users ORDER BY id ASC'
    );

    // Return the users directly
    res.status(200).json(users.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Admin (in a real app would be restricted)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: "Server error while fetching user" });
  }
});

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Admin (in a real app would be restricted)
 */
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    // Create new user
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, password]
    );
    
    res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: "Server error while creating user" });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Admin (in a real app would be restricted)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if new username is already taken by another user
    if (username !== userCheck.rows[0].username) {
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND id != $2',
        [username, id]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }
    
    // Update user
    let updatedUser;
    
    if (password) {
      // If password is provided, update both username and password
      updatedUser = await pool.query(
        'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING id, username',
        [username, password, id]
      );
    } else {
      // If no password provided, only update username
      updatedUser = await pool.query(
        'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username',
        [username, id]
      );
    }
    
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser.rows[0]
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: "Server error while updating user" });
  }
});

module.exports = router;
