const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const connectWithRetry = require('../database/db');

(async () => {
  const pool = await connectWithRetry();
  const schemaPath = path.join(__dirname, '../database/schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

  try {
    await pool.query(schemaSQL);
    console.log(schemaSQL)
    logger.info('Database schema applied successfully.');
    process.exit(0);
  } catch (err) {
    logger.error('Failed to apply schema:', err.message);
    process.exit(1);
  }
})();
