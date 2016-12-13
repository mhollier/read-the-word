(function () {
  var app = angular.module('readTheWord');

  var booksCtrl = function ($scope, $routeParams, $http, $log, bibleApi) {
    var bibleCode = $routeParams['bibleCode'];
    $log.debug('booksCtrl: ' + bibleCode);

    // Retrieve the bible details
    bibleApi.getBible(bibleCode)
      .then(function (bible) {
        $log.debug('Received bible ' + bibleCode);
        $scope.bible = bible;
        return bibleApi.getBooks(bibleCode);
      })
      // Retrieve the list of books
      .then(function(books) {
        $log.debug('Received books from ' + $scope.bible.booksUrl);
        $scope.books = books;
      });
  };

  app.controller('booksCtrl', booksCtrl);
})();
