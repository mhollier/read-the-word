(function () {
  var bibleApi = function ($http) {

    var getBibles = function () {
      return $http.get('/api/bibles')
        .then(function (res) {
          return res.data;
        });
    };

    return {
      getBibles: getBibles
    };
  };

  var module = angular.module('readTheWord');
  module.factory('bibleApi', bibleApi);
}());
