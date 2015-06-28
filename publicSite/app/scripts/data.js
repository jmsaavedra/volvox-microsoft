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
      year: 2015,
      month: '06',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('june 1 2015', 'MMMM DD YYYY').unix() >= 0) ? true : false
    },{
      year: 2015,
      month: '07',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('july 1 2015', 'MMMM DD YYYY').unix() >= 0) ? true : false
    },{
      year: 2015,
      month: '08',
      image: 'http://placehold.it/300x300',
      isActive: false
    }, {
      year: 2015,
      month: '09',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('september 1 2015', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '10',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('october 1 2015', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '11',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('november 1 2015', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '12',
      image: 'http://placehold.it/300x300',
      isActive: false
    }, {
      year: 2016,
      month: '01',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('january 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '02',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('february 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '03',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('march 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '04',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('april 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '05',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('may 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '06',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('june 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '07',
      image: 'http://placehold.it/300x300',
      isActive: (moment().unix() - moment('july 1 2016', 'MMMM DD YYYY').unix() >= 0) ? true : false
    }];
  });