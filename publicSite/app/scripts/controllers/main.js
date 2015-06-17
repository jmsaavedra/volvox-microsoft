'use strict';

/**
 * @ngdoc function
 * @name elbulliApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the elbulliApp
 */
angular.module('elbulliApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
