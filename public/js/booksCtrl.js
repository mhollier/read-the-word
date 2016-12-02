(function () {
  var app = angular.module('readTheWord');

  var booksCtrl = function ($scope, $routeParams, $http) {
    console.log('booksCtrl()');
    var bibleCode = $routeParams['bible'];
    $http.get('/api/bibles/' + bibleCode)
      .then(function(res) {
        console.log("Received " + bibleCode);
        $scope.bible = res.data;
        return $http.get($scope.bible.booksUrl)
      })
      .then(function(res) {
        console.log("Received books from " + $scope.bible.booksUrl);
        $scope.books = res.data;
    });
  };

  app.controller('booksCtrl', booksCtrl);
})();
