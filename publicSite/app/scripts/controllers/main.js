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

    // Scroll to Technical Detail
    $scope.scrollToTechnical = function() {
      // $uiViewScroll(angular.element('#technical-detail'));
      $('[ui-view]').animate({
        scrollTop: $('#technical-detail').offset().top
      });
    };

  });