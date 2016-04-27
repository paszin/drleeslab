'use strict';

angular.module('spaceappsApp')
  .directive('mapOverlay', function () {
    return {
      templateUrl: 'components/dashboard/mapOverlay/mapOverlay.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });