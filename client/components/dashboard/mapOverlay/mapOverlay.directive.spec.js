'use strict';

describe('Directive: mapOverlay', function () {

  // load the directive's module and view
  beforeEach(module('spaceappsApp'));
  beforeEach(module('components/dashboard/mapOverlay/mapOverlay.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map-overlay></map-overlay>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the mapOverlay directive');
  }));
});