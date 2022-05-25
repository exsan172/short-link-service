require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
const config = require("./config")

const serviceRouter = require('./routes/service');
const redirectRouter = require('./routes/redirect');

const app = express();

config.dbConnection()
const corsOptions = {
	origin: '*',
}
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/service', serviceRouter);
app.use('/redirect', redirectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	config.response(res, 400, "path not found!")
});

// error handler
app.use(function(err, req, res, next) {
	config.response(res, err.status || 500, err.message)
});

module.exports = app;
