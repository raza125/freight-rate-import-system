const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use('/api/freight', require('./routes/freight'));

module.exports = app;
