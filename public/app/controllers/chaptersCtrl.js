(function () {
  var app = angular.module('readTheWord');

  var chaptersCtrl = function ($scope, $anchorScroll, $location,
                               $routeParams, $http, $log, bibleApi) {
    var bibleCode = $routeParams['bibleCode'];
    var bookCode = $routeParams['bookCode'];
    var chapterNum = parseInt($routeParams['chapterNum'] || '1');

    $log.debug('chaptersCtrl: bible=' + bibleCode, ',book=' + bookCode);

    $scope.currChapterNum = chapterNum;
    $scope.isChapterPanelCollapsed = true;

    // Get the bible detail
    bibleApi.getBible(bibleCode)
      .then(function (bible) {
        $scope.bible = bible;
        return bibleApi.getBook(bibleCode, bookCode);
      })
      // Get the book details
      .then(function (book) {
        $scope.book = book;

        // Create an array of chapter numbers for pagination
        $scope.chapterRange = [];
        for (var i = 1; i <= book.chapters; i++) {
          $scope.chapterRange.push(i);
        }
        return bibleApi.getChapterVerses(bibleCode, bookCode, chapterNum);
      })
      // Then the chapter verses
      .then(function (verses) {
        $log.debug('Received ' + verses.length + ' verses');
        $scope.verses = verses;
      });

    $scope.getChapterVerses = function (chapterNum) {
      var bibleCode = $routeParams['bibleCode'];
      var bookCode = $routeParams['bookCode'];
      $scope.currChapterNum = chapterNum;
      $scope.isChapterPanelCollapsed = true;

      // Scroll to chapterTitle anchor
      $log.debug("Anchor scroll");
      $anchorScroll('chapterTitle');

      return bibleApi.getChapterVerses(bibleCode, bookCode, chapterNum)
        .then(function (verses) {
          $log.debug('Received ' + verses.length + ' verses');
          $scope.verses = verses;
        });
    };

    $scope.nextChapter = function () {
      if ($scope.currChapterNum < $scope.book.chapters) {
        return $scope.getChapterVerses($scope.currChapterNum + 1);
      }
    };

    $scope.previousChapter = function () {
      if ($scope.currChapterNum > 1) {
        return $scope.getChapterVerses($scope.currChapterNum - 1);
      }
    };

    $scope.toggleChaptersDisplay = function () {
      $scope.isChapterPanelCollapsed = !$scope.isChapterPanelCollapsed;
    }
  };

  app.controller('chaptersCtrl', chaptersCtrl);
})();
