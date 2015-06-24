'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Data module of the application.
 */
var moment = moment || {};
angular
  .module('app.data', [])
  .run(function($rootScope) {

    $rootScope.months = [{
      month: 'august',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('august 1 2015').unix() >= 0) ? true : false
    }, {
      month: 'september',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('september 1 2015').unix() >= 0) ? true : false
    }, {
      month: 'october',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('october 1 2015').unix() >= 0) ? true : false
    }, {
      month: 'november',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('november 1 2015').unix() >= 0) ? true : false
    }, {
      month: 'december',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('december 1 2015').unix() >= 0) ? true : false
    }, {
      month: 'january',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('january 1 2016').unix() >= 0) ? true : false
    }, {
      month: 'february',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('february 1 2016').unix() >= 0) ? true : false
    }, {
      month: 'march',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('march 1 2016').unix() >= 0) ? true : false
    }, {
      month: 'april',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('april 1 2016').unix() >= 0) ? true : false
    }, {
      month: 'may',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('may 1 2016').unix() >= 0) ? true : false
    }, {
      month: 'june',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('june 1 2016').unix() >= 0) ? true : false
    }, {
      month: 'july',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('july 1 2016').unix() >= 0) ? true : false
    }];
  });