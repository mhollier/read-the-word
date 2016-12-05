(function () {
  var app = angular.module('readTheWord');

  var randomCtrl = function ($scope, $routeParams, $http) {
    $http.get('api/bibles/random')
      .then(function (res) {
        $scope.verse = res.data;
      });
  };

  app.controller('randomCtrl', randomCtrl);
})();
