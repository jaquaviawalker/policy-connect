const fs = require('fs');
const path = require('path');
const pool = require('../db');

const schemaSQL = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql')).toString();

async function initDB() {
  try {
    // Execute schema creation
    await pool.query(schemaSQL);
    console.log('Database initialized successfully');
    
    // Close the pool
    await pool.end();
    
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Run initialization
initDB();
