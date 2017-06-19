var express 	= require('express');
var path		= require('path');
var favicon 	= require('serve-favicon');
var logger		= require('morgan');
var bodyParser 	= require('body-parser');
var CORS		= require('cors')();
var cookieParser = require('cookie-parser');
var mysql		= require('mysql');
var dbconfig    = require('./config/database.js');
var connection  = mysql.createConnection(dbconfig);


var index = require('./routes/index');
var users = require('./routes/users');
var match = require('./routes/match');
var queue = require('./routes/queue');
var login = require('./routes/login');

var app = express();

app.get('/', function(req, res, next) {
  if (req.headers.host.slice(0, 3) != 'www') {
    res.redirect('http://www.' + req.headers.host + req.url, 301);
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//  port setup
app.set('port', process.env.PORT || 9000 );

app.use(CORS);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', index);
app.use('/users', users);
app.use('/match', match);
app.use('/queue', queue);
app.use('/login', login);

//app.get('/', function(req, res){
	//res.sendFile(__dirname +'/public/register.html');
//})

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



if (host == host.replace('www','')) {
        res.redirect("http://www." + host + req.url);
    } 
    else if (!req.secure) {
        res.redirect("http://" + host + req.url);
    } else
        return next();
        

});

//////////////////////////////////////////////////////
// ------- creates Server -------
module.exports = app;

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
