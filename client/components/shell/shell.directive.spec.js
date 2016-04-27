'use strict';

describe('Directive: shell', function () {

  // load the directive's module
  beforeEach(module('spaceappsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<shell></shell>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the shell directive');
  }));
});