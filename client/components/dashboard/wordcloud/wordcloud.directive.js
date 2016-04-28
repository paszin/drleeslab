angular.module('spaceappsApp')
    .directive('wordcloud', function () {
        "use strict";
        return {
            restrict: 'EAC',
            replace: true,
            scope: {
                words: "=words"
            },
            template: "<canvas width='300' height='300'></canvas>",
            link: function (scope, element, attribute) {
                var w, h, circle, text, stageObjects = [];
                var wordPosX = 30,
                    wordPosY = 30;
                init();

                scope.$watch(function () {
                    return scope.words;
                }, function (current, old) {
                    console.log("word changed");
                    //check if new word added
                    if (old.length < current.length) {
                        current.forEach(function (word) {
                            if (_.findIndex(old, {
                                    text: word.text
                                }) === -1) {
                                addWord(word);
                            }
                        });
                    } else if (old.length > current.length) {
                        old.forEach(function (word) {
                            if (_.findIndex(current, {
                                    text: word.text
                                }) === -1) {
                                removeWord(word);
                            }
                        });
                    } else { //size changed
                        current.forEach(function (word) {
                            //var i = _.findIndex(old, {text: word.text});
                            //var old_size = old[i].size;
                            var child = scope.stage.getChildByName(word.text);
                            child.scaleX = word.size;
                        });
                    }
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

                    scope.words.forEach(function (word) {
                        addWord(word);
                    });
                    //createjs.Ticker.addEventListener("tick", handleTick);
                }

                function addWord(word) {
                    text = new createjs.Text(word.text, "20px Arial", "#ff7700");
                    text.x = word.x || wordPosX;
                    text.y = word.y || wordPosY;
                    text.name = word.text;
                    stageObjects.push(text);
                    //text.textBaseline = "alphabetic";
                    scope.stage.addChild(text);
                    scope.stage.update();
                    wordPosX += 90;
                    wordPosY += (Math.random() - 0.5) * 10;
                    if (wordPosX > w - 60) {
                        wordPosX = Math.random() * 25 + 10;
                        wordPosY += 60;
                    }
                }

                function removeWord(word) {
                    var child = scope.stage.getChildByName(word.text);
                    scope.stage.remoeChild(child);
                }

                function handleTick() {

                    text.scaleX = text.scaleX + 0.01;

                    scope.stage.update();

                }
            }
        }
    });