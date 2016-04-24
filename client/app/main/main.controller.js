'use strict';

var cloudCardWid;

angular.module('spaceappsApp')
  .controller('MainCtrl', function ($scope, $http, $location) {

    var twitter = "http://nodetest123.mybluemix.net/";
    var imageLookup = {"EONET_368": "houston_flood_image.jpg", "katrina": "katrina_2009.jpg"};
    var twitterLookup = {"EONET_368": "houstonflood", "EONET_56": "fuego_volcano_all"};

    var eventUrl = $location.search()["link"];
    $http.get(eventUrl).success(function(event) {
      $scope.event = event;
    //image
    $scope.imagePath = "assets/images/" + imageLookup[event.id];

        //GET TWITTER

        $scope.sentiment = 0
        $scope.sentimentData = {};
    console.log(twitter + twitterLookup[event.id]);
        $http.get(twitter + twitterLookup[event.id]).success(function(data) {
            data.forEach(function(tweet) {
                $scope.sentiment += tweet.sentiment.score+4;
                if (!$scope.sentimentData.hasOwnProperty(""+tweet.sentiment.score)) {
                    $scope.sentimentData[""+tweet.sentiment.score] = 0;
                }
                $scope.sentimentData[""+tweet.sentiment.score] += 1;
            });
            $scope.sentiment = ($scope.sentiment/data.length)/8*100;
        });

        //GET TRENDS
        //clean event title
        var title = event.title.split(",")[0];
        var trendsUrl = "http://localhost:5000/correlated_queries?event=" + title + "&place=us&limit=15";
        $http.get(trendsUrl).success(function(result) {

                      var keywords = result.results;
                      console.log(keywords);
                
                  d3.layout.cloud().size([cloudCardWid, 300])
                    .words(keywords.map(function(d, i) {
                      return {text: d, size: 0.3*i};
                    }))
                     .rotate(function() { return 0;})
                     .font("Impact")
                     .fontSize(function(d) { return d.size; })
                     .on("end", draw)
                     .start();

        });
      });

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
    $http.get('./app/main/sources/two_metric.csv').success(function(history){
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
        // var nestData = d3.nest().key(function(d){
        //     return d
        // })
    });
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
