'use strict';
var timelineWidth = 960,
    timelineHeight = 60;
angular.module('spaceappsApp')
  .directive('timeline', function () {  
    return {
      templateUrl: 'components/dashboard/timeline/timeline.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        // Input date
        scope.startDate = d3.time.day.ceil(new Date());
        scope.endDate = d3.time.day.ceil(new Date());
        // Output date
        scope.selDate = new Date();
          
        var margin = {top: 5, right: 15, bottom: 5, left: 15},
            width = timelineWidth - margin.left - margin.right,
            height = timelineHeight - margin.top - margin.bottom;

        var today =  scope.startDate,
            startDay = scope.endDate;
          if(today<= startDay){
              startDay.setDate(today.getDate() - 21);
          }

//        debugger;
          
        var x = d3.time.scale()
            .domain([startDay, today])
            .range([0, width]);

        var brush = d3.svg.brush()
            .x(x)
            .extent([0,0])
            .on("brushend", brushed);

        var svg = d3.select("#timelineBrush")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height / 2 + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom")
//                .tickFormat(function(d) { return d + "°"; })
                .tickSize(6)
                .ticks(d3.time.days)
                .tickPadding(6)  // 12
            )
          .selectAll("text")
            .attr("x", 6)
            .style("text-anchor", null)
          .select(".domain")
          .select(function() { 
                return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "halo");

        var slider = svg.append("g")
            .attr("class", "slider")
            .call(brush);

        slider.selectAll(".extent,.resize").remove();

        slider.select(".background")
            .attr("height", height);

        var handle = slider.append("circle")
            .attr("class", "handle")
            .attr("transform", "translate(0," + (height / 2 - 4) + ")")
            .attr("r", 11);

        console.log(brush.extent());
        slider.call(brush.event)
            .transition() // gratuitous intro!
            .duration(750)
            .call(brush.extent([startDay, startDay]))
            .call(brush.event);

        function brushed() {
            console.log(brush.extent());
          var value = brush.extent()[0];

          if (d3.event.sourceEvent) { // not a programmatic event
//            value = d3.time.day.ceil(x.invert(d3.mouse(this)[0]));
            value = x.invert(d3.mouse(this)[0]);
            brush.extent([value, value]);
          }

          handle.attr("cx", x(value));
            scope.selDate  = value;
        } // brushed
      }
    };
  }) // Timeline Directiver
  .directive('myDirective', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            console.log("timeLine width: "+  element[0].offsetWidth);
            timelineWidth = element[0].offsetWidth - 16*2;
        }
    };
  });
