var express = require('express');
var bodyParser = require('body-parser');
let mongoose = require("mongoose")
// for express session
let session = require("express-session")
var app = express();



// mongoose connecton 

app.use(session({secret:"Gamy Loves you", resave: true, saveUninitialized: false}))

// letting user ID available to the templates

app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next()
})


mongoose.connect("mongodb://localhost:27017/bookworm");
let db = mongoose.connection;
// error handler
db.on('error', console.error.bind(console, 'connection error:'))

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
