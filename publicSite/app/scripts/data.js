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
  .run(function($rootScope, Server) {

    $rootScope.months = [{
      year: 2015,
      month: '07',
      imageVideo: Server.getMonthlyThumb('07012015', true, 0),
      imageScan: Server.getMonthlyThumb('07012015', false, 0),
      isActive: (moment().unix() - moment('07012015', 'MMDDYYYY').unix() >= 0) ? true : false
    },{
      year: 2015,
      month: '08',
      imageVideo: Server.getMonthlyThumb('08012015', true, 1),
      imageScan: Server.getMonthlyThumb('08012015', false, 1),
      isActive: (moment().unix() - moment('08012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '09',
      imageVideo: Server.getMonthlyThumb('09012015', true, 2),
      imageScan: Server.getMonthlyThumb('09012015', false, 2),
      isActive: (moment().unix() - moment('09012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '10',
      imageVideo: Server.getMonthlyThumb('10012015', true, 3),
      imageScan: Server.getMonthlyThumb('10012015', false, 3),
      isActive: (moment().unix() - moment('10012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '11',
      imageVideo: Server.getMonthlyThumb('11012015', true, 4),
      imageScan: Server.getMonthlyThumb('11012015', false, 4),
      isActive: (moment().unix() - moment('11012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '12',
      imageVideo: Server.getMonthlyThumb('12012015', true, 5),
      imageScan: Server.getMonthlyThumb('12012015', false, 5),
      isActive: (moment().unix() - moment('12012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '01',
      imageVideo: Server.getMonthlyThumb('01012016', true, 6),
      imageScan: Server.getMonthlyThumb('01012016', false, 6),
      isActive: (moment().unix() - moment('01012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '02',
      imageVideo: Server.getMonthlyThumb('02012016', true, 7),
      imageScan: Server.getMonthlyThumb('02012016', false, 7),
      isActive: (moment().unix() - moment('02012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '03',
      imageVideo: Server.getMonthlyThumb('03012016', true, 8),
      imageScan: Server.getMonthlyThumb('03012016', false, 8),
      isActive: (moment().unix() - moment('03012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '04',
      imageVideo: Server.getMonthlyThumb('04012016', true, 9),
      imageScan: Server.getMonthlyThumb('04012016', false, 9),
      isActive: (moment().unix() - moment('04012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '05',
      imageVideo: Server.getMonthlyThumb('05012016', true, 10),
      imageScan: Server.getMonthlyThumb('05012016', false, 10),
      isActive: (moment().unix() - moment('05012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '06',
      imageVideo: Server.getMonthlyThumb('06012016', true, 11),
      imageScan: Server.getMonthlyThumb('06012016', false, 11),
      isActive: (moment().unix() - moment('06012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '07',
      imageVideo: Server.getMonthlyThumb('07012016', true, 12),
      imageScan: Server.getMonthlyThumb('07012016', false, 12),
      isActive: (moment().unix() - moment('07012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }];

    setTimeout(function() {
      console.log($rootScope.months)
    }, 10000)
  });