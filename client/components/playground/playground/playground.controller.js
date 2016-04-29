'use strict';

angular.module('spaceappsApp')
    .controller('PlaygroundCtrl', function ($scope, $timeout, $interval, mapBaselayers) {

        //SEED DATA
        $scope.event = {
            "id": "EONET_368"
            , "title": "Flooding in Houston, Texas"
            , "description": "Nearly two feet of rain has resulted in extensive flooding in Houston, Texas."
            , "link": "http://eonet.sci.gsfc.nasa.gov/api/v2.1/events/EONET_368"
            , "categories": [
                {
                    "id": 9
                    , "title": "Floods"
                }
                ]
            , "sources": []
            , "geometries": [
                {
                    "date": "2016-04-17T00:00:00Z"
                    , "type": "Polygon"
                    , "coordinates": [
                [
                [
                -95.980224609375
                , 29.213727993972313
                ]
                , [
                -95.980224609375
                , 30.36072451862922
                ]
                , [
                -94.64599609375
                , 30.36072451862922
                ]
                , [
                -94.64599609375
                , 29.213727993972313
                ]
                , [
                -95.980224609375
                , 29.213727993972313
                ]
                ]
                ]
                }
                ]
        };

        $scope.twitterSentimentDataAll = [
            {
                "date": "2016-04-28"
                , "negative": 0.09859154929577464
                , "neutral": 0.6619718309859155
                , "positive": 0.23943661971830985
    }
            
            , {
                "date": "2016-04-27"
                , "negative": 0.2345679012345679
                , "neutral": 0.4567901234567901
                , "positive": 0.30864197530864196
    }
            
            , {
                "date": "2016-04-26"
                , "negative": 0.08620689655172414
                , "neutral": 0.6724137931034483
                , "positive": 0.2413793103448276
    }
            
            , {
                "date": "2016-04-25"
                , "negative": 0.14285714285714285
                , "neutral": 0.4675324675324675
                , "positive": 0.38961038961038963
    }
            
            , {
                "date": "2016-04-24"
                , "negative": 0.09259259259259259
                , "neutral": 0.4444444444444444
                , "positive": 0.46296296296296297
    }
            
            , {
                "date": "2016-04-23"
                , "negative": 0.045454545454545456
                , "neutral": 0.6363636363636364
                , "positive": 0.3181818181818182
    }
            
            , {
                "date": "2016-04-22"
                , "negative": 0.057692307692307696
                , "neutral": 0.34615384615384615
                , "positive": 0.5961538461538461
    }
            
            , {
                "date": "2016-04-21"
                , "negative": 0.125
                , "neutral": 0.6607142857142857
                , "positive": 0.21428571428571427
    }
            
            , {
                "date": "2016-04-20"
                , "negative": 0.21739130434782608
                , "neutral": 0.32608695652173914
                , "positive": 0.45652173913043476
    }
  ];

        function getTwitterSentiment(date) {
            var extractedData = _.find($scope.twitterSentimentDataAll, {
                date: date
            });
            $scope.twitterSentimentData = [
                {
                    key: "positive"
                    , y: extractedData.positive
            }
                
                , {
                    key: "neutral"
                    , y: extractedData.neutral
            }
                
                , {
                    key: "negativ"
                    , y: extractedData.negative
            }
        ];
        }

        $scope.twitterSentimentData = [
            {
                key: "positive"
                , y: 0.4
            }
                
            , {
                key: "neutral"
                , y: 0.4
            }
                
            , {
                key: "negativ"
                , y: 0.2
            }
        ];

        var flow = [[1, 1.2, 1.2, 0.3, 0.4, 0.4, 0.5, 0.6, 0.6, 10, 0.7, 0.6, 0.5, 0.5, 0.3, 0.3, 0.2, 0.2]
               
            , [1.8, 1.8, 1.4, 1.3, 1.4, 1.4, 1.3, 1.2, 0.2, 1, 1, 1, 1, 1, 1, 1, 0.2, 1]
               
            , [1, 0.6, 0.6, 0.6, 0.4, 0.4, 0.5, 0.6, 0.6, 1.7, 1.7, 1.6, 1.5, 1.5, 1.7, 1.8, 1.8, 1.6]
               
            , [1, 1.2, 1.2, 1.3, 1.4, 1.7, 1.5, 1.6, 1.6, 1.5, 1.7, 1.6, 1.5, 1.5, 1.3, 1.3, 1.2, 1.2]]

        $scope.words = [
            {
                text: 'FLOOD'
                , size: 1
                , x: 110
                , y: 35
        }, {
                text: 'FEMA'
                , size: 1
                , x: 30
                , y: 100
        }, {
                text: 'JUNGLE BOOK'
                , size: 1
                , x: 120
                , y: 140
        }, {
                text: 'BRAYS BAYOU'
                , size: 1
                , x: 20
                , y: 180
        }];

        $scope.twitterIds = [
    725105271417147392
    , 725441964699619328
    , 723570517215596544
    , 722449096418537473
    , 723151141966467072
    , 725459529157074944
  ];
        $scope.tweetId = $scope.twitterIds[0];



        /////////////////REAL CODE
    
    var heatmap = {
                name: 'Heat Map',
                type: 'heat',
                data: [[-95.64599609375, 30.36072451862922], [-93.64599609375, 30.36072451862922],[-94.94599609375, 30.36072451862922],[-94.64599609375, 31.36072451862922],[-94.64599609375, 32.36072451862922],[-94.64599609375, 30.072451862922],[-94.645999375, 30.3862922],[-94.64599609375, 30.36072451862922],[-94.64599609375, 30.36072451862922],[-94.64599609375, 30.36072451862922],[-94.64599609375, 30.36072451862922],[-94.64599609375, 30.36072451862922],
  [37.782551, -122.445368],
  [37.782745, -122.444586],
  [37.782842, -122.443688],
  [37.782919, -122.442815],
  [37.782992, -122.442112],
  [37.783100, -122.441461],
  [37.783206, -122.440829],
  [37.783273, -122.440324],
  [37.783316, -122.440023]]
,
                layerOptions: {
                    radius: 40,
                    blur: 10
                },
                visible: true
            };

        var c = 0;
        var scene;
        $scope.play = function () {
            if (angular.isDefined(scene)) return;
            scene = $interval(function () {
                //twitter sentiment
                getTwitterSentiment(["2016-04-20", "2016-04-21", "2016-04-22", "2016-04-23", "2016-04-24", "2016-04-25", "2016-04-26"][c % 7]);

                $scope.words[0].size = flow[0][c];
                $scope.words[1].size = flow[1][c];
                $scope.words[2].size = flow[2][c];
                $scope.words[3].size = flow[3][c];
                c = (c + 1) % 7;
                $scope.c = c;
                
                

                //$scope.tweetId = $scope.twitterIds[c];
                //$scope.tweetIds = [$scope.twitterIds[c]];

            }, 1000);
        };
        $scope.stop = function () {
            angular.element(document.getElementById("twitter-feed-content")).scrollToElement(document.getElementById("tweet1"), 0, 250);
            if (angular.isDefined(stop)) {
                $interval.cancel(scene);
                scene = undefined;
            }
        };


        console.log("center of map", $scope.event.geometries[0].coordinates[0][2]);
        angular.extend($scope, {
            center: {
                lat: $scope.event.geometries[0].coordinates[0][2][1]
                , lng: $scope.event.geometries[0].coordinates[0][2][0]
                , zoom: 7
            }
            , //markers: $scope.markers,
            layers: {
                baselayers: mapBaselayers,
                overlays: {heat: heatmap}
            }
        });


    });