'use strict';

angular.module('spaceappsApp')
  .directive('twitterFeed', function () {
    return {
      templateUrl: 'components/dashboard/twitterFeed/twitterFeed.html',
      restrict: 'E',
      scope: {
          'tweetids': '=tweetids',
          'data': '=data'
      },
      link: function (scope, element, attrs) {
          scope.ids = [722389353218064384];
      }
    };
  });