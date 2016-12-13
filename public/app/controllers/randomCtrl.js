(function () {
  var app = angular.module('readTheWord');

  var randomCtrl = function ($scope, $routeParams, $http, bibleApi) {
    bibleApi.getRandomVerse()
      .then(function (verse) {
        $scope.chapterVerseText = verse.chapter + ':' + verse.start;
        if (verse.end > verse.start) {
          $scope.chapterVerseText += String.fromCharCode(8211) + verse.end;
        }
        $scope.verse = verse;
      });
  };

  app.controller('randomCtrl', randomCtrl);
})();
