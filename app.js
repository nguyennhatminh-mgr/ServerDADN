var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var controlRouter = require('./routes/control');
var historyRouter = require('./routes/history');
var addDeviceRouter = require('./routes/adddevice');
var viewRoomRouter = require('./routes/viewroom');
var setLightLevel = require('./routes/setlightlevel');
var listenLightValue = require('./mqtt/subscriber');
const {controlAuto} = require('./mqtt/controlauto');

const {subscribeLightD} = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);   
app.use('/',controlRouter);
app.use('/',historyRouter);
app.use('/',addDeviceRouter);
app.use('/',viewRoomRouter);
app.use('/',setLightLevel);

//listen MQTT...
listenLightValue();
// controlAuto("Light12",471);
// subscribeLightD();   

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
