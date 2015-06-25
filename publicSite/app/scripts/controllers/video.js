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
    $scope.disallowSlide = function() {
      $rootScope.allowSlide = false;
      $timeout(function() {
        $rootScope.allowSlide = true;
      }, 0);
    };
  })
  .controller('VideoMonthCtrl', function($scope, $rootScope, $stateParams, Server, $timeout) {
    $scope.thisMonth = moment($stateParams.month + ' 01 ' + $stateParams.year).format('MMMM, YYYY');

    // Dummy Data
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

    $timeout(function() {
      $scope.equalWidth = angular.element('.thumbnail-container').width();
    }, 0);

    // Get Videos for this month
    // Server.getMonthlyAsset(
    //   $scope.thisMonth,
    //   true,
    //   function(result) {
    //     $scope.videos = result;
    //     // console.log($scope.videos);

    //   }, function(error) {
    //     alert(error);
    //   });
  })
  .controller('VideoDayCtrl', function($scope, $rootScope, $stateParams, Server) {

    /*** DUmmy ***/
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
    // $scope.video_content.vimeo_final.vimeo_video_id = 
    // TO CONTINUE

    $scope.queryDate = $stateParams.year + '-' + $stateParams.month + '-' + $stateParams.day;
    // Get video from vimeo
    Server.getAssetsFromDate($scope.queryDate, true, function(result) {
      // Success
      $scope.data = result;

    }, function(error) {
      // Fail
      alert('There is no data for this date.');
    });
  });