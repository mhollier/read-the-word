'use strict';

var express = require('express');

var bibleApiRoutes = function(bibleDataService) {
  var router = express.Router();
  var bibleApiController =
    require('../controllers/bibleApiController')(bibleDataService);

  // Default route
  router.route('/')
    .get(bibleApiController.getBibles);

  // Get bible by id (e.g. 'KJV', 'WEB', etc.)
  router.route('/random')
    .get(bibleApiController.getRandomVerse);

  // Get bible by id (e.g. 'KJV', 'WEB', etc.)
  router.route('/:id')
    .get(bibleApiController.getBibleById);

  // Get books
  router.route('/:bible/books')
    .get(bibleApiController.getBooks);

  // Get book by id (e.g. 'GEN', 'EXO', etc.)
  router.route('/:bible/books/:id')
    .get(bibleApiController.getBookById);

  // Get chapters
  router.route('/:bible/books/:book/chapters')
    .get(bibleApiController.getChapters);

  // Get chapter
  router.route('/:bible/books/:book/chapters/:chapter')
    .get(bibleApiController.getChapter);

  // Get all verses for chapter
  router.route('/:bible/books/:book/chapters/:chapter/verses')
    .get(bibleApiController.getVerses);

  // Get verse
  router.route('/:bible/books/:book/chapters/:chapter/verses/:verse')
    .get(bibleApiController.getVerse);

  return router;
};

module.exports = bibleApiRoutes;
