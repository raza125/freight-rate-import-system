const fs = require('fs');
const path = require('path');
const pool = require(path.join(__dirname, '../database/db'));

(async () => {
  const schemaPath = path.join(__dirname, '../database/schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

  try {
    await pool.query(schemaSQL);
    console.log('Database schema applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to apply schema:', err.message);
    process.exit(1);
  }
})();
