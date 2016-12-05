'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/readTheWord');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', function() {
    console.log('MongoDB connection open');
  });
var Bible = require('./server/models/bibleModel');
var Book = require('./server/models/bookModel');
var Verse = require('./server/models/verseModel');

var BibleDataService = require('./server/services/bibleDataService');
var dataService = new BibleDataService(Bible, Book, Verse);
var bibleRouter = require('./server/routes/bibleApiRoutes')(dataService);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.set("port", 5001);


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

app.listen(app.get("port"), function(err) {
  console.log("Server running on port " + app.get("port"));
});
