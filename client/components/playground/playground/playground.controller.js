'use strict';

angular.module('spaceappsApp')
    .controller('PlaygroundCtrl', function ($scope, $rootScope, $http, $timeout, $interval, mapBaselayers) {

        //SEED DATA
        $scope.event = {
            "id": "EONET_368",
            "title": "Flooding in Houston, Texas",
            "description": "Nearly two feet of rain has resulted in extensive flooding in Houston, Texas.",
            "link": "http://eonet.sci.gsfc.nasa.gov/api/v2.1/events/EONET_368",
            "categories": [
                {
                    "id": 9,
                    "title": "Floods"
                }
                ],
            "sources": [],
            "geometries": [
                {
                    "date": "2016-04-17T00:00:00Z",
                    "type": "Polygon",
                    "coordinates": [
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
                "date": "2016-04-28",
                "negative": 0.09859154929577464,
                "neutral": 0.6619718309859155,
                "positive": 0.23943661971830985
    }


            , {
                "date": "2016-04-27",
                "negative": 0.2345679012345679,
                "neutral": 0.4567901234567901,
                "positive": 0.30864197530864196
    }


            , {
                "date": "2016-04-26",
                "negative": 0.08620689655172414,
                "neutral": 0.6724137931034483,
                "positive": 0.2413793103448276
    }


            , {
                "date": "2016-04-25",
                "negative": 0.14285714285714285,
                "neutral": 0.4675324675324675,
                "positive": 0.38961038961038963
    }


            , {
                "date": "2016-04-24",
                "negative": 0.09259259259259259,
                "neutral": 0.4444444444444444,
                "positive": 0.46296296296296297
    }


            , {
                "date": "2016-04-23",
                "negative": 0.045454545454545456,
                "neutral": 0.6363636363636364,
                "positive": 0.3181818181818182
    }


            , {
                "date": "2016-04-22",
                "negative": 0.057692307692307696,
                "neutral": 0.34615384615384615,
                "positive": 0.5961538461538461
    }


            , {
                "date": "2016-04-21",
                "negative": 0.125,
                "neutral": 0.6607142857142857,
                "positive": 0.21428571428571427
    }


            , {
                "date": "2016-04-20",
                "negative": 0.21739130434782608,
                "neutral": 0.32608695652173914,
                "positive": 0.45652173913043476
    }
  ];

        function getTwitterSentiment(date) {
            var extractedData = _.find($scope.twitterSentimentDataAll, {
                date: date
            });
            $scope.twitterSentimentData = [
                {
                    key: "positive",
                    y: extractedData.positive
            }


                , {
                    key: "neutral",
                    y: extractedData.neutral
            }


                , {
                    key: "negativ",
                    y: extractedData.negative
            }
        ];
        }

        $scope.twitterSentimentData = [
            {
                key: "positive",
                y: 0.4
            }


            , {
                key: "neutral",
                y: 0.4
            }


            , {
                key: "negativ",
                y: 0.2
            }
        ];

        $scope.gg_svi_flood = {
            "result": [
                {
                    "date": "2015-12-31",
                    "svi": 10.0
    },
                {
                    "date": "2016-01-01",
                    "svi": 6.0
    },
                {
                    "date": "2016-01-02",
                    "svi": 5.0
    },
                {
                    "date": "2016-01-03",
                    "svi": 10.0
    },
                {
                    "date": "2016-01-04",
                    "svi": 9.0
    },
                {
                    "date": "2016-01-05",
                    "svi": 8.0
    },
                {
                    "date": "2016-01-06",
                    "svi": 6.0
    },
                {
                    "date": "2016-01-07",
                    "svi": 10.0
    },
                {
                    "date": "2016-01-08",
                    "svi": 17.0
    },
                {
                    "date": "2016-01-09",
                    "svi": 4.0
    },
                {
                    "date": "2016-01-10",
                    "svi": 6.0
    },
                {
                    "date": "2016-01-11",
                    "svi": 18.0
    },
                {
                    "date": "2016-01-12",
                    "svi": 11.0
    },
                {
                    "date": "2016-01-13",
                    "svi": 5.0
    },
                {
                    "date": "2016-01-14",
                    "svi": 8.0
    },
                {
                    "date": "2016-01-15",
                    "svi": 6.0
    },
                {
                    "date": "2016-01-16",
                    "svi": 7.0
    },
                {
                    "date": "2016-01-17",
                    "svi": 9.0
    },
                {
                    "date": "2016-01-18",
                    "svi": 5.0
    },
                {
                    "date": "2016-01-19",
                    "svi": 10.0
    },
                {
                    "date": "2016-01-20",
                    "svi": 13.0
    },
                {
                    "date": "2016-01-21",
                    "svi": 4.0
    },
                {
                    "date": "2016-01-22",
                    "svi": 9.0
    },
                {
                    "date": "2016-01-23",
                    "svi": 7.0
    },
                {
                    "date": "2016-01-24",
                    "svi": 9.0
    },
                {
                    "date": "2016-01-25",
                    "svi": 12.0
    },
                {
                    "date": "2016-01-26",
                    "svi": 10.0
    },
                {
                    "date": "2016-01-27",
                    "svi": 7.0
    },
                {
                    "date": "2016-01-28",
                    "svi": 6.0
    },
                {
                    "date": "2016-01-29",
                    "svi": 5.0
    },
                {
                    "date": "2016-01-30",
                    "svi": 5.0
    },
                {
                    "date": "2016-01-31",
                    "svi": 8.0
    },
                {
                    "date": "2016-02-01",
                    "svi": 12.0
    },
                {
                    "date": "2016-02-02",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-03",
                    "svi": 12.0
    },
                {
                    "date": "2016-02-04",
                    "svi": 7.0
    },
                {
                    "date": "2016-02-05",
                    "svi": 7.0
    },
                {
                    "date": "2016-02-06",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-07",
                    "svi": 5.0
    },
                {
                    "date": "2016-02-08",
                    "svi": 3.0
    },
                {
                    "date": "2016-02-09",
                    "svi": 7.0
    },
                {
                    "date": "2016-02-10",
                    "svi": 5.0
    },
                {
                    "date": "2016-02-11",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-12",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-13",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-14",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-15",
                    "svi": 14.0
    },
                {
                    "date": "2016-02-16",
                    "svi": 8.0
    },
                {
                    "date": "2016-02-17",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-18",
                    "svi": 5.0
    },
                {
                    "date": "2016-02-19",
                    "svi": 5.0
    },
                {
                    "date": "2016-02-20",
                    "svi": 6.0
    },
                {
                    "date": "2016-02-21",
                    "svi": 9.0
    },
                {
                    "date": "2016-02-22",
                    "svi": 14.0
    },
                {
                    "date": "2016-02-23",
                    "svi": 8.0
    },
                {
                    "date": "2016-02-24",
                    "svi": 11.0
    },
                {
                    "date": "2016-02-25",
                    "svi": 7.0
    },
                {
                    "date": "2016-02-26",
                    "svi": 5.0
    },
                {
                    "date": "2016-02-27",
                    "svi": 5.0
    },
                {
                    "date": "2016-02-28",
                    "svi": 6.0
    },
                {
                    "date": "2016-02-29",
                    "svi": 13.0
    },
                {
                    "date": "2016-03-01",
                    "svi": 6.0
    },
                {
                    "date": "2016-03-02",
                    "svi": 5.0
    },
                {
                    "date": "2016-03-03",
                    "svi": 11.0
    },
                {
                    "date": "2016-03-04",
                    "svi": 9.0
    },
                {
                    "date": "2016-03-05",
                    "svi": 9.0
    },
                {
                    "date": "2016-03-06",
                    "svi": 10.0
    },
                {
                    "date": "2016-03-07",
                    "svi": 55.0
    },
                {
                    "date": "2016-03-08",
                    "svi": 67.0
    },
                {
                    "date": "2016-03-09",
                    "svi": 100.0
    },
                {
                    "date": "2016-03-10",
                    "svi": 14.0
    },
                {
                    "date": "2016-03-11",
                    "svi": 11.0
    },
                {
                    "date": "2016-03-12",
                    "svi": 14.0
    },
                {
                    "date": "2016-03-13",
                    "svi": 13.0
    },
                {
                    "date": "2016-03-14",
                    "svi": 23.0
    },
                {
                    "date": "2016-03-15",
                    "svi": 23.0
    },
                {
                    "date": "2016-03-16",
                    "svi": 16.0
    },
                {
                    "date": "2016-03-17",
                    "svi": 21.0
    },
                {
                    "date": "2016-03-18",
                    "svi": 6.0
    },
                {
                    "date": "2016-03-19",
                    "svi": 9.0
    },
                {
                    "date": "2016-03-20",
                    "svi": 10.0
    },
                {
                    "date": "2016-03-21",
                    "svi": 7.0
    },
                {
                    "date": "2016-03-22",
                    "svi": 12.0
    },
                {
                    "date": "2016-03-23",
                    "svi": 11.0
    },
                {
                    "date": "2016-03-24",
                    "svi": 6.0
    },
                {
                    "date": "2016-03-25",
                    "svi": 5.0
    },
                {
                    "date": "2016-03-26",
                    "svi": 20.0
    },
                {
                    "date": "2016-03-27",
                    "svi": 5.0
    },
                {
                    "date": "2016-03-28",
                    "svi": 9.0
    },
                {
                    "date": "2016-03-29",
                    "svi": 6.0
    },
                {
                    "date": "2016-03-30",
                    "svi": 15.0
    }
  ]
        };

        var flow = [[1, 1.2, 1.2, 0.3, 0.4, 0.4, 0.5, 0.6, 0.6, 10, 0.7, 0.6, 0.5, 0.5, 0.3, 0.3, 0.2, 0.2]
            , [1.8, 1.8, 1.4, 1.3, 1.4, 1.4, 1.3, 1.2, 0.2, 1, 1, 1, 1, 1, 1, 1, 0.2, 1]
            , [1, 0.6, 0.6, 0.6, 0.4, 0.4, 0.5, 0.6, 0.6, 1.7, 1.7, 1.6, 1.5, 1.5, 1.7, 1.8, 1.8, 1.6]
            , [1, 1.2, 1.2, 1.3, 1.4, 1.7, 1.5, 1.6, 1.6, 1.5, 1.7, 1.6, 1.5, 1.5, 1.3, 1.3, 1.2, 1.2]]

        $scope.words = [
            {
                text: 'FLOOD',
                size: 1.7,
                x: 10,
                y: 10,
                color: "#BBD261"
        }, {
                text: 'FEMA',
                size: 1.2,
                x: 10,
                y: 60,
                color: "#9BD977"
        }, {
                text: 'JUNGLE BOOK',
                size: 0.6,
                x: 10,
                y: 110,
                color: "#7ADE93"
        }, {
                text: 'BRAYS BAYOU',
                size: 1.4,
                x: 10,
                y: 160,
                color: "#5BE0B2"
        }];

        $scope.twitterIds = [
    725105271417147392

            , 725441964699619328

            , 723570517215596544

            , 722449096418537473

            , 723151141966467072

            , 725459529157074944
  ];


        /////////////////REAL CODE

        $scope.heatmap = {
            name: 'Heat Map',
            type: 'heat',
            data: [],
            layerOptions: {
                radius: 40,
                blur: 10
            },
            visible: true
        };

        //LOAD THE HEATMAP (OMG I AM SO EXITED)
        $http.get("/assets/data/gpm/1.json").then(function (resp) {
            var i = 1;
            for (i; i < 3717; i++) {
                $scope.heatmap.data.push([resp.data.latitude[i], resp.data.longitude[i]]);
            }
            $scope.layers.overlays = {
                heat: {
                    name: 'Heat Map',
                    type: 'heat',
                    data: $scope.heatmap.data,
                    layerOptions: {
                        radius: 20,
                        blur: 10
                    },
                    visible: true
                }
            }
        });

        var c = 0;
        var scene;
        $scope.c = 0;
        $scope.isPlaying = false;
        $scope.speed = 5000; // time from day one to day two
        $scope.startDate = new Date(moment("2016-04-18"));
        $scope.currentDate = $scope.startDate;
        $scope.endDate = new Date(moment("2016-04-27"));
        $scope.sliderValue = 0;
        $scope.sliderMin = 0;
        $scope.sliderMax = 1001;

        function getDate() {
            var timespan = moment($scope.endDate).diff(moment($scope.startDate));
            var sliderspan = $scope.sliderMax - $scope.sliderMin;
            var date = moment($scope.startDate).add((timespan / sliderspan) * $scope.sliderValue);
            $scope.currentDate = date.format("YYYY-MM-DD HH:mm");
            return date;


        }

        $scope.$watch("sliderValue", function (current, old) {
            //calculate date
            getDate();
            //if ((current/$scope.speed) % 7 !== $scope.c) {
            //    $scope.c = (current/$scope.speed) % 7;
            //    setScene((current/$scope.speed) % 7);
            //}
        });

        function setScene(i) {

            $http.get("http://localhost:5000/precipitation?timestamp=" + $scope.currentDate).then(function (resp) {
                $scope.heatmap.data = resp.data.result.map(function(coords) {return [coords.latitude, coords.longitude];});
                $scope.layers.overlays = {
                    heat: {
                        name: 'Heat Map',
                        type: 'heat',
                        data: $scope.heatmap.data,
                        layerOptions: {
                            radius: 20,
                            blur: 10
                        },
                        visible: true,
                        doRefresh: true
                    }
                }
            });

            console.log(parseInt(i / 143));
            getTwitterSentiment(["2016-04-20", "2016-04-21", "2016-04-22", "2016-04-23", "2016-04-24", "2016-04-25", "2016-04-26"][parseInt(i / 143)]);

            //scroll through tweets
            if (document.getElementById("tweet" + parseInt(c / $scope.speed))) {
                angular.element(document.getElementById("twitter-feed-content")).scrollToElement(document.getElementById("tweet" + (6 - parseInt(i / 143))), 0, 700);
            }

            $scope.words[0].size = flow[0][parseInt(i / 149)];
            $scope.words[1].size = flow[1][parseInt(i / 149)];
            $scope.words[2].size = flow[2][parseInt(i / 149)];
            $scope.words[3].size = flow[3][parseInt(i / 149)];
        }

        $scope.play = function () {
            if (angular.isDefined(scene)) {
                return $scope.stop();
            };

            $scope.isPlaying = true;
            scene = $interval(function () {
                //twitter sentiment
                setScene($scope.sliderValue);

                $scope.sliderValue += 72;




            }, 1000);
        };
        $scope.stop = function () {

            $scope.isPlaying = false;
            $interval.cancel(scene);
            scene = undefined;

        };

        console.log("center of map", $scope.event.geometries[0].coordinates[0][2]);
        angular.extend($scope, {
            center: {
                lat: $scope.event.geometries[0].coordinates[0][2][1],
                lng: $scope.event.geometries[0].coordinates[0][2][0],
                zoom: 7
            },
            markers: $rootScope.friendsMarkers,
            layers: {
                baselayers: mapBaselayers,
                overlays: {
                    //heat: $scope.heatmap,
                    friendsLocation: {
                        name: 'Friend`s Locations',
                        type: 'group',
                        visible: true
                    }
                },
            }
        });


    });