'use strict';

var mongodb = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/readTheWord';
var fs = require('fs');

mongodb.connect(dbUrl, function (err, db) {
  loadBooks(db);
  loadBible(db, __dirname + '/bibles/kjv.json');
  loadBible(db, __dirname + '/bibles/web.json');
});

// Load book meta data
function loadBooks(db) {
  var books = require('./bibles/books.json');

  db.dropCollection('books', function (err, results) {
    var collection = db.collection('books');
    collection.insertMany(books, function (err, result) {
      if (err) {
        console.log('Error: ' + err);
      } else {
        console.log('Inserted=' + result.insertedCount + ' book records');
      }
    });
  });
}

// Load bibles
function loadBible(db, filename) {
  var contents = fs.readFileSync(filename, 'utf8');
  var bible = JSON.parse(contents);

  loadBibleHeader(db, bible);
  loadVerses(db, bible);
}

function loadBibleHeader(db, bible) {

  var biblesCollection = db.collection('bibles');
  biblesCollection.findOneAndReplace(
    {
      code: bible.info.code
    },
    {$set: {title: bible.info.title}},
    {returnOriginal: false, upsert: true});
}

// Load the verses collection
function loadVerses(db, bible) {
  var code = bible.info.code;
  var collection = db.collection('verses');
  var filter = {bible: code};
  collection.deleteMany(filter, function (err, delResult) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Deleted ' + delResult.deletedCount + ' verses from ' + code);
      collection.insertMany(bible.verses, function (err, result) {
        if (err) {
          console.log('Error: ' + err);
        } else {
          console.log('Inserted ' + result.insertedCount + ' verses into ' +
            code);
        }
      });
    }
  });
}
