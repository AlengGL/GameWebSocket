var createError = require('http-errors');
var express = require('express');
const cors = require('cors');  // 引入 cors 模組
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");

var usersRouter = require('./routes/users');

var app = express();
/* 在所有路由前使用 cors 中間件 */
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

mongoose.connect("mongodb://admin:nimda@127.0.0.1/my_database?authSource=admin");
var mongoDB = mongoose.connection;

mongoDB.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoDB.once('open', () => {
  console.log('MongoDB connection successful');
});


module.exports = app;
