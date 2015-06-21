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
      .state('video_year', {
        url: '/video_year',
        templateUrl: 'views/video_year.html',
        controller: 'VideoYearCtrl'
      })
      .state('video_month', {
        url: '/video_month/:month',
        templateUrl: 'views/video_month.html',
        controller: 'VideoMonthCtrl'
      })
      .state('video_date', {
        url: '/video_date/:month/:date',
        templateUrl: 'views/video_date.html',
        controller: 'VideoDayCtrl'
      })
      .state('photo', {
        url: '/photo/:month',
        templateUrl: 'views/photo.html',
        controller: 'PhotoCtrl'
      });
    $urlRouterProvider.otherwise('/');
  });