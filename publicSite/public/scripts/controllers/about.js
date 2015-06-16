'use strict';

/**
 * @ngdoc function
 * @name elbulliApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the elbulliApp
 */
angular.module('elbulliApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
