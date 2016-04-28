'use strict';

angular.module('spaceappsApp')
    .controller('PlaygroundCtrl', function ($scope, $timeout, $interval) {
    
    var flow = [[1, 2, 2, 3, 4, 4, 5, 6, 6, 10, 7, 6, 5, 5, 3, 3, 2, 1],
               [8, 8, 4, 3, 4, 4, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
               [1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 6, 5, 5, 7, 8, 8, 6],
               [1, 2, 2, 3, 4, 8, 5, 6, 6, 5, 7, 6, 5, 5, 3, 3, 2, 1]]

        $scope.words = [{
            text: 'FLOOD',
            size: 1,
            x: 10,
            y: 10
        }, {
            text: 'PISA',
            size: 0.8,
            x: 60,
            y: 100
        }, {
            text: '#YOLO',
            size: 1.3,
            x: 120,
            y: 200
        }, {
            text: 'EMERGENCY',
            size: 3,
            x: 200,
            y: 120
        }];

        var c = 0;
        $interval(function () {

            $scope.words[0].size = flow[0][c];
            $scope.words[1].size = flow[1][c];
            $scope.words[2].size = flow[2][c];
            $scope.words[3].size = flow[3][c];
            c = (c + 1) % flow[0].length

        }, 1000)



        $timeout(function () {
            $scope.words.push("Marzipan");
        }, 2010);

        $timeout(function () {
            $scope.words.pop();
        }, 2020);
    });