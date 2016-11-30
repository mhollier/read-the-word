var bibleApiController = function (Bible, Book, Verse) {

  var getBaseUrl = function (req) {
    return req.protocol + '://' + req.get('host') + req.baseUrl;
  };

  // Build object with hyperlinks
  var createBibleFromEntity = function(req, entity) {
    var bible = entity.toJSON();
    bible.url = getBaseUrl(req) + "/" + bible.code;
    bible.books_url = bible.url + "/books";
    return bible;
  };

  var getBibles = function (req, res) {
    Bible.find({}, function (err, bibles) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        // Build response with hyperlinks
        var biblesResponse = [];
        bibles.forEach(function (entity) {
          biblesResponse.push(createBibleFromEntity(req, entity));
        });
        res.json(biblesResponse);
      }
    });
  };

  var getBibleById = function (req, res) {
    console.log("getByCode: " + req.params.id);
    Bible.findOne({code: req.params.id}, function (err, entity) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else if (entity) {
        res.json(createBibleFromEntity(req, entity));
      } else {
        res.status(404);
        res.send("Not found");
      }
    });
  };

  // Build object with hyperlinks
  var createBookFromEntity = function (req, entity) {
    var bibleCode = req.params.bible;
    var book = entity.toJSON();
    delete book._id;
    book.bible = bibleCode;
    book.url = getBaseUrl(req) + "/" + bibleCode + "/books/" + book.code;
    book.chapters_url = book.url + "/chapters";
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
      } else if (entity) {
        res.json(createBookFromEntity(req, entity));
      }
      else {
        res.status(404);
        res.send("Not found");
      }
    });
  };

  var getChapters = function (req, res) {
    var bibleCode = req.params.bible;
    var bookCode = req.params.book;
    console.log("bible=" + bibleCode + "book=" + bookCode);

    Verse.find({bible: bibleCode, book: bookCode})
      .distinct("chapter", function (err, chapterNumbers) {
        if (err) {
          console.log(err);
          res.status(500);
          res.send(err);
        } else {
          // Build response with hyperlinks
          var baseUrl = req.bibleApiCtx.baseUrl + "/" + bibleCode + "/books/" + bookCode + "/chapters";
          var chaptersResponse = [];
          chapterNumbers.forEach(function (chapterNumber) {
            chaptersResponse.push({
              bible: bibleCode,
              book: bookCode,
              chapter: chapterNumber,
              url: baseUrl + "/" + chapterNumber,
              verses_url: baseUrl + "/" + chapterNumber + "/verses"
            });
          });
          res.json(chaptersResponse);
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
      } else if (entities.length > 0) {
        var baseUrl = req.bibleApiCtx.baseUrl + "/" + bibleCode + "/books/" + bookCode + "/chapters";
        var chapterResponse = {
          bible: bibleCode,
          book: bookCode,
          chapter: chapter,
          verses: entities.length,
          url: baseUrl + "/" + chapter,
          verses_url: baseUrl + "/" + chapter + "/verses"
        };
        res.json(chapterResponse);
      } else {
        res.status(404);
        res.send("Not found");
      }
    });
  };

  // Build object with hyperlinks
  var createVerseFromEntity = function (req, entity) {
    var bibleCode = req.params.bible;
    var verse = entity.toJSON();
    delete verse._id;
    delete verse.index;
    verse.url = getBaseUrl(req) + "/" + bibleCode + "/books/" + verse.book + "/chapters/" +
      verse.chapter + "/verses/" + verse.verse;
    return verse;
  };

  var getVerses = function (req, res) {
    var bibleCode = req.params.bible;
    var bookCode = req.params.book;
    var chapter = parseInt(req.params.chapter);

    console.log("bible=" + bibleCode + "book=" + bookCode + ", chapter=" + chapter);
    Verse.find({bible: bibleCode, book: bookCode, chapter: chapter}, function (err, entities) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send(err);
      } else {
        var versesResponse = [];
        entities.forEach(function (entity) {
          versesResponse.push(createVerseFromEntity(req, entity));
        });
        res.json(versesResponse);
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
    Verse.findOne({bible: bibleCode, book: bookCode, chapter: chapter, verse: verse},
      function (err, entity) {
        if (err) {
          console.log(err);
          res.status(500);
          res.send(err);
        } else if (entity) {
          res.json(createVerseFromEntity(req, entity));
        } else {
          res.status(404);
          res.send("Not found");
        }
      });
  };

  return {
    getBibles: getBibles,
    getBibleById: getBibleById,
    getBooks: getBooks,
    getBookById: getBookById,
    getChapters: getChapters,
    getChapter: getChapter,
    getVerses: getVerses,
    getVerse: getVerse
  };
};

module.exports = bibleApiController;