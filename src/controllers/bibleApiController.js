'use strict';

var bibleApiController = function(bibleDataService) {

  var getBaseUrl = function(req) {
    return req.protocol + '://' + req.get('host') + req.baseUrl;
  };

  var sendNotFound = function(res) {
    res.status(404);
    res.send('Not found');
  };

  var addBibleLinks = function(req, bible) {
    bible.url = getBaseUrl(req) + '/' + bible.code;
    bible.booksUrl = bible.url + '/books';
    return bible;
  };

  var getRandomVerse = function (req, res, next) {
    // Default to KJV translation for now
    bibleDataService.getRandomVerse('KJV', function (err, verse) {
      if (err) {
        next();
      } else if (verse) {
        addVerseLinks(req, verse);
        res.json(verse);
      } else {
        sendNotFound(res);
      }
    });
    // res.json({
    //   bible: 'KJV',
    //   book: 'GEN',
    //   chapter: 1,
    //   verse: 1,
    //   text: "In the beginning God created the heaven and the earth",
    //   url: "http://localhost:5001/api/bibles/KJV/books/GEN/chapters/1/verses/1",
    // });
  };

  var getBibles = function(req, res, next) {
    bibleDataService.getBibles(function(err, bibles) {
      if (err) {
        next();
      } else if (bibles && bibles.length > 0) {
        // Add the hyperlinks
        bibles.forEach(function(bible) {
          addBibleLinks(req, bible);
        });
        res.json(bibles);
      } else {
        sendNotFound(res);
      }
    });
  };

  var getBibleById = function(req, res, next) {
    var bibleCode = req.params.id;
    bibleDataService.getBible(bibleCode, function(err, bible) {
      if (err) {
        next();
      } else if (bible) {
        // Add the hyperlinks
        addBibleLinks(req, bible);
        res.json(bible);
      } else {
        sendNotFound(res);
      }
    });
  };

  var getBooks = function(req, res, next) {
    var bible = req.params.bible;

    bibleDataService.getBooks(bible, function(err, books) {
      if (err) {
        next();
      } else if (books && books.length > 0) {
        // Add the hyperlinks
        books.forEach(function(book) {
          addBookLinks(req, book);
        });
        res.json(books);
      } else {
        sendNotFound(res);
      }
    });
  };

  var getBookById = function(req, res, next) {
    var bible = req.params.bible;
    var bookCode = req.params.id;
    bibleDataService.getBook(bible, bookCode, function(err, book) {
      if (err) {
        next();
      } else if (book) {
        // Add the hyperlinks
        addBookLinks(req, book);
        res.json(book);
      } else {
        sendNotFound(res);
      }
    });
  };

  var getChapters = function(req, res, next) {
    var bible = req.params.bible;
    var book = req.params.book;

    bibleDataService.getChapters(bible, book, function(err, chapters) {
      if (err) {
        next();
      } else if (chapters && chapters.length > 0) {
        // Add the url for each verse
        chapters.forEach(function(chapter) {
          addChapterLinks(req, chapter);
        });
        res.json(chapters);
      } else {
        sendNotFound(res);
      }
    });
  };

  var addBookLinks = function(req, book) {
    book.url = getBaseUrl(req) + '/' + book.bible + '/books/' + book.code;
    book.chaptersUrl = book.url + '/chapters';
  };

  var addChapterLinks = function(req, chapter) {
    chapter.url = getBaseUrl(req) + '/' + chapter.bible + '/books/' +
      chapter.book + '/chapters/' + chapter.chapter;
    chapter.versesUrl = chapter.url + '/verses';
  };

  var addVerseLinks = function(req, verse) {
    verse.url = getBaseUrl(req) + '/' + verse.bible + '/books/' +
      verse.book + '/chapters/' + verse.chapter + '/verses/' + verse.verse;
  };

  var getChapter = function(req, res, next) {
    var bible = req.params.bible;
    var book = req.params.book;
    var chapterNum = parseInt(req.params.chapter);
    bibleDataService.getChapter(bible, book, chapterNum,
      function(err, chapter) {
      if (err) {
        next();
      } else if (chapter) {
        // Add the url for this chapter
        addChapterLinks(req, chapter);
        res.json(chapter);
      } else {
        sendNotFound(res);
      }
    });
  };

  var getVerses = function(req, res, next) {
    var bible = req.params.bible;
    var book = req.params.book;
    var chapter = parseInt(req.params.chapter);
    bibleDataService.getVerses(bible, book, chapter, function(err, verses) {
      if (err) {
        next();
      } else if (verses && verses.length > 0) {
        // Add the url for each verse
        verses.forEach(function(verse) {
          addVerseLinks(req, verse);
        });
        res.json(verses);
      } else {
        sendNotFound(res);
      }
    });
  };

  var getVerse = function(req, res, next) {
    var bible = req.params.bible;
    var book = req.params.book;
    var chapterNum = parseInt(req.params.chapter);
    var verseNum = parseInt(req.params.verse);

    bibleDataService.getVerse(bible, book, chapterNum, verseNum,
      function(err, verse) {
      if (err) {
        next();
      } else if (verse) {
        addVerseLinks(req, verse);
        res.json(verse);
      } else {
        sendNotFound(res);
      }
    });
  };

  return {
    getRandomVerse: getRandomVerse,
    getBibles: getBibles,
    getBibleById: getBibleById,
    getBooks: getBooks,
    getBookById: getBookById,
    getChapters: getChapters,
    getChapter: getChapter,
    getVerses: getVerses,
    getVerse: getVerse,
  };
};

module.exports = bibleApiController;
