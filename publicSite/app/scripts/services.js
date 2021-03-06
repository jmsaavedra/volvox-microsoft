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
var DEBUG = false;
var host = (DEBUG) ? 'http://localhost' : 'http://elbulliweb.cloudapp.net';

angular
  .module('app.services', [])
  // Get all videos in the current month
  // - month {Number}
  // - return {Array} of videos
  .factory('Server', function($http, $rootScope) {
    var service = {};

    service.getMonthlyAsset = function(monthString, isVideo, ok, fail) {
      var url = (isVideo) ? host + ':8080/timelapse/month/' : host + ':8080/scanner/month/';
      // Convert month into "XX"
      // console.log(monthString);
      var month = moment(monthString, 'MMMM, YYYY').format('YYYY-MM');
      // console.log(month);
      // GET REQUEST
      $http.get(url + month)
        .success(function(result) {
          console.log(result);
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

    service.getAssetsFromDate = function(dateString, isVideo, ok, fail) {
      var url = (isVideo) ? host + ':8080/timelapse/date/' : host + ':8080/scanner/date/';
      $http.get(url + dateString)
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


    /**
     * [getMonthlyScanThumb description]
     * @param  {[String]} dateString [MMDDYYYY]
     * @return {[String]}            [description]
     **/
    service.getMonthlyThumb = function(dateString, isVideo, scopeIndex) {
      if (moment().unix() - moment(dateString, 'MMDDYYYY').unix() >= 0) {
        var suffix = (isVideo) ? 'imageVideo' : 'imageScan';
        var url = (isVideo) ? host + ':8080/timelapse/thumbnail/' : host + ':8080/scanner/thumbnail/';
        $http.get(url + moment(dateString, 'MMDDYYYY').format('YYYY-MM'))
          .success(function(result) {
            console.log(result.data);
            if (result.data === false) {
              $rootScope.months[scopeIndex][suffix] = 'images/grey_bg.png';
            } else {
              $rootScope.months[scopeIndex][suffix] = result.data;
            }
          })
          .error(function(err) {
            return 'images/grey_bg.png';
          });
      }

    };

    return service;
  });