/*global angular, console*/
var app = angular.module('spaceappsApp');

app.controller('LandingCtrl', ['$scope', '$rootScope', '$q', '$http', '$location', '$facebook', 'mapBaselayers',
    function ($scope, $rootScope, $q, $http, $location, $facebook, mapBaselayers) {
        'use strict';

        $scope.paths = {};
        $scope.markers = {};
        $scope.friends = [];


        // FACEBOOK
        $rootScope.user = $rootScope.user || {};
        $rootScope.isLoggedIn = false;

        var fbFriendsLocations = '/me/friends?fields=address,location,name,picture,hometown&limit=1000',
            fbPersonalData = '/me?fields=location,hometown,picture';

        function getFbFriendsLocation() {
            $facebook.api(fbFriendsLocations).then(function (response) {
                response.data.forEach(function (entry) {
                    getCoordinates(entry.location.id);
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
                    $http.get("/assets/data/myFacebookFriends.json").then(function(response) {
                        response.data.data.forEach(function (entry) {
                            if (entry.location) {getCoordinates(entry.location.id);}
                        });
                        _.assign($scope.friends, response.data.data);
                });
                }
            }, function (err) {
                console.warn('ERROR DURING FACEBOOK LOGIN', err);
            });
        }

        function getCoordinates(id, person) {
            $facebook.api(id + '?fields=location').then(function (data) {
            //    if $scope.markers.hasOwnProperty(id) {
            //        $scope.markers[id]
            //    }
                $scope.markers[id] = {
                    layer: 'friendsLocation',
                    lat: data.location.latitude,
                    lng: data.location.longitude,
                    message: "A friend lives here"
                  };
                /*$scope.paths[id] = {
                        weight: 2,
                        color: '#2f61ff',
                        latlngs: {
                            lat: data.location.latitude,
                            lng: data.location.longitude
                        },
                        radius: 200000,
                        type: 'circle',
                        layer: 'friendsLocation',
                stroke: false
                    }*/
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

        $scope.login();


        //NATURE EVENTS
        $scope.openEvents = [];
        var earthquakeUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
            natureEventsOpenUrl = 'http://eonet.sci.gsfc.nasa.gov/api/v2.1/events?status=open&limit=900&days=5000';
        //earthquakes
        $http.get(earthquakeUrl).success(function (response) {
            var points =  response.features.map(function (d) {
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
        $http.get(natureEventsOpenUrl).success(function(api) {
            $scope.openEventsList = api.events;
            api.events.forEach(function(natureevent) {
            var lat, lng;
            //just take one of the coordinates, room for improvement!
            if (!!natureevent.geometries && natureevent.geometries.length > 0 && !!natureevent.geometries[0].coordinates && natureevent.geometries[0].coordinates.length > 0) {

                  if (natureevent.geometries[0].type === 'Polygon') {
                      lat = natureevent.geometries[0].coordinates[0][0][1];
                      lng = natureevent.geometries[0].coordinates[0][0][0];
                  } else if (natureevent.geometries[0].type === 'Point') {
                      lat = natureevent.geometries[0].coordinates[1];
                      lng = natureevent.geometries[0].coordinates[0];
                }
                  $scope.markers[natureevent.id] = {data: natureevent, message: natureevent.title, layer: 'natureevents', lat: lat, lng: lng, icon: //{}
                                          {
                        iconUrl: 'assets/icons/' + iconLookup[natureevent.categories[0].title] || 'assest/icons/dots-vertical.svg',
                        //shadowUrl: 'img/leaf-shadow.png',
                        iconSize:     [24, 24], // size of the icon
                        shadowSize:   [50, 64], // size of the shadow
                        iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
                        shadowAnchor: [0, 0],  // the same for the shadow
                        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
                    }
                };
              }
          });

        });




        //MAP CONFIG
        var iconLookup = {'Floods': 'flood.svg', 'Severe Storms': 'tornado.svg', 'Wildfires': 'wildfire.svg', 'Dust and Haze': 'house_fire.svg', 'Water Color': 'tsunami.svg', 'Volcanoes': 'volcano.svg', 'Sea and Lake Ice': 'ice_sea.svg'};


         $scope.$on('leafletDirectiveMarker.mymap.click', function (e, args) {
            $scope.info = args.model.message;
            $location.path('/event');
            $location.search('link', args.model.data.link);
            });

        $scope.$on('leafletDirectiveMarker.mymap.mouseover', function (e, args) {
            //debugger;
            args.leafletObject.openPopup();
                    $scope.info = args.model.data.title;
            });
         $scope.$on('leafletDirectivePath.mymap.mouseover', function (e, args) {
            //debugger;
            args.leafletObject.openPopup();
                    $scope.info = args.model.data.title;
            });

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
              overlays:{
                natureevents: {
                    name: 'Nature Events',
                    type: 'group',
                    visible: true
                },
                truecolor: {
                    name: 'Sat',
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
