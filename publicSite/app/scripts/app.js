'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Main module of the application.
 */
angular
  .module('elbulliApp', [
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'anim-in-out',
    'angularMoment',
    'pascalprecht.translate',
    'app.router',
    'app.configs',
    'app.services',
    'app.filters'
  ])
  .run(function($rootScope, $translate) {
    ////////////////
    // Run global functions

    // Toggle Language
    $rootScope.changeLanguage = function(lang) {
      // console.log(lang);
      $rootScope.lang = lang;
      $translate.use($rootScope.lang);
    };
  });