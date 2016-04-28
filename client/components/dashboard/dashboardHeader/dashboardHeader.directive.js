'use strict';

angular.module('spaceappsApp')
  .directive('dashboardHeader', function () {
    return {
      templateUrl: 'components/dashboard/dashboardHeader/dashboardHeader.html',
      restrict: 'E',
      transclude: true,
      scope: {
          title: "=title"
      },
      link: function (scope, element, attrs) {
      }
    };
  });