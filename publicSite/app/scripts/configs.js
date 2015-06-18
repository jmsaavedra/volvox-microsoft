'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Configs module of the application.
 */
angular
  .module('app.configs', [])
  .config(function($translateProvider) {
  	$translateProvider.useSanitizeValueStrategy('sanitize');
    // English
    $translateProvider.translations('en', {
      MAIN_TITLE: 'ENGLISH',
      MAIN_DESC: ''
    });
    // Spanish
    $translateProvider.translations('es', {
      MAIN_TITLE: 'SPANISH',
      MAIN_DESC: ''
    });
    ///////////
    $translateProvider.preferredLanguage('en');
  });