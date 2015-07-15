'use strict';

/**
 * @ngdoc function
 * @name elbulliApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the elbulliApp
 */
angular.module('elbulliApp')
  .controller('MainCtrl', function($rootScope, $scope, $timeout, $uiViewScroll) {
    $rootScope.title = 'elBulliLab Timelapse';
    // Scroll to Technical Detail
    $scope.scrollToTechnical = function() {
      // $uiViewScroll(angular.element('#technical-detail'));
      $('html, body').animate({
        scrollTop: $('#technical-detail').offset().top
      });
    };
    // Scroll to Welcome
    $scope.scrollToWelcome = function() {
      // $uiViewScroll(angular.element('#technical-detail'));
      $('html, body').animate({
        scrollTop: $('#welcome').offset().top
      });
    };

  });