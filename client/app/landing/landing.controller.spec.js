'use strict';

describe('Controller: LandingCtrl', function () {

  // load the controller's module
  beforeEach(module('spaceappsApp'));

  var LandingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LandingCtrl = $controller('LandingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
