(function () {
  var app = angular.module('readTheWord');

  var biblesCtrl = function ($scope, $routeParams, $http) {
    console.log('biblesCtrl()');

    $http.get('/api/bibles')
      .then(function onSuccess(res) {
        console.log(res.data);
        $scope.bibles = res.data;
      });
  };

  app.controller('biblesCtrl', biblesCtrl);
})();
