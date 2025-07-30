const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; 
const pool = require('./db');
const routes = require('./routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'Database connection successful',
            timestamp: result.rows[0].now
        });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ 
            error: 'Database connection failed',
            details: err.message
        });
    }
});

// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello from Policy Connect API!');
});

// API Routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});