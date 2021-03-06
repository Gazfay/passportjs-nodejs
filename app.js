var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session  = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

var get = require('./routes/get');
var post = require('./routes/post');

var util = require('util');
var expressValidator = require('express-validator');

var app = express();

const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.db');
const GoogleUsers = require('./models').GoogleUsers;


var passportUtil = require('./utils/passportUtil');


// view engine setup
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator([]));
app.use(cookieParser());


var models = require('./models/');

models.sequelize
  .authenticate()
  .then(function () {
    console.log('Connection successful');
    GoogleUsers.findAll().then(all=> {
      console.log(all, 'all');
    })
  })
  .catch(function(error) {
    console.log("Error creating connection:", error);
  });



app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());


passportUtil.init(app);

app.get('/*', get);
app.post('/*', post);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
