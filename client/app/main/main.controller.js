'use strict';

var cloudCardWid;

angular.module('spaceappsApp')
  .controller('MainCtrl', function ($scope, $http, $location, $interval) {

    $scope.center = {};
    $scope.layers = {};
    $scope.tiles = {};
    $scope.tiles.url = "";
    $scope.twitterSentimentDataAll = [];


    //TWITTER SENTIMENT
    var twitterSentimentUrl = "http://localhost:5000/twitter_sentiment?query=";

    function getTwitterSentimentData(searchterm) {
        $http.get(twitterSentimentUrl + searchterm).then(function(resp) {
            $scope.twitterSentimentDataAll = resp.data.result;
            $interval(function() {
                c += 1;
                getTwitterSentiment(["2016-04-20", "2016-04-21", "2016-04-22", "2016-04-23", "2016-04-24", "2016-04-25", "2016-04-26"][c%7]);
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
    });


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

  });


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