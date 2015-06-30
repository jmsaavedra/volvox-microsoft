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
  .controller('PhotoYearCtrl', function($scope, $rootScope, $timeout, $stateParams, $state) {})
  .controller('PhotoMonthCtrl', function($scope, $rootScope, $stateParams, Server, $timeout, $state) {
    // console.log('Photo month');
    $scope.thisMonth = moment($stateParams.year + '-' + $stateParams.month + '-01').format('MMMM, YYYY');

    // Dummy Data
    // $scope.photos = [{
    //   date: '2015-08-01',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '01'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }, {
    //   date: '2015-08-02',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '02'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }, {
    //   date: '2015-08-03',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '03'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }, {
    //   date: '2015-08-04',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '04'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }, {
    //   date: '2015-08-05',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '05'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }, {
    //   date: '2015-08-06',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '06'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }, {
    //   date: '2015-08-07',
    //   ymd: {
    //     y: '2015',
    //     m: '08',
    //     d: '07'
    //   },
    //   img: 'https://i.vimeocdn.com/video/522186194_640.jpg'
    // }];

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
  .controller('PhotoDayCtrl', function($scope, $rootScope, $stateParams, Server, $timeout) {

    $scope.queryDate = $stateParams.year + '-' + $stateParams.month + '-' + $stateParams.day;
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