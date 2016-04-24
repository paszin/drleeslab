'use strict';

angular.module('spaceappsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/event',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

  });
