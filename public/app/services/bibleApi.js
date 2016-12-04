(function () {
  var bibleApi = function ($http) {

    var baseUrl = '/api/bibles/';

    var getBibles = function () {
      return $http.get(baseUrl).then(function (res) {
          return res.data;
        });
    };

    var getBible = function (bibleCode) {
      return $http.get(baseUrl + bibleCode).then(function (res) {
          return res.data;
        });
    };

    var getBooks = function (bibleCode) {
      // GET /api/bibles/KJV/books
      var url = baseUrl + bibleCode + '/books';
      return $http.get(url)
        .then(function (res) {
          return res.data;
        });
    };

    var getBook = function (bibleCode, bookCode) {
      // GET /api/bibles/KJV
      var bookUrl = baseUrl + bibleCode + '/books/' + bookCode;
      return $http.get(bookUrl)
        .then(function (res) {
          return res.data;
        });
    };

    var getChapters = function (bibleCode, bookCode) {

      // GET /api/bibles/KJV/books/GEN
      var chaptersUrl = baseUrl + bibleCode + '/books/' + bookCode +
        '/chapters';
      return $http.get(chaptersUrl)
        .then(function (res) {
          return res.data;
        });
    };

    var getChapter = function (bibleCode, bookCode, chapterNum) {

      // GET /api/bibles/KJV/books/GEN/1
      var chapterUrl = baseUrl + bibleCode + '/books/' + bookCode +
        '/chapters/' + chapterNum;
      return $http.get(chapterUrl)
        .then(function (res) {
          return res.data;
        });
    };

    var getChapterVerses = function (bibleCode, bookCode, chapterNum) {

      // GET /api/bibles/KJV/books/GEN/1
      var chapterUrl = baseUrl + bibleCode + '/books/' + bookCode +
        '/chapters/' + chapterNum + '/verses';
      return $http.get(chapterUrl)
        .then(function (res) {
          return res.data;
        });
    };

    return {
      getBibles: getBibles,
      getBible: getBible,
      getBooks: getBooks,
      getBook: getBook,
      getChapters: getChapters,
      getChapter: getChapter,
      getChapterVerses: getChapterVerses
    };
  };

  var module = angular.module('readTheWord');
  module.factory('bibleApi', bibleApi);
})();
