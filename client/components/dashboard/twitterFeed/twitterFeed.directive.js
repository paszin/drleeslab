'use strict';

angular.module('spaceappsApp')
  .directive('twitterFeed', function () {
    return {
      templateUrl: 'components/dashboard/twitterFeed/twitterFeed.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });