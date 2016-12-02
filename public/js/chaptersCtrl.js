(function () {
  var app = angular.module('readTheWord');

  var chaptersCtrl = function ($scope, $routeParams, $http) {
    console.log('chaptersCtrl()');
    var bibleCode = $routeParams['bible'];
    var bookCode = $routeParams['book'];

    var currChapterNum = parseInt($routeParams['chapter'] || '1');

    $http.get('/api/bibles/' + bibleCode + '/books/' + bookCode)
      .then(function (res) {
        console.log("Received " + bookCode);
        $scope.book = res.data;
        return $http.get($scope.book.chaptersUrl)
      })
      .then(function (res) {
        console.log("Received chapters from " + $scope.book.chaptersUrl);
        $scope.chapters = res.data;
        $scope.currChapter = $scope.chapters[currChapterNum - 1];
        return $http.get($scope.currChapter.versesUrl);
      })
      .then(function (res) {
        console.log("Received verses for chapter" + $scope.currChapter);
        $scope.verses = res.data;
      });
  };

  app.controller('chaptersCtrl', chaptersCtrl);
})();
