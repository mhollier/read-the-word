(function () {
  var app = angular.module('readTheWord', ['ngRoute']);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl : 'app/templates/main.html',
        controller: 'mainCtrl'
      })
      .when('/random', {
        templateUrl : 'app/templates/random.html',
        controller: 'randomCtrl'
      })
      .when('/bibles', {
        templateUrl : 'app/templates/bibles.html',
        controller: 'biblesCtrl'
      })
      .when('/books', {
        templateUrl: 'app/templates/books.html',
        controller: "booksCtrl"
      })
      .when('/chapters', {
        templateUrl: 'app/templates/chapters.html',
        controller: "chaptersCtrl"
      })
      .otherwise({redirectTo: '/main'});
  });
}());
