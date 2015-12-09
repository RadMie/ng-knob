'use strict';

angular.module('KnobDemoApp')
  .controller('knobCtrl', function ($scope) {
    $scope.value = 65;
    $scope.options = {
      skin: 'simple',               //(default: "simple")
      animate: true,                //(default: "true")
      animate-duration: 1000,       //(default: "1000")
      size: 240,                    //(default: "240")
      start-angle: 0,               //(default: "0")
      end-angle: 360,               //(default: "360")
      offset-angle: 0,              //(default: "0")
      read-only: false,             //(default: "false")
      fg-color: '#543',             //(default: "#")
      bg-color: '#345',             //(default: "#")
      text-color: '#000',           //(default: "#")
      thickness: 50,                //(default: "50")
      display-input: true,          //(default: "true")
      unit: false,                  //(default: "false")
      step: 1,                      //(default: "1")
      min: 0,                       //(default: "0")
      max: 100,                     //(default: "100")
      line-cap: 'simple',           //(default: "simple")
      display-previous: true,       //(default: "true")
    };
  });
