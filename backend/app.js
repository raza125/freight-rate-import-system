const express = require('express');
const app = express();
const myParser = require("body-parser");
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config()
app.use(cors())
app.use(express.json());
app.use(errorHandler);
app.use(myParser.json({limit: '200mb'}));
app.use('/api/freight', require('./routes/freight'));

module.exports = app;
