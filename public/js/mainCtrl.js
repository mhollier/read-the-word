(function () {
  var app = angular.module("readTheWord");

  var mainCtrl = function ($scope) {
    console.log("mainCtrl()");
  };

  app.controller("mainCtrl", mainCtrl);
}());
