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
    console.log('Video year');
    $scope.disallowSlide = function() {
      $rootScope.allowSlide = false;
      $timeout(function() {
        $rootScope.allowSlide = true;
      }, 0);
    };
  })
  .controller('VideoMonthCtrl', function($state, $scope, $rootScope, $stateParams, Server, $timeout) {
    console.log('Video month');
    // console.log($stateParams.month + ' 01 ' + $stateParams.year);
    $scope.thisMonth = moment($stateParams.year + '-' + $stateParams.month + '-01').format('MMMM, YYYY');
    console.log($scope.thisMonth);
    // Dummy Data
    /*
    $scope.videos = [{
      date: '2015-08-01',
      ymd: {
        y: '2015',
        m: '08',
        d: '01'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }, {
      date: '2015-08-02',
      ymd: {
        y: '2015',
        m: '08',
        d: '02'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }, {
      date: '2015-08-03',
      ymd: {
        y: '2015',
        m: '08',
        d: '03'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }, {
      date: '2015-08-04',
      ymd: {
        y: '2015',
        m: '08',
        d: '04'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }, {
      date: '2015-08-05',
      ymd: {
        y: '2015',
        m: '08',
        d: '05'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }, {
      date: '2015-08-06',
      ymd: {
        y: '2015',
        m: '08',
        d: '06'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }, {
      date: '2015-08-07',
      ymd: {
        y: '2015',
        m: '08',
        d: '07'
      },
      img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    }];
    */

    // Get Videos for this month
    Server.getMonthlyAsset(
      $scope.thisMonth,
      true,
      function(result) {
        $scope.videos = result.data;
        $timeout(function() {
          $scope.equalWidth = angular.element('.thumbnail-container').width();
        }, 0);

        console.info($scope.videos);
      }, function(error) {
        if (error) alert(error);
        // alert(error);
        $state.go('video', {
          lang: $rootScope.lang
        });
      });
  })
  .controller('VideoDayCtrl', function($scope, $rootScope, $stateParams, Server, $timeout) {

    /*** DUmmy ***/
    /*
    $scope.video_content = {
      date: '2015-06-07',
      description: 'Lorem ipsum Irure do labore laboris in laboris eu magna aliquip sed dolor culpa id enim est cupidatat qui in sed ad exercitation adipisicing fugiat incididunt culpa sit proident Duis non dolor adipisicing cupidatat sunt cillum culpa quis adipisicing magna incididunt.',
      vimeo_final: {
        vimeo_video_id: '27243869'
      },
      cam0: {
        vimeo_video_id: '27243869'
      },
      cam1: {
        vimeo_video_id: '27243869'
      },
      cam2: {
        vimeo_video_id: '27243869'
      },
      cam3: {
        vimeo_video_id: '27243869'
      }
    };
    */
    // TO CONTINUE

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
      $scope.data = result.data;
      // DOM Ready fix
      $timeout(function() {
        $scope.getVimeoHeight();
        // Back to month view
        var vimeo_player_url = 'https://player.vimeo.com/video/';
        $scope.currentMonth = moment($scope.data.date).format('MM');
        $scope.currentYear = moment($scope.data.date).format('YYYY');
        $scope.vimeo_final_url = vimeo_player_url + $scope.data.vimeo_final.vimeo_video_id;
        $scope.vimeo_cam0_url = vimeo_player_url + $scope.data.cam0.vimeo_video_id;
        $scope.vimeo_cam1_url = vimeo_player_url + $scope.data.cam1.vimeo_video_id;
        $scope.vimeo_cam2_url = vimeo_player_url + $scope.data.cam2.vimeo_video_id;
        $scope.vimeo_cam3_url = vimeo_player_url + $scope.data.cam3.vimeo_video_id;
      });
    }, function(error) {
      // Fail
      alert('There is no data for this date.');
    });
  });