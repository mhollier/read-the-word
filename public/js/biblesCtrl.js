(function () {
  var app = angular.module('readTheWord');

  var biblesCtrl = function ($rootScope, $scope, $routeParams, $http) {
    console.log('biblesCtrl()');

    $http.get('/api/bibles')
      .then(function onSuccess(res) {
        console.log(res.data);
        $scope.bibles = res.data;

        // $rootScope.bibleMap = {};
        // for (var i = 0; i < $scope.bibles.length; i++) {
        //   var bible = $scope.bibles[i];
        //   $rootScope.bibleMap[bible.code] = bible;
        // }
      });
  };

  app.controller('biblesCtrl', biblesCtrl);
}());
