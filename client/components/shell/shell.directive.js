'use strict';

angular.module('spaceappsApp')
  .directive('shell', function () {
     return {
            templateUrl: 'components/shell/shell.html',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '=title'
            },
            link: function (scope, element, attrs) {}
        };
    });