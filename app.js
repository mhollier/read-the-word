'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//var index = require('./src/routes/index');

mongoose.connect('mongodb://localhost/readTheWord');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', function() {
    console.log('MongoDB connection open');
  });
var Bible = require('./src/models/bibleModel');
var Book = require('./src/models/bookModel');
var Verse = require('./src/models/verseModel');

var BibleDataService = require('./src/services/bibleDataService');
var dataService = new BibleDataService(Bible, Book, Verse);
var bibleRouter = require('./src/routes/bibleApiRoutes')(dataService);

var app = express();

// View engine setup
//app.set('views', 'src/views');
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use('/api/bibles', bibleRouter);
app.get('*', function(req, res) {
  res.send('index.html');
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// Error handler
app.use(function(err, req, res) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
