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
      month: '06',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('06012015', false, 0),
      isActive: (moment().unix() - moment('06012015', 'MMDDYYYY').unix() >= 0) ? true : false
    },{
      year: 2015,
      month: '07',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('07012015', false, 1),
      isActive: (moment().unix() - moment('07012015', 'MMDDYYYY').unix() >= 0) ? true : false
    },{
      year: 2015,
      month: '08',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('08012015', false, 2),
      isActive: (moment().unix() - moment('08012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '09',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('09012015', false, 3),
      isActive: (moment().unix() - moment('09012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '10',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('10012015', false, 4),
      isActive: (moment().unix() - moment('10012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '11',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('11012015', false, 5),
      isActive: (moment().unix() - moment('11012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2015,
      month: '12',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('12012015', false, 6),
      isActive: (moment().unix() - moment('12012015', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '01',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('01012016', false, 7),
      isActive: (moment().unix() - moment('01012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '02',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('02012016', false, 8),
      isActive: (moment().unix() - moment('02012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '03',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('03012016', false, 9),
      isActive: (moment().unix() - moment('03012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '04',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('04012016', false, 10),
      isActive: (moment().unix() - moment('04012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '05',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('05012016', false, 11),
      isActive: (moment().unix() - moment('05012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '06',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('06012016', false, 12),
      isActive: (moment().unix() - moment('06012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }, {
      year: 2016,
      month: '07',
      imageVideo: 'images/grey_bg.png',
      image: Server.getMonthlyScanThumb('07012016', false, 13),
      isActive: (moment().unix() - moment('07012016', 'MMDDYYYY').unix() >= 0) ? true : false
    }];
  });