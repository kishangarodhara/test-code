var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
//let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const cookieSession = require('express-session');

var indexRouter = require('./routes/index');
const config = require('./config/config');

var userRegisterRouter = require('./routes/userRegister.routes');
var loginRouter = require('./routes/login.routes');
var app = express();
    
// Check body function
var expressValidator = require('express-validator');
// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://test:test@test-pditk.mongodb.net/test?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//app.set('superSecret', config.secret); // secret variable


app.use(cors("*"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  secret: 'supersecret',
  resave: true,
  saveUninitialized: true,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
  errorFormatter(param, msg, value) {
    const namespace = param.split("."),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      //  formParam += "[" + namespace.shift() + "]";
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));

app.use('/api', indexRouter);
app.use('/api/userRegister', userRegisterRouter);
app.use('/api/login', loginRouter);
app.use('/api/Profileupdte',userRegisterRouter);
app.use('/api/getanyuserdetail',userRegisterRouter);


//for view 
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });

});

module.exports = app;