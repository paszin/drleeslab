'use strict';

angular.module('spaceappsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('playground', {
        url: '/houstonflood',
        templateUrl: 'components/playground/playground/playground.html',
        controller: 'PlaygroundCtrl'
      });
  });