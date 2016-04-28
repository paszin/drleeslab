'use strict';

angular.module('spaceappsApp')
  .directive('twitterFeed', function () {
    return {
      templateUrl: 'components/dashboard/twitterFeed/twitterFeed.html',
      restrict: 'E',
      scope: {
          'tweetids': '=tweetids'
      },
      link: function (scope, element, attrs) {
      }
    };
  });