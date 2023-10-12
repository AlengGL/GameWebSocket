var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");

var usersRouter = require('./routes/users');
var SomeModel = require('./models/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message }); // 输出错误信息为 JSON
});



mongoose.connect("mongodb://admin:nimda@127.0.0.1/my_database?authSource=admin");
var mongoDB = mongoose.connection;

mongoDB.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoDB.once('open', () => {
  console.log('MongoDB connection successful');
});

// SomeModel.insertMany(testData)
//   .then(docs => {
//     console.log('Test data inserted successfully:', docs);
//   })
//   .catch(err => {
//     console.error('Error inserting test data:', err);
//   });

module.exports = app;
