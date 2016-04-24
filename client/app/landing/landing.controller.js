'use strict';

var map_basic = angular.module('spaceappsApp');

map_basic.controller('LandingCtrl',[ '$scope', '$http', function ($scope, $http) {
    $scope.searchWindow = 200; //days
    
    var earthquakeUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
    //last ten days
    $http.get(earthquakeUrl).success(function(response) {
        var points =  response.features.map(function(d) {
          return {
            layer: "earthquake",
            lat: d.geometry.coordinates[1],
            lng: d.geometry.coordinates[0],
            message: d.id
          };
        });
                                               
        console.log("Earthquakes", points.length);
      
        
    });
    
     $scope.$on('leafletDirectiveMarker.mymap.click', function (e, args) {
                $scope.info = args.model.message;
        });
    
    //get events
    $scope.openEvents = [];
    
    $http.get('http://eonet.sci.gsfc.nasa.gov/api/v2.1/events?status=open&limit=900&days=5000').success(function(api) {
      api.events.forEach(function(natureevent) {
          var lat, lng;
          if (!!natureevent.geometries && natureevent.geometries.length > 0 && !!natureevent.geometries[0].coordinates && natureevent.geometries[0].coordinates.length > 0) {

              if (natureevent.geometries[0].type === "Polygon") {
                  lat = natureevent.geometries[0].coordinates[0][0][1]; 
                  lng = natureevent.geometries[0].coordinates[0][0][0];
              } else if (natureevent.geometries[0].type === "Point") {
                  lat = natureevent.geometries[0].coordinates[1]; 
                  lng = natureevent.geometries[0].coordinates[0]; 
            }
              $scope.openEvents.push({message: natureevent.title, layer: "natureevents", lat: lat, lng: lng, icon: //{}
                                      {
                    iconUrl: 'assets/images/cloud.png',
                    //shadowUrl: 'img/leaf-shadow.png',
                    iconSize:     [24, 24], // size of the icon
                    shadowSize:   [50, 64], // size of the shadow
                    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
                    shadowAnchor: [0, 0],  // the same for the shadow
                    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
                }
                
                                     });    
          }
      });
        
    });

    angular.extend($scope, {
        center: {
          lat: 0,
          lng: 0,
          zoom: 2
        },
        cloudIcon: {
                    iconUrl: 'assets/images/cloud.png',
                    //shadowUrl: 'img/leaf-shadow.png',
                    iconSize:     [38, 38], // size of the icon
                    shadowSize:   [50, 64], // size of the shadow
                    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62],  // the same for the shadow
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                },
        markers: $scope.openEvents,
        layers: {
          baselayers: {
            osm: {
              name: 'OpenStreetMap',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              type: 'xyz'
            },
          },
          overlays:{
            natureevents: {
            name: 'natureevents',
            type: 'group',
            visible: true
            },
              truecolor: {
                  name: "Sat",
                  url: "http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/" +
        "MODIS_Terra_CorrectedReflectance_TrueColor/default/2013-11-04/EPSG4326_250m/{z}/{y}/{x}.jpg",
                  type: "xyz"
              }
          }
        }
      });
    
  }]);
