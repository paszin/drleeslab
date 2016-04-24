'use strict';

var cloudCardWid;

angular.module('spaceappsApp')
  .controller('MainCtrl', function ($scope, $http, $location) {

    var twitter = "http://nodetest123.mybluemix.net/";
    var imageLookup = {"EONET_368": "houston_flood_image.jpg", "katrina": "katrina_2009.jpg"};
    var twitterLookup = {"EONET_368": "houstonflood"};

    var eventUrl = $location.search()["link"];
    $http.get(eventUrl).success(function(event) {
      $scope.event = event;
    //image
    $scope.imagePath = "assets/images/" + imageLookup[event.id];

        //GET TWITTER
        $scope.sentiment = 0
        $scope.sentimentData = {};
        $http.get(twitter + twitterLookup[event.id]).success(function(data) {
            data.forEach(function(tweet) {
                $scope.sentiment += tweet.sentiment.score+4;
                if (!$scope.sentimentData.hasOwnProperty(""+tweet.sentiment.score)) {
                    $scope.sentimentData[""+tweet.sentiment.score] = 0;
                }
                $scope.sentimentData[""+tweet.sentiment.score] += 1;
            });
            $scope.sentiment = ($scope.sentiment/data.length)/8*100;

            $scope.twiiterData = [];
            var twiData = {};
            twiData.key = "Cumulative Return";
            twiData.values = [];

            for(var d in $scope.sentimentData){
                var newData = {};
                newData.label = d;
                newData.value = $scope.sentimentData[d];
                twiData.values.push(newData);
            };
            $scope.twiiterData.push(twiData);
            console.log($scope.twiiterData);
        });

        //GET TRENDS
        //clean event title
        var title = event.title.split(",")[0];
        var trendsUrl = "http://localhost:5000/correlated_queries?event=" + title + "&place=us";

        // Draw words cloud
        $http.get(trendsUrl).success(function(result) {
              var keywords = result.results;
              console.log(keywords);

              d3.layout.cloud().size([cloudCardWid, 300])
                .words(keywords.map(function(d) {
                  return {text: d, size: 10 + Math.random() * 50};
                }))
                 .rotate(function() { return ~~(Math.random() * 2) * 90; })
                 .font("Impact")
                 .fontSize(function(d) { return d.size; })
                 .on("end", draw)
                 .start();
        });// Draw words cloud

        console.log($scope.sentiment);
        console.log($scope.sentimentData);
        // debugger;
        $scope.twiiterOptions = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function(d){return d.label;},
                    y: function(d){return d.value + (1e-10);},
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',.4f')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: 'X Axis'
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        axisLabelDistance: -10
                    }
                }
            };

      }); // $scope.sentiment

    $scope.satImgPath = "app/main/sources/houston_flood_image.jpg";
    $scope.sceneImgPath = "app/main/sources/katrina_2009.jpg";

    $scope.options = {
            chart: {
                type: 'cumulativeLineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){
                    return d[0];
                },
                y: function(d){
                    return d[1];
                },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                duration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        // console.log(d);
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        // return d3.format(',.1%')(d);
                        return d;
                    },
                    axisLabelDistance: 20
                }
            }
        };
    // Code for loading JSON files
    $http.get('./app/main/sources/three_metric.csv').success(function(history){
        var data = d3.csv.parse(history);
        // console.log(data);
        var headList = Object.keys(data[0]);
        console.log(headList);
        data.map(function(d){
            var newData = [];
            d.Index = Number(d.Index);
            d.Date = Date.parse(d.Date);
            for(var i = 2 ; i < headList.length; i++){
              d[headList[i]] = Number(d[headList[i]]);
            }
        });
        console.log(data[0]);

        var nestData = [];
        for(var i = 2 ; i < headList.length; i++){
          var chartObj = {};
          chartObj.key = headList[i];
          chartObj.values = [];
          // chartObj.max = d3.max(data.map(function(item){ return item[headList[i]]; }));
          // chartObj.min = d3.min();

          data.map(function(d){
              var newData = [];
              newData[0] = d.Date;
              newData[1] = d[headList[i]];

              chartObj.values.push(newData);
          });

          nestData.push(chartObj);
        }

        console.log(data[0]);
        console.log(nestData);
        $scope.data  = nestData;
    }); // create data for line chart

  }) // angular.controller
  .directive('myDirective', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            console.log(element[0].offsetWidth);
            cloudCardWid = element[0].offsetWidth - 16*2;
        }
    };
  });
  // .controller('chartController', function($scope, $scope){
 // Draw words cloud
 function draw(words) {
   var fill = d3.scale.category20();

   console.log("Draw function - card width: " + cloudCardWid);

   d3.select("#d3WordCloud").append("svg")
       .attr("width", cloudCardWid)
       .attr("height", 300)
     .append("g")
       .attr("transform", "translate("+ cloudCardWid/2 + ",150)")
     .selectAll("text")
       .data(words)
     .enter().append("text")
       .style("font-size", function(d) { return d.size + "px"; })
       .style("font-family", "Impact")
       .style("fill", function(d, i) { return fill(i); })
       .attr("text-anchor", "middle")
       .attr("transform", function(d) {
         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
       })
       .text(function(d) { return d.text; });
 }
