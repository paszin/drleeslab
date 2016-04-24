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
              $scope.openEvents.push({message: natureevent.title, layer: "natureevents", lat: lat, lng: lng});    
              
              
          }
      });
        
    });

    angular.extend($scope, {
        center: {
          lat: 0,
          lng: 0,
          zoom: 2
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
            }
          }
        }
      });
    
  }]);
