'use strict';

(function(){

  var ui = {};

  var Knob = function(element, value, options) {

  };

  ui.Knob = Knob;

  ui.knobDirective = function() {
    return  {
      restrict: 'E',
      scope: {
        value: '=',
        options: '='
      },
      link: function (scope, element, attrs) {
        scope.value = scope.value || 0;
        var defaultOptions = {
          skin: 'simple',
          animate: true,
          animateDuration: 1000,
          size: 240,
          startAngle: 0,
          endAngle: 360,
          offsetAngle: 0,
          readOnly: false,
          fgColor: '#543',
          bgColor: '#345',
          textColor: '#000',
          thickness: 50,
          displayInput: true,
          unit: false,
          step: 1,
          min: 0,
          max: 100,
          lineCap: 'simple',
          displayPrevious: true,
				};
        scope.options = angular.extend(defaultOptions, scope.options);
        var knob = new ui.Knob(element[0], scope.value, scope.options);

        scope.$watch('value', function(newValue, oldValue) {
          if((newValue !== null || typeof newValue !== 'undefined') && typeof oldValue !== 'undefined' && newValue !== oldValue) {
            //setValue
          }
        });

      }
    };
  };

  angular.module('ui.knob', []).directive('uiKnob', ui.knobDirective);
})();
