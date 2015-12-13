'use strict';

angular.module('KnobDemoApp', ['ui.knob'])
  .controller('knobCtrl1', function ($scope) {
    $scope.value = 65;
    $scope.options = {
      skin: 'tron',                       //(default: 'simple')
      animate: {
        enabled: true,                    //(default: true)
        duration: 1000,                   //(default: 1000)
        ease: 'bounce'                    //(default: 'bounce')
      },
      size: 300,                          //(default: 200)
      startAngle: 0,                      //(default: 0)
      endAngle: 360,                      //(default: 360)
      unit: "%",                          //(default: '')
      displayInput: true,                 //(default: true)
      readOnly: false,                    //(default: fasle)
      trackWidth: 50,                     //(default: 50)
      barWidth: 40,                       //(default: 50)
      trackColor: 'rgba(255,0,0,.1)',     //(default: 'rgba(255,0,0,.1)')
      barColor: 'rgba(255,0,0,.5)',       //(default: 'rgba(255,0,0,.5)')
      prevBarColor: 'rgba(0,0,0,.2)',     //(default: 'rgba(0,0,0,.2)')
      textColor: '#222',                  //(default: '#222')
      barCap: 0,                          //(default: 0)
      fontSize: 'auto',                   //(default: 'auto')
      subText: {
        enabled: true,                    //(default: false)
        text: 'CPU used',                 //(default: '')
        color: 'gray',                    //(default: 'gray')
        font: 'auto'                      //(default: 'auto')
      },
      bgColor: '',                        //(default: '')
      scale: {
        enabled: true,                    //(default: false)
        type: 'lines',                    //(default: 'lines')
        color: 'gray',                    //(default: 'gray')
        width: 3,                         //(default: 4)
        quantity: 20,                     //(default: 20)
        height: 10                        //(default: 10)
      },
      step: 5,                            //(default: 1)
      displayPrevious: true,              //(default: true)
      min: -100,                          //(default: 0)
      max: 100                            //(default: 100)
    };
  });
