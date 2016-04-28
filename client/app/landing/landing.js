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