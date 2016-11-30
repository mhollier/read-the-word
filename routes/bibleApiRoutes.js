var express = require("express");

var bibleApiRoutes = function (Bible, Book, Verse) {
  var router = express.Router();
  var bibleApiController = require("../controllers/bibleApiController")(Bible);
  var bookApiController = require("../controllers/bookApiController")(Book, Verse);

  // Default route
  router.route("/")
    .get(bibleApiController.get);

  // Get bible by id
  router.route("/:id")
    .get(bibleApiController.getById);

  // Get books
  router.route("/:bible/books")
    .get(bookApiController.getBooks);

  // Get book by id
  router.route("/:bible/books/:id")
    .get(bookApiController.getBookById);

  // Get chapter
  router.route("/:bible/books/:book/:chapter")
    .get(bookApiController.getChapter);

  // Get verse
  router.route("/:bible/books/:book/:chapter/:verse")
    .get(bookApiController.getVerse);

  return router;
};

module.exports = bibleApiRoutes;
