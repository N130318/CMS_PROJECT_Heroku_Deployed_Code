var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
var bodyparser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRouter = require('./routes/student');
var postRouter = require('./routes/post');
var mailRouter = require('./routes/mail');

var dbconfig = require('./db/dbconnection');

//express middleware
var app = express();

//database connection
var db = mongoose.connection;
mongoose.connect(dbconfig.url);

db.on("error",function(){
  console.log("DB connection:ERROR");
});

db.on("connected",function(){
  console.log("DB connection:connected");
});


//passport
app.use(passport.initialize());
app.use(passport.session());
require("./db/passport")(passport);

//cors 
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/student', studentRouter);
app.use('/post', postRouter);
app.use('/mail', mailRouter);


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
  res.render('error');
});

module.exports = app;
