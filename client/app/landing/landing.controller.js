/*global angular, console*/
var app = angular.module('spaceappsApp');


app.controller('LandingCtrl',
    function ($scope, $rootScope, $mdToast, $http, $location, $facebook, leafletData, mapBaselayers, CoordinatesCalculater) {
        'use strict';


        $scope.paths = {}; //polygones for friends locations
        $scope.markers = {}; //friends & events
        $scope.friends = [];
        $scope.affectedCounter = 0;
        $scope.notAffectedCounter = 0;
        $rootScope.friendsMarkers = {}; //save the friends to the rootscope, to make them visible in the details view
        $scope.showSafePeople = false;

        //PRCESSING
        function findClosetsEvent(person) {
            //TODO search through events first
            var shortestDistance = 100000;
            var closestEvent = "";
            if (person.location.hasOwnProperty('latitude')) { //geolocation is known
                $scope.openEvents.forEach(function (nevent) {
                    var distance = CoordinatesCalculater.distance(person.location.latitude, person.location.longitude, nevent.latitude, nevent.longitude) * 0.621371;
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        closestEvent = nevent.title;
                    }
                });
                addMarker(person);
                person.distance = shortestDistance;
                person.closestEvent = closestEvent;
                if (shortestDistance < 130) {
                    $scope.affectedCounter += 1;
                } else {
                    $scope.notAffectedCounter += 1;
                }

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

            }, function (err) {
                console.warn('ERROR DURING FACEBOOK LOGIN', err);
            });
        }

        function loadExampleFriends() {
            $http.get("/assets/data/myFacebookFriends.json").then(function (response) {
                response.data.data.forEach(function (entry) {
                    if (entry.location) {
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
            var iconUrl = "https://randomuser.me/api/portraits/lego/1.jpg";
            if (person.hasOwnProperty("picture") && person.picture.hasOwnProperty("data")) {
                iconUrl = person.picture.data.url;
            } else {
                person.picture = {data: {url: "https://randomuser.me/api/portraits/lego/1.jpg"}};
            }
            var icon = {
                iconUrl: iconUrl ,
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



        //NATURE EVENTS
        $scope.openEvents = [];
        var earthquakeUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
            natureEventsOpenUrl = 'http://eonet.sci.gsfc.nasa.gov/api/v2.1/events?status=open&limit=900&days=5000',
            natureEventsOpenUrlFallback = '/assets/data/eonet-snapshot.json';
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

        function loadNatureEvents(url) {
            $http.get(url).success(function (api) {
                api.events.forEach(function (natureevent) {
                    var lat, lng;
                    //just take one of the coordinates, room for improvement!
                    if (!!natureevent.geometries && natureevent.geometries.length > 0 && !!natureevent.geometries[0].coordinates && natureevent.geometries[0].coordinates.length > 0) {

                        if (natureevent.geometries[0].type === 'Polygon') {
                            lat = natureevent.geometries[0].coordinates[0][0][1];
                            lng = natureevent.geometries[0].coordinates[0][0][0];
                            addPolygone(natureevent);
                            //}
                        } else if (natureevent.geometries[0].type === 'Point') {
                            lat = natureevent.geometries[0].coordinates[1];
                            lng = natureevent.geometries[0].coordinates[0];
                        }
                        natureevent.latitude = lat;
                        natureevent.longitude = lng;
                        addEventMarker(natureevent, lat, lng);
                    }
                });
                $scope.openEvents = _.union($scope.openEvents, api.events);


            }).catch(function (err) {
                console.warn("could not parse json for nature events", err);
                return loadNatureEvents(natureEventsOpenUrlFallback);
            });
        }

        function loadHoustonFlood() {
            $http.get("/assets/data/eonet_houstonflood.json").then(function (resp) {
                resp.data.latitude = 29.213727993972313;
                resp.data.longitude = -95.980224609375;
                addPolygone(resp.data);
                addEventMarker(resp.data, 29.213727993972313, -95.980224609375);
                $scope.openEvents.push(resp.data);
            });
        }


        function addPolygone(natureevent) {
            var lat = natureevent.geometries[0].coordinates[0][0][1];
            var lng = natureevent.geometries[0].coordinates[0][0][0];
            //create a path
            var points = natureevent.geometries[0].coordinates[0].map(function (coords) {
                return {
                    lat: coords[1],
                    lng: coords[0]
                }
            });
            $scope.paths[natureevent.id] = {
                data: natureevent,
                latlngs: points,
                type: "polygon",
                stroke: false,
                fillColor: "#FF555E",
                fillOpacity: 0.7,
                clickable: true
            };
        }

        function addEventMarker(natureevent, lat, lng) {
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

        var customLocationsCounter = 0;
        //$scope.newMarkerActive = false;
        $scope.addFriendsLocation = function () {
            $scope.newMarkerActive = true;
            leafletData.getMap().then(function (map) {
                var center = map.getCenter();
                $scope.markers["custommarker" + (customLocationsCounter)] = {
                    lat: center.lat,
                    lng: center.lng,
                    message: "<div layout='column' layout-align='center space-between'><span>Friend`s Name <input ng-model='newFriendsName'></span><button ng-click='fixNewLocation()'>Ok</button></div>",
                    draggable: true,
                    focus: true,
                    getMessageScope: function () {
                        return $scope;
                    }

                };
            });
        }

        $scope.fixNewLocation = function () {
            var markerid = "custommarker" + (customLocationsCounter);
            $scope.newMarkerActive = false;
            var person = {
                id: markerid + "friends",
                name: $scope.newFriendsName,
                location: {
                    latitude: $scope.markers[markerid].lat,
                    longitude: $scope.markers[markerid].lng
                }
            };
            $scope.friends.push(person);
            findClosetsEvent(person);
            delete $scope.markers[markerid];
            customLocationsCounter += 1;
            $scope.newFriendsName = "";
        };

        $scope.$on('leafletDirectiveMarker.mymap.click', function (e, args) {
            $scope.info = args.model.message;
            if (args.model.data.id === "EONET_368") {
                $location.path('/houstonflood');
            } else {
                //$location.path('/event');
                //$location.search('link', args.model.data.link);
                $scope.slectedEvent = args.leafletObject.options.data;
            }
        });

        $scope.$on('leafletDirectivePath.mymap.mousedown', function (e, args) {
            if (args.leafletObject.options.data.id === "EONET_368") {
                $location.path('/houstonflood');
            } else {
                $scope.selectedEvent = args.leafletObject.options.data;
            }
        });
        $scope.$on('leafletDirectivePath.mymap.mouseover', function (e, args) {
            //$scope.selectedEvent = args.leafletObject.options.data;
        });

        $scope.$on('leafletDirectiveMarker.mymap.mouseover', function (e, args) {
            //debugger;
            args.leafletObject.openPopup();
            $scope.selectedEvent = args.leafletObject.options.data;
        });
    
    $scope.$on('leafletDirectiveMarker.mymap.dragend', function(e, args){
            $scope.markers[args.modelName].lat = args.model.lat;
            $scope.markers[args.modelName].lng = args.model.lng;
        });

        $scope.zoomToPerson = function (person) {
            $scope.center.lat = person.location.latitude;
            $scope.center.lng = person.location.longitude;
            $scope.center.zoom = 9;
            $mdToast.show($mdToast.simple().textContent('Click into the area and you will find out about the well-being of your friends.'));
        };

        //init
        loadNatureEvents(natureEventsOpenUrl);
        loadHoustonFlood();


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
                        name: 'Natural Events',
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

    });