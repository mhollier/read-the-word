(function () {
  var app = angular.module('readTheWord');

  var randomCtrl = function ($scope) {
    console.log('randomCtrl()');
  };

  app.controller('randomCtrl', randomCtrl);
}());
