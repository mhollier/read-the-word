(function () {
  var app = angular.module('readTheWord', ['ngRoute']);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl : 'main.html',
        controller: 'mainCtrl'
      })
      .when('/random', {
        templateUrl : 'random.html',
        controller: 'randomCtrl'
      })
      .when('/bibles', {
        templateUrl : 'bibles.html',
        controller: 'biblesCtrl'
      })
      .when('/books', {
        templateUrl: 'books.html',
        controller: "booksCtrl"
      })
      .when('/chapters', {
        templateUrl: 'chapters.html',
        controller: "chaptersCtrl"
      })
      .otherwise({redirectTo: '/main'});
  });
}());
