'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Services module of the application.
 */
var moment = moment || {};
angular
  .module('app.services', [])
// Get all videos in the current month
// - month {Number}
// - return {Array} of videos
.factory('Server', function($http, $rootScope) {
  var service = {};

  service.getMonthlyAsset = function(monthString, isVideo, ok, fail) {
    var url = (isVideo) ? 'http://elbulliweb.cloudapp.net:8080/timelapse/month/' : 'http://elbulliweb.cloudapp.net:8080/scanner/month/';
    // Convert month into "XX"
    var month = moment(monthString + ' 2015', 'MMMM YYYY').format('MM');
    // GET REQUEST
    $http.get(url + month)
      .success(function(result) {
        if (ok) {
          ok(result);
        }
      })
      .error(function(err) {
        if (fail) {
          fail(err);
        }
      });
  };

  return service;
});