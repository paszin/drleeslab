/*global angular, console*/
var app = angular.module('spaceappsApp');

app.controller('LandingCtrl', ['$scope', '$rootScope', '$mdToast', '$q', '$http', '$location', '$facebook', 'mapBaselayers', 'CoordinatesCalculater',
    function ($scope, $rootScope, $mdToast, $q, $http, $location, $facebook, mapBaselayers, CoordinatesCalculater) {
        'use strict';

        $scope.paths = {};
        $scope.markers = {};
        $scope.friends = [];
        $scope.affectedCounter = 0;
        $scope.notAffectedCounter = 0;
        $rootScope.friendsMarkers = {};

        function findClosetsEvent(person) {
            //TODO search through events first
            if (person.location.hasOwnProperty('latitude')) { //geolocation is known
                person.distance = CoordinatesCalculater.distance(person.location.latitude, person.location.longitude, 29.213727993972313, -95.980224609375) * 0.621371;
                if (person.distance < 140) {
                    $scope.affectedCounter += 1;
                } else {
                    $scope.notAffectedCounter += 1;
                }
                addMarker(person);
            } else if ($scope.isLoggedIn) {
                $facebook.api(person.location.id + '?fields=location').then(function (data) {
                    person.distance = CoordinatesCalculater.distance(data.location.latitude, data.location.longitude, 29.213727993972313, -95.980224609375) * 0.621371;
                    if (person.distance < 140) {
                        $scope.affectedCounter += 1;
                    } else {
                        $scope.notAffectedCounter += 1;
                    }
                    person.location.latitude = data.location.latitude;
                    person.location.longitude = data.location.longitude;
                    console.log("location name:", person.location.name);
                    console.log(",latitude:", data.location.latitude, ",", "longitude:", data.location.longitude);
                    console.log("");
                });
            }
        }

        $scope.loadSamples = loadExampleFriends;

        // FACEBOOK
        $rootScope.user = $rootScope.user || {};
        $rootScope.isLoggedIn = false;

        var fbFriendsLocations = '/me/friends?fields=address,location,name,picture,hometown&limit=1000',
            fbPersonalData = '/me?fields=location,hometown,picture';

        function getFbFriendsLocation() {
            $facebook.api(fbFriendsLocations).then(function (response) {
                response.data.forEach(function (entry) {
                    entry.distance = 100;
                    setCordinates(entry.location.id, entry);
                    findClosetsEvent(entry);
                });
                _.assign($scope.friends, response.data);
            }, function (response) {
                console.warn('error fetching friends data', response);
            });
        }

        function getFbPersonalData() {
            $facebook.api(fbPersonalData).then(function (response) {
                $rootScope.user = response;
                $rootScope.isLoggedIn = true;
                if (response.id === "1177827492262065") { //it's me (pascal)
                    loadExampleFriends();
                }
            }, function (err) {
                console.warn('ERROR DURING FACEBOOK LOGIN', err);
            });
        }

        function loadExampleFriends() {
            $http.get("/assets/data/myFacebookFriends.json").then(function (response) {
                response.data.data.forEach(function (entry) {
                    if (entry.location) {
                        console.log(entry);
                        setCordinates(entry.location.id, entry);
                        findClosetsEvent(entry);
                    } else {
                        console.warn("no location for ", entry)
                    }
                });
                _.assign($scope.friends, response.data.data);
                $mdToast.show($mdToast.simple().textContent('We loaded a couple of friends for you. Now you can click on one of your friends.'));
            });
        }

        function addMarker(person) {
            var id = person.id;
            var icon = {
                iconUrl: person.picture.data.url,
                //shadowUrl: 'img/leaf-shadow.png',
                iconSize: [40, 40], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 0], // the same for the shadow
                popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
            };
            //Location
            $rootScope.friendsMarkers[id] = {
                layer: 'friendsLocation',
                lat: person.location.latitude,
                lng: person.location.longitude,
                message: "Here lives " + person.name || " a friend",
                icon: icon
            };

            $scope.markers[id] = {
                layer: 'friendsLocation',
                lat: person.location.latitude,
                lng: person.location.longitude,
                message: "Here lives " + person.name || " a friend",
                icon: icon
            };


        }

        function setCordinates(id, person) {
            $facebook.api(id + '?fields=location').then(function (data) {
                person.location.latitude = data.location.latitude;
                person.location.longitude = data.location.longitude;
            });
        }

        //login
        $scope.login = function () {
            $facebook.login().then(function () {
                getFbPersonalData();
                getFbFriendsLocation();
            });
        };
        $scope.logout = function () {
            $facebook.logout().then(function (resp) {
                console.log(resp);
            });
        };

        //$scope.login();


        //NATURE EVENTS
        $scope.openEvents = [];
        var earthquakeUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
            natureEventsOpenUrl = 'http://eonet.sci.gsfc.nasa.gov/api/v2.1/events?status=open&limit=900&days=5000',
            natureEventsOpenUrl = '/assets/data/eonet-snapshot.json';
        //earthquakes
        $http.get(earthquakeUrl).success(function (response) {
            var points = response.features.map(function (d) {
                return {
                    layer: 'earthquake',
                    lat: d.geometry.coordinates[1],
                    lng: d.geometry.coordinates[0],
                    message: d.id
                };
            });
            console.log('Earthquakes', points.length);
        });
        //nature events eonet
        $http.get(natureEventsOpenUrl).success(function (api) {
            $scope.openEventsList = api.events;
            api.events.forEach(function (natureevent) {
                var lat, lng;
                //just take one of the coordinates, room for improvement!
                if (!!natureevent.geometries && natureevent.geometries.length > 0 && !!natureevent.geometries[0].coordinates && natureevent.geometries[0].coordinates.length > 0) {

                    if (natureevent.geometries[0].type === 'Polygon') {
                        lat = natureevent.geometries[0].coordinates[0][0][1];
                        lng = natureevent.geometries[0].coordinates[0][0][0];
                        //create a path
                        if (natureevent.id === "EONET_368") {
                            var points = natureevent.geometries[0].coordinates[0].map(function (coords) {
                                return {
                                    lat: coords[1],
                                    lng: coords[0]
                                }
                            });
                            $scope.paths[natureevent.id] = {
                                latlngs: points,
                                type: "polygon",
                                stroke: false,
                                fillColor: "#FF555E",
                                fillOpacity: 0.7,
                                clickable: true
                            };
                        }
                    } else if (natureevent.geometries[0].type === 'Point') {
                        lat = natureevent.geometries[0].coordinates[1];
                        lng = natureevent.geometries[0].coordinates[0];
                    }
                    $scope.markers[natureevent.id] = {
                        data: natureevent,
                        message: natureevent.title,
                        layer: 'natureevents',
                        lat: lat,
                        lng: lng,
                        icon: //{}
                        {
                            iconUrl: 'assets/icons/' + iconLookup[natureevent.categories[0].title] || 'assest/icons/dots-vertical.svg',
                            //shadowUrl: 'img/leaf-shadow.png',
                            iconSize: [24, 24], // size of the icon
                            shadowSize: [50, 64], // size of the shadow
                            iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                            shadowAnchor: [0, 0], // the same for the shadow
                            popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
                            fillOpacity: 0.8
                        }
                    };
                }
            });

        });


        //MAP CONFIG
        var iconLookup = {
            'Floods': 'flood.svg',
            'Severe Storms': 'tornado.svg',
            'Wildfires': 'wildfire.svg',
            'Dust and Haze': 'house_fire.svg',
            'Water Color': 'tsunami.svg',
            'Volcanoes': 'volcano.svg',
            'Sea and Lake Ice': 'ice_sea.svg',
            'Temperature Extremes': 'wildfire.svg'
        };


        $scope.$on('leafletDirectiveMarker.mymap.click', function (e, args) {
            $scope.info = args.model.message;
            if (args.model.data.id === "EONET_368") {
                $location.path('/playground');
            } else {
                //$location.path('/event');
                //$location.search('link', args.model.data.link);
            }
        });

        $scope.$on('leafletDirectivePath.mymap.mousedown', function (e, args) {
            $location.path('/houstonflood');
        });
        $scope.$on('leafletDirectivePath.mymap.mouseover', function (e, args) {
            //$scope.markers[args.modelName].openPopup();
        });

        $scope.$on('leafletDirectiveMarker.mymap.mouseover', function (e, args) {
            //debugger;
            args.leafletObject.openPopup();
            $scope.info = args.model.data.title;
        });

        $scope.zoomToPerson = function (person) {
            $scope.center.lat = person.location.latitude;
            $scope.center.lng = person.location.longitude;
            $scope.center.zoom = 9;
            $mdToast.show($mdToast.simple().textContent('Click into the area and you will find out about the well-being of your friends.'));
        };

        angular.extend($scope, {
            center: {
                lat: 0,
                lng: 0,
                zoom: 2
            },
            markers: $scope.markers,
            paths: $scope.paths,
            layers: {
                baselayers: mapBaselayers,
                overlays: {
                    natureevents: {
                        name: 'Nature Events',
                        type: 'group',
                        visible: true
                    },
                    truecolor: {
                        name: 'Satellite Images',
                        url: 'http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/' +
                            'MODIS_Terra_CorrectedReflectance_TrueColor/default/2013-11-04/EPSG4326_250m/{z}/{y}/{x}.jpg',
                        type: 'xyz'
                    },
                    /*something: {
                        name: 'earthdata',
                        type: 'xyz',
                        url: 'http://map1{s}.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Aqua_CorrectedReflectance_TrueColor/default/2013-06-20/EPSG3413_250m/{z}/{y}/{x}.jpg'
                    },*/
                    friendsLocation: {
                        name: 'Friend`s Locations',
                        type: 'markercluster',
                        visible: true
                    }
                }
            }
        });

  }]);