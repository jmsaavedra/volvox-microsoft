// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ElBulli', ['ionic'])

/******************************************
* Run
******************************************/
.run(function() {
  console.log('App init')
})

/******************************************
* Configs
******************************************/

/******************************************
* Router
******************************************/
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .state('video', {
      url: '/video',
      templateUrl: 'views/video.html',
      controller: 'VideoCtrl'
    })
    .state('video.month', {
      url: '/video/:month', // As number
      templateUrl: 'views/video_month.html',
    })
    .state('video.day', {
      url: '/:month/:day', // As number
      templateUrl: 'views/video_day.html'
    });

  // Default State
  $urlRouterProvider.when(/video/, '/video');
  $urlRouterProvider.otherwise('/');

})
/******************************************
* Services
******************************************/

/******************************************
* Controllers
******************************************/
.controller('HomeCtrl', function() {

})
.controller('AboutCtrl', function() {

})
.controller('VideoCtrl', function($stateParams) {
  console.log($stateParams)
})