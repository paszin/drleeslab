'use strict';

var cloudCardWid;

angular.module('spaceappsApp')
  .controller('MainCtrl', function ($scope, $http, $location, $interval) {

    $scope.center = {};
    $scope.layers = {};
    $scope.tiles = {};
    $scope.tiles.url = "";
    $scope.twitterSentimentDataAll = [];

    var twitter = "http://nodetest123.mybluemix.net/";
    var imageLookup = {"EONET_368": "houston_flood_image.jpg", "katrina": "katrina_2009.jpg"};
    var twitterLookup = {"EONET_368": "houstonflood", "EONET_56": "fuego_volcano_all"};

    //TWITTER SENTIMENT
    var twitterSentimentUrl = "http://localhost:5000/twitter_sentiment?query=";

    function getTwitterSentimentData(searchterm) {
        $http.get(twitterSentimentUrl + searchterm).then(function(resp) {
            $scope.twitterSentimentDataAll = resp.data.result;
            $interval(function() {
                c += 1;
                getTwitterSentiment(["2016-04-20", "2016-04-22"][c%2]);
            }, 1000);
        });
    }

    function getTwitterSentiment(date) {
        var extractedData = _.find($scope.twitterSentimentDataAll, {date: date});
        $scope.twitterSentimentData = [
            {
                key: "positive",
                y: extractedData.positive
            },
            {
                key: "neutral",
                y: extractedData.neutral
            },
            {
                key: "negativ",
                y: extractedData.negative
            }
        ];
    }
    var c = 0;
    getTwitterSentimentData("houstonflood");


    var eventUrl = $location.search()["link"];

    $http.get(eventUrl).success(function(event) {
        console.log(event);
        $scope.event = event;

        drawRealTimeMap($scope, event);

//        drawRealTimeMap($scope, event);
        drawMapboxHeatMap($scope, $http, event);
        //image
        $scope.imagePath = "assets/images/" + imageLookup[event.id];

        //GET TWITTER
        $scope.sentiment = 0
        $scope.sentimentData = {};
        console.log(twitter + twitterLookup[event.id]);

        $http.get(twitter + twitterLookup[event.id]).then(function successCallback(response) {
            response.data.forEach(function(tweet) {
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
            twiData.values.sort(function(a, b) {
                return parseFloat(a.label) - parseFloat(b.label);
            })
            console.log(twiData.values);

            $scope.twiiterData.push(twiData);
            console.log($scope.twiiterData);

//             drawRealTimeMap($scope, event);
        }, function errorCallback(response) { // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

        //GET TRENDS
        //clean event title
        var title = event.title.split(",")[0];

        var trendsUrl = "http://localhost:5000/correlated_queries?event=" + title + "&place=us&limit=40";
        $http.get(trendsUrl).success(function(result) {

          var keywords = result.results;
          console.log(keywords);

          d3.layout.cloud().size([cloudCardWid, 300])
                .words(keywords.map(function(d, i) {
                  return {text: d, size: 2.2*i+1};
                }))
             .rotate(function() { return 0;})
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
                    height: 300,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
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

    $scope.options = {
            chart: {
                type: 'lineChart',
                height: 300,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){ return d[0]; },
                y: function(d){  return d[1]; },
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
                    axisLabelDistance: 20
                }
            }
        };

    // Code for loading JSON files
    $http.get('./app/main/sources/three_metric_new.csv').success(function(history){
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
//.controller('chartController', function($scope, $scope){
//
//};

function drawMapboxHeatMap($scope, $http, event){
    console.log(event.geometries[0].coordinates[0]);
    var curLng, curLat;
    if(typeof event.geometries[0].coordinates[0] === "object"){
        curLng = event.geometries[0].coordinates[0][1][0];
        curLat = event.geometries[0].coordinates[0][1][1];
    }else{
        curLng = event.geometries[0].coordinates[0];
        curLat = event.geometries[0].coordinates[1];
    }
    var points = [];
    var heatmap = {
        name: 'Heat Map',
        type: 'heat',
        data: points,
        visible: true
    };
    $http.get("assets/jsons/heat-points.json").success(function(data) {
        console.log(data);
        $scope.layers.overlays = {
            heat: {
                name: 'Heat Map',
                type: 'heat',
                data: data,
                layerOptions: {
                    radius: 20,
                    blur: 10
                },
                visible: true
            }
        };
    }); // Fake data
    angular.extend($scope, {
        center: {
            lat: 37.774546,
            lng: -122.433523,
            zoom: 12
        },
        layers: {
            baselayers: {
                mapbox_light: {
                    name: 'Mapbox Light',
//                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    url: 'https://api.mapbox.com/styles/v1/sweetymeow/cinjy5pbt003paem5son415hv/tiles/{z}/{x}/{y}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: 'pk.eyJ1Ijoic3dlZXR5bWVvdyIsImEiOiJjNDQzMzcxMjU0YmIzZDFiYTVkMzI0ZjAxMWU1NDhjNSJ9.Nt5jMK8zq1iBMJwUbbg7TQ',
                        mapid: 'cinjy5pbt003paem5son415hv'
                    }
                }
            }
        },
        markers: {
            center: {
                lat: 37.774546,
                lng: -122.433523,
                focus: true,
                draggable: false,
                message: "<b>" + event.title + "</b>."
            }
        }
    }); // angular.extend
//    }]);
}

function drawRealTimeMap($scope, event){
    console.log(event.geometries[0].coordinates[0]);
    var curLng, curLat;
    if(typeof event.geometries[0].coordinates[0] === "object"){
        curLng = event.geometries[0].coordinates[0][1][0];
        curLat = event.geometries[0].coordinates[0][1][1];
    }else{
        curLng = event.geometries[0].coordinates[0];
        curLat = event.geometries[0].coordinates[1];
    }

    angular.extend($scope, {
        center: {
          lat: curLat,
          lng: curLng,
          zoom: 8
        }, tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        defaults: {
            zoomAnimation: false,
            markerZoomAnimation: false,
            fadeAnimation: false
        },
        markers: {
            center: {
              lat: curLat,
              lng: curLng,
                focus: true,
                draggable: false,
                message: "<b>" + event.title + "</b>."
            }
        }
      });

    $scope.$watch("center.zoom", function(zoom) {
        $scope.tiles.url = (zoom > 12)
                ? "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                : "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    });
}

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
