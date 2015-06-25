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
        url: '/{lang:en|es}',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('about', {
        url: '/{lang:en|es}/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .state('video_year', {
        url: '/{lang:en|es}/video',
        templateUrl: 'views/video_year.html',
        controller: 'VideoYearCtrl'
      })
      .state('video_month', {
        url: '/{lang:en|es}/video/{year:2015|2016}/{month:[0-9]+}',
        templateUrl: 'views/video_month.html',
        controller: 'VideoMonthCtrl'
      })
      .state('video_day', {
        url: '/{lang:en|es}/video/{year:[0-9]+}/{month:[0-9]+}/{day:[0-9]+}',
        templateUrl: 'views/video_day.html',
        controller: 'VideoDayCtrl'
      })
      .state('photo', {
        url: '/{lang:en|es}/photo/:month',
        templateUrl: 'views/photo.html',
        controller: 'PhotoCtrl'
      });
    $urlRouterProvider.otherwise('/en');
  });