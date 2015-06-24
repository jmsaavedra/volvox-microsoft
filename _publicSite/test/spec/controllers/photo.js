'use strict';

describe('Controller: PhotoCtrl', function () {

  // load the controller's module
  beforeEach(module('elbulliApp'));

  var PhotoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhotoCtrl = $controller('PhotoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
