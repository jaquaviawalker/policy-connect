const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'policyconnect',
  port: 5432
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1); // Exit process if a serious error occurs
});

module.exports = pool;