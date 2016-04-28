'use strict';

describe('Directive: dashboardHeader', function () {

  // load the directive's module and view
  beforeEach(module('spaceappsApp'));
  beforeEach(module('components/dashboard/dashboardHeader/dashboardHeader.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dashboard-header></dashboard-header>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the dashboardHeader directive');
  }));
});