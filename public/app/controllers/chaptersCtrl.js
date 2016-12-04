(function () {
  var app = angular.module('readTheWord');

  var chaptersCtrl = function ($scope, $routeParams, $http) {
    var bibleCode = $routeParams['bibleCode'];
    var bookCode = $routeParams['bookCode'];
    var chapterNum = parseInt($routeParams['chapterNum'] || '1');
    console.log('chaptersCtrl: bible=' + bibleCode, ',book=' + bookCode);

    $http.get('/api/bibles/' + bibleCode + '/books/' + bookCode)
      .then(function (res) {
        console.log("Received " + bookCode);
        $scope.book = res.data;
        return $http.get($scope.book.chaptersUrl)
      })
      .then(function (res) {
        console.log("Received chapters from " + $scope.book.chaptersUrl);
        $scope.chapters = res.data;
        $scope.currChapter = $scope.chapters[chapterNum - 1];
        return $http.get($scope.currChapter.versesUrl);
      })
      .then(function (res) {
        console.log("Received verses for chapter" + $scope.currChapter);
        $scope.verses = res.data;
      });

    $scope.getChapterVerses = function (chapterNum) {
      $scope.currChapter = $scope.chapters[chapterNum - 1];
      $http.get($scope.currChapter.versesUrl)
        .then(function (res) {
          console.log("Received verses for chapter" + $scope.currChapter);
          $scope.verses = res.data;
        })
    };
  };

  app.controller('chaptersCtrl', chaptersCtrl);
})();
