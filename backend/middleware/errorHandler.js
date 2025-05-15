const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.name}: ${err.message}`);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.stack
    });
}

module.exports = errorHandler;