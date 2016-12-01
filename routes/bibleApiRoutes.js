var express = require("express");

var bibleApiRoutes = function (bibleDataService) {
  var router = express.Router();
  var bibleApiController = require("../controllers/bibleApiController")(bibleDataService);

  // Middleware
  router.use(function (req, res, next) {

    // Build context
    req.bibleApiCtx = {
      baseUrl: req.protocol + '://' + req.get('host') + req.baseUrl
      // bible: req.params.bible,
      // book: req.params.book,
      // chapter: parseInt(req.params.chapter),
      // verse: parseInt(req.params.verse)
    };

    next();
  });

  // Default route
  router.route("/")
    .get(bibleApiController.getBibles);

  // Get bible by id
  router.route("/:id")
    .get(bibleApiController.getBibleById);

  // Get books
  router.route("/:bible/books")
    .get(bibleApiController.getBooks);

  // Get book by id
  router.route("/:bible/books/:id")
    .get(bibleApiController.getBookById);

  // Get chapters
  router.route("/:bible/books/:book/chapters")
    .get(bibleApiController.getChapters);

  // Get chapter
  router.route("/:bible/books/:book/chapters/:chapter")
    .get(bibleApiController.getChapter);

  // Get all verses for chapter
  router.route("/:bible/books/:book/chapters/:chapter/verses")
    .get(bibleApiController.getVerses);

  // Get verse
  router.route("/:bible/books/:book/chapters/:chapter/verses/:verse")
    .get(bibleApiController.getVerse);

  return router;
};

module.exports = bibleApiRoutes;
