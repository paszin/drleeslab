'use strict';

var map_basic = angular.module('spaceappsApp');

map_basic.controller('LandingCtrl',[ '$scope', function ($scope) {
    //  $scope.message = 'Hello';
     angular.extend($scope, {
          center: {
              lat: 51.505,
              lng: -0.09,
              zoom: 4
          },
          successfactor: {
            lat: 37.668443,
            lng: -122.4495878,
            zoom: 12
          }
      });
  }]);
