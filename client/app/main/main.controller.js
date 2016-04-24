'use strict';

angular.module('spaceappsApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    // $scope.hello = "hello world";
    
    $scope.events = [];
    
    $http.get('http://eonet.sci.gsfc.nasa.gov/api/v2.1/events?status=closed&limit=900&days=5000').success(function(api) {
      $scope.events = api.events;
    });


    $http.get('/api/things').success(function(awesomeThings) {
      console.log(awesomeThings);
      $scope.awesomeThings = awesomeThings;
    });

    $scope.getColor = function($index) {
      var _d = ($index + 1) % 11;
      var bg = '';

      switch(_d) {
        case 1:       bg = 'red';         break;
        case 2:       bg = 'green';       break;
        case 3:       bg = 'darkBlue';    break;
        // case 4:       bg = 'blue';        break;
        // case 5:       bg = 'yellow';      break;
        // case 6:       bg = 'pink';        break;
        // case 7:       bg = 'darkBlue';    break;
        // case 8:       bg = 'purple';      break;
        // case 9:       bg = 'deepBlue';    break;
        // case 10:      bg = 'lightPurple'; break;
        default:      bg = 'yellow';      break;
      }

      return bg;
    };

    $scope.getSpan = function($index) {
      var _d = ($index + 1) % 11;

      if (_d === 1 || _d === 5) {
        return 2;
      }
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
