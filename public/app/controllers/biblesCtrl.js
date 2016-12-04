(function () {
  var app = angular.module('readTheWord');

  var biblesCtrl = function ($scope, $routeParams, $http, $log, bibleApi) {
    $log.debug('biblesCtrl()');

    // Retrieve the list of available bibles
    bibleApi.getBibles()
      .then(function (bibles) {
        console.log(bibles);
        $scope.bibles = bibles;
      });
  };

  app.controller('biblesCtrl', biblesCtrl);
})();
