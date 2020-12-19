var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let passport = require('passport');
let session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const sessionPool = require('pg').Pool;
var CONST = require('./const');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: './public/img/uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})
const upload = multer({
  storage: storage
});

require('./passport_setup')(passport);
let {
  run_db
} = require('./dbJoin');

var recipeRouter = require('./routes/recipe');
var usersRouter = require('./routes/users');
var taskRouter = require('./routes/tasks');
var inventoryRouter = require('./routes/inventory');
var expensesRouter = require('./routes/expenses');
var notificationRouter = require('./routes/notification');

var app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');pass

const sessionDBaccess = new sessionPool(CONST.dbPool);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new pgSession({
    pool: sessionDBaccess,
    tableName: 'session'
  }),
  secret: "apassword",
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    path: '/'
  } //24 hours , maxAge: 24 * 100 * 60 * 60 
}));
app.use(passport.initialize());
app.use(passport.session());
run_db();

app.use('/api/recipe', recipeRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/notification', notificationRouter);
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    file: req.file
  })
})
console.log(CONST.version)
console.log("NODE_ENV: " + process.env.NODE_ENV)
console.log('Database config:', CONST.dbPool)
//For production
if (process.env.NODE_ENV === 'production') {
  //Static folder of vue.js dist
  app.use(express.static(__dirname + '/public'));

  //Handle SPA (Single Page Application)
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;