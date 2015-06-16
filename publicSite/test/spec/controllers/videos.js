'use strict';

describe('Controller: VideosCtrl', function () {

  // load the controller's module
  beforeEach(module('elbulliApp'));

  var VideosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideosCtrl = $controller('VideosCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
