'use strict';

angular.module('spaceappsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      });
  }).constant('mapBaselayers', {
    mapbox_light: {
                    name: 'Mapbox Light',
//                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    url: 'https://api.mapbox.com/styles/v1/sweetymeow/cinjy5pbt003paem5son415hv/tiles/{z}/{x}/{y}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: 'pk.eyJ1Ijoic3dlZXR5bWVvdyIsImEiOiJjNDQzMzcxMjU0YmIzZDFiYTVkMzI0ZjAxMWU1NDhjNSJ9.Nt5jMK8zq1iBMJwUbbg7TQ',
                        mapid: 'cinjy5pbt003paem5son415hv'
                    }
                },
                osm: {
                  name: 'OpenStreetMap',
                  url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  type: 'xyz',
                  visible: false
                },
                historic: {
				    name: "Historic Topographic Maps",
				    type: "agsTiled",
				    url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
				    visible: true
				},
                bingAerial: {
                    name: 'Bing Aerial',
                    type: 'bing',
                    key: 'Au7WV84YO2KuKIhX2Bc-xBLFzeHzZwpNjwwQo5b9pdHT-DX2Gh_4EQyZ6Q9vyWQ8',
                    layerOptions: {
                        type: 'Aerial'
                    }
                },
            });