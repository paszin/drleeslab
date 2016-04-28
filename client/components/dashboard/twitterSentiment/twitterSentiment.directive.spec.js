'use strict';

describe('Directive: twitterSentiment', function () {

  // load the directive's module and view
  beforeEach(module('spaceappsApp'));
  beforeEach(module('components/dashboard/twitterSentiment/twitterSentiment.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<twitter-sentiment></twitter-sentiment>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the twitterSentiment directive');
  }));
});