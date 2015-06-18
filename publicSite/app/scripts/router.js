'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Routing module of the application.
 */
angular
  .module('app.router', [])
  .config(function($stateProvider, $urlRouterProvider) {
    /*
  	Router
  	– Home (main)
  	– About
  	– Video Gallery
  	– Photo Gallery
  	*/
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
      .state('photo', {
        url: '/photo',
        templateUrl: 'views/photo.html',
        controller: 'PhotoCtrl'
      });
    $urlRouterProvider.otherwise('/');
  });