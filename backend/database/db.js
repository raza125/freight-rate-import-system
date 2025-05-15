const { Pool } = require('pg');
const logger = require('../utils/logger');
// adding a retry mechanism for database connections
require('dotenv').config()
const MAX_RETRIES=5;
const RETRY_DELAY=2000;

const connectWithRetry = async () => {
  const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
  });
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await pool.query('SELECT 1');
      logger.info("Connection Successfull")
      return pool;
    } catch (err) {
      logger.error("Failed to establish a connection. Attempting reconnection:", err);
      await new Promise((res) => setTimeout(res, RETRY_DELAY));
    }
  }

  logger.error("Unable to connect after retry attempts!")
}

module.exports = connectWithRetry;
