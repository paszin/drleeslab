'use strict';

angular.module('spaceappsApp')
  .directive('twitterSentiment', function () {
    return {
      templateUrl: 'components/dashboard/twitterSentiment/twitterSentiment.html',
      restrict: 'E',
      scope: {data: "=data"},
      link: function (scope, element, attrs) {
          scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                transitionDuration: 500,
                showLegend: false,
                color: ['#64A389', '#7bb5F4', '#924861']
            }
        };
      }
    };
  });