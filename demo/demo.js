'use strict';

angular.module('KnobDemoApp', ['ui.knob'])
  .controller('knobCtrl', function ($scope) {
    $scope.value = 65;
    $scope.options = {
      skin: 'simple',               //(default: "simple")
      animate: {
        enabled: true,              //(default: true)
        duration: 1000,             //(default: 1000)
        ease: 'bounce'              //(default: 'bounce')
      },
      size: 200,                    //(default: "200")
      startAngle: 0,                //(default: "0")
      endAngle: 360,                //(default: "360")
      offsetAngle: 0,               //(default: "0")
      readOnly: false,              //(default: "false")
      fgColor: '#543',              //(default: "#")
      bgColor: '#345',              //(default: "#")
      textColor: '#000',            //(default: "#")
      thickness: 50,                //(default: "50")
      displayInput: true,           //(default: "true")
      unit: false,                  //(default: "false")
      step: 1,                      //(default: "1")
      min: 0,                       //(default: "0")
      max: 100,                     //(default: "100")
      lineCap: 'simple',            //(default: "simple")
      displayPrevious: true,        //(default: "true")
    };
  });
