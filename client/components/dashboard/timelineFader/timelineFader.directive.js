angular.module('spaceappsApp')
    .directive('timelineFader', function () {
        "use strict";
        return {
            restrict: 'EAC',
            replace: true,
            scope: {
                startDate: "=startDate",
                endDate: "=endDate",
                currentDate: "=currentDate"
            },
            template: "<canvas width='900' height='100'></canvas>",
            link: function (scope, element, attribute) {
                console.log(element);
                var w, h, marker, text, stageObjects = [];
                init();

                scope.$watch(function () {
                    return scope.currentDate;
                }, function (current, old) {
                    scope.stage.update();
                }, true);

                function init() {
                    //drawing the game canvas from scratch here
                    //In future we can pass stages as param and load indexes from arrays of background elements etc
                    if (scope.stage) {
                        scope.stage.autoClear = true;
                        scope.stage.removeAllChildren();
                        scope.stage.update();
                    } else {
                        scope.stage = new createjs.Stage(element[0]);
                    }
                    w = scope.stage.canvas.width;
                    h = scope.stage.canvas.height;

                    marker = new createjs.Shape();
                    marker.graphics.beginFill("red").drawCircle(0, 0, 6);
                    marker.x = 10;
                    marker.y = 10;
                    scope.stage.addChild(marker);

                    //draw timeline
                    console.log(w);
                    var timeline = new createjs.Shape();
                    timeline.graphics.moveTo(30,30).setStrokeStyle(1).beginStroke("#00ff00").lineTo(w-30,30);
                    timeline.graphics.moveTo(w-30,20).setStrokeStyle(1).beginStroke("#00ff00").lineTo(w-30,40);
                    timeline.graphics.moveTo(30,20).setStrokeStyle(1).beginStroke("#00ff00").lineTo(30,40);
                    timeline.graphics.endStroke();
                    scope.stage.addChild(timeline);
                    var i;
                    for (i=20; i<900; i+= 100) {
                        addWord({text: "2015-10-01", x: i, y: 20});
                    }
                    scope.stage.update();


                    createjs.Ticker.addEventListener("tick", scope.stage);
                }

                function addWord(word) {
                    text = new createjs.Text(word.text, "12px Arial", "#000000");
                    text.x = word.x || wordPosX;
                    text.y = word.y || wordPosY;
                    text.name = word.text;
                    stageObjects.push(text);
                    //text.textBaseline = "alphabetic";
                    scope.stage.addChild(text);
                    scope.stage.update();
                }

                function removeWord(word) {
                    var child = scope.stage.getChildByName(word.text);
                    scope.stage.removeChild(child);
                }

                function handleTick() {

                    scope.stage.update();

                }
            }
        }
    });