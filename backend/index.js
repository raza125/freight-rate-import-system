const app = require('./app');
const connectWithRetry = require('./database/db');
const logger = require('./utils/logger');
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    const pool = await connectWithRetry();
    app.locals.db = pool;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    });
  } catch(err) {
    logger.error("Could not connect to DB", err);
    process.exit(1);
  }
})();


