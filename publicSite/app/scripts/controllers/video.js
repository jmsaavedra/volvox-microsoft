'use strict';

/**
 * @ngdoc function
 * @name elbulliApp.controller:VideoCtrl
 * @description
 * # VideoCtrl
 * Controller of the elbulliApp
 */
var moment = moment || {};
angular.module('elbulliApp')
  .controller('VideoYearCtrl', function($scope, $rootScope, $timeout, $stateParams, $state) {
    // console.log('Video year');
  })
  .controller('VideoMonthCtrl', function($scope, $rootScope, $stateParams, Server, $timeout, $state) {
    // console.log('Video month');
    // console.log($stateParams.month + ' 01 ' + $stateParams.year);
    $scope.thisMonth = moment($stateParams.year + '-' + $stateParams.month + '-01').format('MMMM, YYYY');
    $scope.isInProgress = ($stateParams.month === moment().format('MM')) ? true : false;
    // console.log($scope.isInProgress);
    // Get Videos for this month
    Server.getMonthlyAsset(
      $scope.thisMonth,
      true,
      function(result) {
        if (result.data.length == 0) {
          $state.go('video');
        } else {
          $scope.videos = result.data.sort(function(a, b) {
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
        $state.go('video', {
          lang: $rootScope.lang
        });
      });
  })
  .controller('VideoDayCtrl', function($scope, $rootScope, $stateParams, Server, $timeout, $location, $state) {
    $scope.shareUrl = encodeURIComponent($location.absUrl());
    // After loading all vimeos
    // Get width
    $scope.getVimeoHeight = function() {
      $('#vimeo_final').attr({
        height: $('#vimeo_final').width() * 9 / 16
      });
      $('.vimeo_cam').attr({
        height: $('#vimeo_cam').width() * 9 / 16
      });
    };

    $(window).on('resize', function() {
      $scope.getVimeoHeight();
    });

    $scope.queryDate = $stateParams.year + '-' + $stateParams.month + '-' + $stateParams.day;
    // Get video from vimeo
    Server.getAssetsFromDate($scope.queryDate, true, function(result) {
      // Success
      $scope.video_content = result.data;
      $scope.description = result.description;
      // console.log($scope.video_content);
      // DOM Ready fix
      $timeout(function() {
        $scope.getVimeoHeight();
        // Back to month view
        var vimeo_player_url = 'https://player.vimeo.com/video/';
        $scope.currentMonth = moment($scope.video_content.date).format('MM');
        $scope.currentYear = moment($scope.video_content.date).format('YYYY');
        $scope.vimeo_final_url = vimeo_player_url + $scope.video_content.vimeo_final.vimeo_video_id;
        $scope.vimeo_cam0_url = vimeo_player_url + $scope.video_content.cam0.vimeo_video_id;
        $scope.vimeo_cam1_url = vimeo_player_url + $scope.video_content.cam1.vimeo_video_id;
        $scope.vimeo_cam2_url = vimeo_player_url + $scope.video_content.cam2.vimeo_video_id;
        $scope.vimeo_cam3_url = vimeo_player_url + $scope.video_content.cam3.vimeo_video_id;
      });
    }, function(error) {
      // Fail
      // alert('There is no data for this date.');
      $state.go('video');
    });
  });