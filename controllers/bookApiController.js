"use strict";

var bookApiController = function (Book, Verse) {

  var getBaseUrl = function (req) {
    return req.protocol + '://' + req.get('host') + req.baseUrl;
  };

  // Build object with hyperlinks
  var createBookFromEntity = function (req, entity) {
    var bibleCode = req.params.bible;
    var book = entity.toJSON();
    book.url = getBaseUrl(req) + "/" + bibleCode + "/books/" + book.code;
    book.chapter_url = book.url + "{/chapter}";
    book.verse_url = book.url + "{/chapter}{/verse}";
    return book;
  };

  var getBooks = function (req, res) {
    Book.find({}, function (err, books) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        // Build response with hyperlinks
        var booksResponse = [];
        books.forEach(function (entity) {
          booksResponse.push(createBookFromEntity(req, entity));
        });
        res.json(booksResponse);
      }
    });
  };

  var getBookById = function (req, res) {
    console.log("getByCode: " + req.params.id);
    Book.findOne({code: req.params.id}, function (err, entity) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        res.json(createBookFromEntity(req, entity));
      }
    });
  };

  var getChapter = function (req, res) {
    var bibleCode = req.params.bible;
    var bookCode = req.params.book;
    var chapter = parseInt(req.params.chapter);
    console.log("book=" + bookCode + ", chapter=" + chapter);
    Verse.find({bible: bibleCode, book: bookCode, chapter: chapter}, function (err, entities) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        res.json(entities);
      }
    });
  };

  var getVerse = function (req, res) {
    var bibleCode = req.params.bible;
    var bookCode = req.params.book;
    var chapter = parseInt(req.params.chapter);
    var verse = parseInt(req.params.verse);

    console.log("bible=" + bibleCode + "book=" + bookCode +
      ", chapter=" + chapter + ", verse=" + verse);
    Verse.find({bible: bibleCode, book: bookCode, chapter: chapter, verse: verse},
      function (err, entities) {
        if (err) {
          console.log(err);
          res.status(500);
          res.send(err);
        } else {
          res.json(entities);
        }
      });
  };


  return {
    getBooks: getBooks,
    getBookById: getBookById,
    getChapter: getChapter,
    getVerse: getVerse
  };
};

module.exports = bookApiController;