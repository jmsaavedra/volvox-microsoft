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
    'slick',
    'ngDialog',
    'app.data',
    'app.router',
    'app.configs',
    'app.services',
    'app.filters'
  ])
  .run(function($rootScope, $translate, $state, $stateParams, $timeout, $location, amMoment, ngDialog) {
    ////////////////
    // Run global functions
    $rootScope.title = 'elBulliLab Timelapse';
    $rootScope.allowSlide = true;
    // Default language
    $timeout(function() {
      $rootScope.lang = $stateParams.lang || 'en';
      $translate.use($rootScope.lang);
      amMoment.changeLocale($rootScope.lang);
      // console.log($stateParams.lang);
    }, 1000);

    // Toggle Language
    $rootScope.changeLanguage = function(lang) {
      // Change time moment
      if (lang === 'en') {
        amMoment.changeLocale('en');
      } else if (lang === 'es') {
        amMoment.changeLocale('es');
      }
      // console.log(lang);
      $rootScope.lang = lang;
      $translate.use($rootScope.lang);
      // Tweak route
      $state.go($state.current, {
        lang: $rootScope.lang
      }, {
        reload: true
      });
    };
    $rootScope.heightMinusNavs = window.innerHeight - 140;
    // Global Listener
    window.addEventListener('resize', function() {
      $rootScope.heightMinusNavs = window.innerHeight - 140;
    });

    // Share
    // 
    $rootScope.shareLink = function() {
      ngDialog.open({
        template: '<p>Share This Link</p><input id="shareDialog" type="text" value="' + $location.absUrl() + '" class="form-control">',
        scope: $rootScope,
        plain: true
      });
      $setTimeout(function() {
        $('#shareDialog').focus();
      }, 1000);

    };

  }).constant('angularMomentConfig', {
    timezone: 'Europe/Madrid' // optional
  });