'use strict';

angular.module('spaceappsApp')
    .controller('PlaygroundCtrl', function ($scope, $timeout, $interval) {

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

        var direction = 1;
        $interval(function () {
            $scope.words[0].size += direction * 0.02;
            $scope.words[3].size += (-direction * 0.01);
        }, 200)



        $timeout(function () {
            $scope.words.push("Marzipan");
        }, 2000);

        $timeout(function () {
            $scope.words.pop();
        }, 2400);
    });