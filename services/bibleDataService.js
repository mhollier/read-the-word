/**
 * People data service module.
 * @module peopleDataService
 * @author Mark Hollier <mhollier@yahoo.com>
 */

var bibleDataService = function(Bible, Book, Verse) {
// Build object with hyperlinks
  var bibleFromEntity = function (bibleEntity) {
    var bible = bibleEntity.toJSON();
    delete bible._id;
    return bible;
  };

  function getBibles(callback) {
    Bible.find({}, function (err, bibleEntities) {
      if (err || !bibleEntities) {
        callback(err, null);
      } else {
        var bibles = [];
        bibleEntities.forEach(function (entity) {
          bibles.push(bibleFromEntity(entity));
        });
        callback(err, bibles);
      }
    });
  }

  function getBible(code, callback) {
    Bible.findOne({code: code}, function (err, bibleEntity) {
      if (err || !bibleEntity) {
        callback(err, null);
      } else {
        callback(err, bibleFromEntity(bibleEntity));
      }
    });
  }

// Build object with hyperlinks
  function createBookFromEntity(bible, entity) {
    var book = entity.toJSON();
    delete book._id;
    book.bible = bible;
    return book;
  }

  function getBooks(bible, callback) {
    // First ensure that the requested bible exists. We must do this since the collection of books
    // is currently a stand-alone set of meta data for all bible versions.
    Bible.findOne({code: bible}, function (err, bibleEntity) {
      if (err || !bibleEntity) {
        callback(err, null);
      } else {
        // OK, the required bible version exists (e.g. KJV, WEB, etc.), so go ahead and
        // retrieve the list of books and build the array of response objects.
        Book.find({}, function (err, bookEntities) {
          if (err || !bookEntities) {
            callback(err, null);
          } else {
            // Build response with hyperlinks
            var books = [];
            bookEntities.forEach(function (entity) {
              books.push(createBookFromEntity(bible, entity));
            });
            callback(err, books);
          }
        });
      }
    });
  }

  function getBook(bible, bookCode, callback) {
    var qry = {code: bookCode};
    Book.findOne(qry, function (err, entity) {
      if (err || !entity) {
        callback(err, null);
      } else {
        callback(err, createBookFromEntity(bible, entity));
      }
    });
  }

  function chapterFromVerseEntities(verseEntities) {
    if (!verseEntities || verseEntities.length === 0) {
      return null;
    }

    var verseEntity = verseEntities[0];
    return {
      bible: verseEntity.bible,
      book: verseEntity.book,
      chapter: verseEntity.chapter,
      verses: verseEntities.length
    };
  }

  function getChapters(bible, book, callback) {
    var qry = {bible: bible, book: book};
    // Retrieve a distinct list of chapter numbers
    Verse.find(qry).distinct("chapter", function (err, chapterNumbers) {
      var chapters = [];
      chapterNumbers.forEach(function (chapterNumber) {
        chapters.push({
          bible: bible,
          book: book,
          chapter: chapterNumber
        });
      });
      callback(err, chapters);
    });
  }

  function getChapter(bible, book, chapter, callback) {
    var qry = {bible: bible, book: book, chapter: chapter};
    Verse.find(qry, function (err, entities) {
      callback(err, chapterFromVerseEntities(entities));
    });
  }

// Build object with hyperlinks
  function verseFromEntity(entity) {
    if (!entity) {
      return null;
    }

    // Convert to JSON and remove _id, index. Replace verseText with simply text.
    var verse = entity.toJSON();
    delete verse._id;
    delete verse.index;
    verse.text = verse.verseText;
    delete verse.verseText;
    return verse;
  }

  function getVerses(bible, book, chapter, callback) {
    Verse.find({bible: bible, book: book, chapter: chapter}, function (err, entities) {
      var verses = [];
      entities.forEach(function (entity) {
        verses.push(verseFromEntity(entity));
      });
      callback(err, verses);
    });
  }

  function getVerse(bible, book, chapter, verse, callback) {
    var qry = {bible: bible, book: book, chapter: chapter, verse: verse};
    Verse.findOne(qry, function (err, entity) {
      callback(err, verseFromEntity(entity));
    });
  }

  return {
    getBibles: getBibles,
    getBible: getBible,
    getBooks: getBooks,
    getBook: getBook,
    getChapters: getChapters,
    getChapter: getChapter,
    getVerses: getVerses,
    getVerse: getVerse
  };
};

module.exports = bibleDataService;

