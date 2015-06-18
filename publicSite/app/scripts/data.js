'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Data module of the application.
 */
angular
  .module('app.data', [])
  .run(function($rootScope) {
    $rootScope.months = [{
      month: 'august',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'september',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'october',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'november',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'december',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'january',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'february',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'march',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'april',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'may',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'june',
      image: 'http://placehold.it/300x300'
    }, {
      month: 'july',
      image: 'http://placehold.it/300x300'
    }];
  });