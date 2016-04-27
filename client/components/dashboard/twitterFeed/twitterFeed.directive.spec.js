'use strict';

describe('Directive: twitterFeed', function () {

  // load the directive's module and view
  beforeEach(module('spaceappsApp'));
  beforeEach(module('components/dashboard/twitterFeed/twitterFeed.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<twitter-feed></twitter-feed>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the twitterFeed directive');
  }));
});