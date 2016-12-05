(function () {
  var app = angular.module('readTheWord');

  var randomCtrl = function ($scope, $routeParams, $http, bibleApi) {
    bibleApi.getRandomVerse()
      .then(function (verse) {
        $scope.verse = verse;
      });
  };

  app.controller('randomCtrl', randomCtrl);
})();
