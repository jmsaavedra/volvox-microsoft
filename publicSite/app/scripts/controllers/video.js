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
  .controller('VideoMonthCtrl', function($scope, $rootScope, $stateParams, Server) {
    $scope.thisMonth = $stateParams.month;
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
  .controller('VideoDayCtrl', function($scope, $rootScope) {

  });