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
  .controller('VideoCtrl', function($scope, $rootScope, $timeout, $stateParams, $state) {
    $scope.disallowSlide = function() {
      $rootScope.allowSlide = false;
      $timeout(function() {
        $rootScope.allowSlide = true;
      }, 0);
    };
    $scope.currentMonth = $stateParams.month;
    console.log($scope.currentMonth);
    /*********
     * WHEN SHOWING YEAR VIEW
     * $scope.currentMonth = ''
     *********/
    if ($scope.currentMonth == '') {

    } else if (moment($scope.currentMonth, 'MMMM', true).isValid() == true) {
      // Valid month input
      console.log('valid');
      // Executing show daily digest
    } else {
      // Invalid input
      $state.go('video', {
        month: ''
      });
    }
  });