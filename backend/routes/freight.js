const express = require('express');
const router = express.Router();
const { importFreightData } = require('../controllers/freightController');
const logger = require('../utils/logger');
// const pool = require('../database/db');

router.post('/import', (req, res, next) => importFreightData(req,res,req.app.locals.db,next));

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await req.app.locals.db.query('SELECT * FROM freight_rates');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
});

router.get('/search', async (req, res, next) => {
    const { type } = req.query;
    const column = type === '20GP' ? 'container_20gp' : 'container_40gp';;
    try {
        const { rows } = await req.app.locals.db.query(`
            SELECT DISTINCT ON (version_number)
            shipment_id, origin_country, destination_country, 
            ${column} AS rate, version_number FROM freight_rates
            where  ${column} IS NOT NULL ORDER BY version_number, ${column} ASC
            `);
            res.status(200).json({ success: true, data: rows });
    } catch(err) {
        logger.error("Error fetching data", err);
        next(err);
    }
})

module.exports = router;




//   id SERIAL PRIMARY KEY,
//   shipment_id TEXT UNIQUE,
//   origin_country TEXT,
//   destination_country TEXT,
//   shipper_name TEXT,
//   agent_name TEXT,
//   proof_of_delivery TEXT,
//   container_20gp NUMERIC,
//   container_40gp NUMERIC,
//   shipment_datetime TIMESTAMP,
//   version_number INTEGER NOT NULL