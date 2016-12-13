'use strict';

/**
 * Creates a new BibleDataService instance.
 * @param Bible
 * @param Book
 * @param Verse
 * @returns {{getBibles: getBibles, getBooks: getBooks, getBible: getBible,
 * getBook: getBook, getChapters: getChapters, getChapter: getChapter,
 * getVerses: getVerses, getVerse: getVerse}}
 * @constructor
 */
var BibleDataService = function (Bible, Book, Verse) {
  var MAX_VERSE_NUM = 31000;


  /**
   * Gets a random verse object.
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {getVerseCallback} callback - The callback that handles the
   * response.
   */
  function getRandomVerse(bible, callback) {
    var index = Math.floor(Math.random() * MAX_VERSE_NUM);

    var qry = {bible: bible, index: index};
    Verse.findOne(qry, function (err, entity) {

      var randomVerseData = verseFromEntity(entity);
      // If there is an error, invoke the callback and exit.
      if (err) {
        callback(err, randomVerseData);
        return;
      }

      randomVerseData.start = randomVerseData.verse;
      randomVerseData.end = randomVerseData.verse;

      // If the verse is a fragment, then include the following verse.
      var lastChar = randomVerseData ? randomVerseData.text.slice(-1) : null;
      if (lastChar && (lastChar === ',' || lastChar === ';' || lastChar === ':')) {
        // Get the verse count for this chapter. If we are already at the last
        // verse for some reason, then return what we have.
        getVerseCount(bible, randomVerseData.book, function (err, verseCount) {
          if (randomVerseData.end < verseCount) {
            getAndConcatNextVerse(randomVerseData, callback);
          } else {
            callback(err, randomVerseData);
          }
        });
      } else {
        callback(err, randomVerseData);
      }
    });
  }

  function getVerseCount(bible, book, callback) {
    var qry = {bible: bible, book: book};
    Verse.find(qry).limit(1).sort({verse: -1})
      .then(function onSuccess(result) {
        callback(null, result[0].verse);
      }, function onError(err) {
        callback(err, null);
      });
  }

  function getAndConcatNextVerse(verseData, callback) {
    getVerse(verseData.bible, verseData.book, verseData.chapter, verseData.verse + 1,
      function (err, nextVerseData) {
        if (nextVerseData) {
          verseData.end = nextVerseData.verse;
          verseData.text += ' ' + nextVerseData.text;
        }
        callback(err, verseData);
      });
  }

  /**
   * The callback format for the getBibles method.
   * @callback getBiblesCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} bibles - An array of bible objects.
   */

  /**
   * Gets the list of available bible versions/translations.
   * @param {getBiblesCallback} callback - The callback that handles the
   * response.
   */
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

  /**
   * The callback format for the getBible method.
   * @callback getBibleCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} bible - An bible object.
   */

  /**
   * Gets the list of available bible versions/translations.
   * @param {String} code - The bile code/identifier (e.g. KJV, WEB, etc.).
   * @param {getBibleCallback} callback - The callback that handles the
   * response.
   */
  function getBible(code, callback) {
    Bible.findOne({code: code}, function (err, bibleEntity) {
      if (err || !bibleEntity) {
        callback(err, null);
      } else {
        callback(err, bibleFromEntity(bibleEntity));
      }
    });
  }

  /**
   * The callback format for the getBooks method.
   * @callback getBooksCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} books - An array of book objects.
   */

  /**
   * Gets the list of available books for the requested bible version.
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {getBooksCallback} callback - The callback that handles the response.
   */
  function getBooks(bible, callback) {
    // First ensure that the requested bible exists. We must do this since the
    // collection of books is currently a stand-alone set of meta data for all
    // bible versions.
    Bible.findOne({code: bible}, function (err, bibleEntity) {
      if (err || !bibleEntity) {
        callback(err, null);
      } else {
        // The required bible version exists (e.g. KJV, WEB, etc.), so go
        // ahead and retrieve the list of books and build the array of
        // response objects.
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

  /**
   * The callback format for the getBook method.
   * @callback getBookCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} book - A book object.
   */

  /**
   * Gets the list of available books for the requested bible version.
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {String} bookCode - The book code (e.g. GEN, EXO, etc.).
   * @param {getBookCallback} callback - The callback that handles the response.
   */
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

  /**
   * The callback format for the getChapters method.
   * @callback getChaptersCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} chapters - An array of chapter objects.
   */

  /**
   * Gets the list of available chapters for the requested book.
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {String} book - The book code (e.g. GEN, EXO, etc.).
   * @param {getChaptersCallback} callback - The callback that handles the
   * response.
   */
  function getChapters(bible, book, callback) {
    var qry = {bible: bible, book: book};
    // Retrieve a distinct list of chapter numbers
    Verse.find(qry).distinct('chapter', function (err, chapterNumbers) {
      var chapters = [];
      chapterNumbers.forEach(function (chapterNumber) {
        chapters.push({
          bible: bible,
          book: book,
          chapter: chapterNumber,
        });
      });
      callback(err, chapters);
    });
  }

  /**
   * The callback format for the getChapter method.
   * @callback getChapterCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} chapter - A chapter object.
   */

  /**
   * Gets a single chapter object.
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {String} book - The book code (e.g. GEN, EXO, etc.).
   * @param {Number} chapter - The chapter number.
   * @param {getChapterCallback} callback - The callback that handles the
   * response.
   */
  function getChapter(bible, book, chapter, callback) {
    var qry = {bible: bible, book: book, chapter: chapter};
    Verse.find(qry, function (err, entities) {
      callback(err, chapterFromVerseEntities(entities));
    });
  }


  /**
   * The callback format for the getVerses method.
   * @callback getVersesCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} verses - An array of verse objects.
   */

  /**
   * Gets the list of available verses for the requested chapter
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {String} book - The book code (e.g. GEN, EXO, etc.).
   * @param {Number} chapter - The chapter number.
   * @param {getVersesCallback} callback - The callback that handles the
   * response.
   */
  function getVerses(bible, book, chapter, callback) {
    var qry = {bible: bible, book: book, chapter: chapter};
    Verse.find(qry, function (err, entities) {
      var verses = [];
      entities.forEach(function (entity) {
        verses.push(verseFromEntity(entity));
      });
      callback(err, verses);
    });
  }

  /**
   * The callback format for the getVerse method.
   * @callback getVerseCallback
   * @param {Error} err - An error instance representing the error during the
   * execution.
   * @param {object} verse - A verse object.
   */

  /**
   * Gets a single verse object.
   * @param {String} bible - The bible version code (e.g. KJV, WEB, etc.).
   * @param {String} book - The book code (e.g. GEN, EXO, etc.).
   * @param {Number} chapter - The chapter number.
   * @param {Number} verse - The verse number.
   * @param {getVerseCallback} callback - The callback that handles the
   * response.
   */
  function getVerse(bible, book, chapter, verse, callback) {
    var qry = {bible: bible, book: book, chapter: chapter, verse: verse};
    Verse.findOne(qry, function (err, entity) {
      callback(err, verseFromEntity(entity));
    });
  }

  //
  // Helper functions
  //

  // Build object with hyperlinks
  var bibleFromEntity = function (bibleEntity) {
    var bible = bibleEntity.toJSON();
    delete bible._id;
    return bible;
  };

  // Build object with hyperlinks
  function createBookFromEntity(bible, entity) {
    var book = entity.toJSON();
    delete book._id;
    book.bible = bible;
    return book;
  }

  // Build object with hyperlinks
  function verseFromEntity(entity) {
    if (!entity) {
      return null;
    }

    // Convert to JSON and remove _id, index. Replace 'verseText' with
    // simply 'text'.
    var verse = entity.toJSON();
    delete verse._id;
    delete verse.index;
    verse.text = verse.verseText;
    delete verse.verseText;
    return verse;
  }

  // Convert from Mongoose entity to response format
  function chapterFromVerseEntities(verseEntities) {
    if (!verseEntities || verseEntities.length === 0) {
      return null;
    }

    var verseEntity = verseEntities[0];
    return {
      bible: verseEntity.bible,
      book: verseEntity.book,
      chapter: verseEntity.chapter,
      verses: verseEntities.length,
    };
  }

  return {
    getRandomVerse: getRandomVerse,
    getBibles: getBibles,
    getBooks: getBooks,
    getBible: getBible,
    getBook: getBook,
    getChapters: getChapters,
    getChapter: getChapter,
    getVerses: getVerses,
    getVerse: getVerse,
  };
};

module.exports = BibleDataService;

