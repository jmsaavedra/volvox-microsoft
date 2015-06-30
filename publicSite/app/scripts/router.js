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
      .state('about', {
        url: '/{lang:en|es}',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('video', {
        url: '/{lang:en|es}/video',
        templateUrl: 'views/video.html',
        controller: 'VideoYearCtrl'
      })
      .state('video.month', {
        url: '/{year:2015|2016}/{month:[0-9]+}',
        templateUrl: 'views/video.month.html',
        controller: 'VideoMonthCtrl'
      })
      .state('video.day', {
        url: '/{year:[0-9]+}/{month:[0-9]+}/{day:[0-9]+}',
        templateUrl: 'views/video.day.html',
        controller: 'VideoDayCtrl'
      })
      .state('photo', {
        url: '/{lang:en|es}/photo/',
        templateUrl: 'views/photo.html',
        controller: 'PhotoYearCtrl'
      })
      .state('photo.month', {
        url: '/{year:2015|2016}/{month:[0-9]+}',
        templateUrl: 'views/photo.month.html',
        controller: 'PhotoMonthCtrl'
      })
      .state('photo.day', {
        url: '/{year:[0-9]+}/{month:[0-9]+}/{day:[0-9]+}',
        templateUrl: 'views/photo.day.html',
        controller: 'PhotoDayCtrl'
      });
    $urlRouterProvider.otherwise('/es');
  });