const express = require('express');
const router = express.Router();
const { importFreightData } = require('../controllers/freightController');
const pool = require('../database/db');

router.post('/import', importFreightData);

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM freight_rates ORDER BY created_at DESC;');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching freight data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
