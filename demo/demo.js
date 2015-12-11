'use strict';

angular.module('KnobDemoApp', ['ui.knob'])
  .controller('knobCtrl1', function ($scope) {
    $scope.value = 65;
    $scope.options = {
      skin: 'tron',               //(default: "simple")
      animate: {
        enabled: true,              //(default: true)
        duration: 1000,             //(default: 1000)
        ease: 'bounce'              //(default: 'bounce')
      },
      size: 200,                    //(default: "200")
      startAngle: 0,                //(default: "0")
      endAngle: 360,                //(default: "360")
      unit: "%",                    //(default: "false")
      displayInput: true,           //(default: "true")
      readOnly: false,              //(default: "false")
      trackWidth: 50,
      barWidth: 40,
      trackColor: "rgba(255,0,0,.1)",
      barColor: "rgba(255,0,0,.5)",
      prevBarColor: "rgba(0,0,0,.2)",
      textColor: '#222',            //(default: "#")
      barCap: 0,

      //offsetAngle: 0,               //(default: "0")
      //step: 1,                      //(default: "1")
      //min: 0,                       //(default: "0")
      //max: 100,                     //(default: "100")
      //displayPrevious: true,        //(default: "true")
      //scaleColor
      //scaleLength
    };
  })
  .controller('knobCtrl2', function ($scope) {
    $scope.value = 50;
    $scope.options = {
      skin: "simple",
      trackWidth: 50,
      barWidth: 50
    };
  });
