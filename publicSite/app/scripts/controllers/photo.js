'use strict';

/**
 * @ngdoc function
 * @name elbulliApp.controller:PhotoCtrl
 * @description
 * # PhotoCtrl
 * Controller of the elbulliApp
 */
var moment = moment || {};
angular.module('elbulliApp')
  .controller('PhotoYearCtrl', function($scope, $rootScope, $timeout, $stateParams, $state) {
    $rootScope.title = 'elBulliLab Scan Gallery';
  })
  .controller('PhotoMonthCtrl', function($scope, $rootScope, $stateParams, Server, $timeout, $state) {
    // console.log('Photo month');
    $scope.thisMonth = moment($stateParams.year + '-' + $stateParams.month + '-01').format('MMMM, YYYY');
    $rootScope.title = 'elBulliLab Scan Gallery ' + $scope.thisMonth;
    $scope.isInProgress = ($stateParams.month === moment().format('MM')) ? true : false;
    // Get Videos for this month
    Server.getMonthlyAsset(
      $scope.thisMonth,
      false, // Query Scan Model
      function(result) {
        if (result.data.length == 0) {
          $state.go('photo');
        } else {
          $scope.photos = result.data.sort(function(a, b) {
            return a.date.substr(a.date.length - 2, a.date.length) - b.date.substr(b.date.length - 2, b.date.length);
          });
          $timeout(function() {
            $scope.equalWidth = angular.element('.thumbnail-container').width();
          }, 0);
        }
      },
      function(error) {
        // if (error) alert(error);
        // alert(error);
        $state.go('photo', {
          lang: $rootScope.lang
        });
      });
  })
  .controller('PhotoDayCtrl', function($scope, $rootScope, $stateParams, Server, $timeout, $location) {
    $scope.queryDate = $stateParams.year + '-' + $stateParams.month + '-' + $stateParams.day;
    $rootScope.title = 'elBulliLab Scan Gallery ' + $scope.queryDate;
    $scope.shareUrl = encodeURIComponent($location.absUrl());
    var feedUrl = encodeURI('http://www.facebook.com/dialog/feed?app_id=1619939151578943&display=popup&description=' + $rootScope.title + '&redirect_uri=http://facebook.com&link=');
    $scope.fullFacebookShareUrl = (feedUrl + $scope.shareUrl);
    // Get video from vimeo
    Server.getAssetsFromDate($scope.queryDate, false, function(result) {
      // Success
      // console.log(result)
      if (result.data.length == 0) {
        $state.go('photo');
      } else {
        $scope.photo = result.data
        $scope.currentMonth = moment($scope.photo.date).format('MM');
        $scope.currentYear = moment($scope.photo.date).format('YYYY');
      }

    }, function(error) {
      // Fail
      // alert('There is no data for this date.');
    });
  });