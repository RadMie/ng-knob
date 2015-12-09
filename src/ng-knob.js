'use strict';

(function(){

  var ui = {};

  var Knob = function(element, value, options) {
    this.element = element;
    this.value = value;
    this.options = options;
    this.inDrag = false;

    this.offset = 100;
  };

  Knob.prototype.createArcs = function() {
    function createArc(size, thickness, startAngle, endAngle) {
      var outerRadius = parseInt((size / 2), 10),
      arc = d3.svg.arc()
      .innerRadius(outerRadius - thickness)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);
      return arc;
    }
    this.changeArc = createArc(this.options.size, this.options.thickness, this.valueToRadians(this.options.startAngle, 360), this.valueToRadians(this.options.startAngle, 360));
    this.valueArc = createArc(this.options.size, this.options.thickness, this.valueToRadians(this.options.startAngle, 360), this.valueToRadians(this.options.startAngle, 360));
    this.interactArc = createArc(this.options.size, this.options.thickness, this.valueToRadians(this.options.startAngle, 360), this.valueToRadians(this.options.endAngle, 360));
  };

  Knob.prototype.valueToRadians = function(value, d, e, s) {
    var r;
    d = d || 100;
    e = e || 360;
    s = s || 0;
    r = e - s;
    return (s + ((r/d) * value)) * (Math.PI/180);
  };

  Knob.prototype.radiansToValue = function(radians, d, e, s) {
    var r;
    d = d || 100;
    e = e || 360;
    s = s || 0;
    r = e - s;
    return Math.round(((180/Math.PI) * Math.abs(radians)) * (d/r));
  };

  Knob.prototype.draw = function(update) {
    var that = this;
    that.createArcs();

    var svg = d3.select(that.element)
    .append('svg')
    .attr("width", that.options.size)
    .attr("height", that.options.size);

    var changeElem = drawArc(that.changeArc, 'changeArc');
    var valueElem = drawArc(that.valueArc, 'valueArc');

    var dragBehavior = d3.behavior.drag()
    .on('drag', dragInteraction)
    .on('dragend', clickInteraction);

    drawArc(that.interactArc, 'interactArc', clickInteraction, dragBehavior);

    if (that.options.animate) {
      animate(that.valueToRadians(that.options.startAngle, 360), that.valueToRadians(that.value, 100, that.options.endAngle, that.options.startAngle));
    } else {
      that.changeArc.endAngle(this.valueToRadians(this.value, 100, this.options.endAngle, this.options.startAngle));
      changeElem.attr('d', that.changeArc);
      that.valueArc.endAngle(this.valueToRadians(this.value, 100, this.options.endAngle, this.options.startAngle));
      valueElem.attr('d', that.valueArc);
    }

    svg.append('text')
    .attr('class', 'text')
    .attr('id', 'text')
    .text(that.value+"%")
    .attr('transform', 'translate(' + (that.offset-12) + ', ' + (that.offset+2) + ')');

    function drawArc(arc, label, click, drag) {
      var elem = svg.append('path')
      .attr('class', label)
      .attr('id', label)
      .attr('d', arc)
      //.style({"fill": "red", "fill-opacity": 0.5})
      .attr('transform', 'translate(' + (that.offset) + ', ' + (that.offset) + ')');

      if (click) {
        elem.on('click', click);
      }

      if (drag) {
        elem.call(drag);
      }

      return elem;
    }

    function animate(start, end) {

      valueElem
      .transition()
      .ease('bounce')
      .duration(that.options.animateDuration)
      .tween('',function() {
        var i = d3.interpolate(start,end);
        return function(t) {
          var val = i(t);
          valueElem.attr('d', that.valueArc.endAngle(val));
          changeElem.attr('d', that.changeArc.endAngle(val));
        };
      });
    }

    function dragInteraction() {
      that.inDrag = true;
      var x = d3.event.x - that.offset;
      var y = d3.event.y - that.offset;
      interaction(x,y, false);
    }

    function clickInteraction() {
      that.inDrag = false;
      var coords = d3.mouse(this.parentNode);
      var x = coords[0] - that.offset;
      var y = coords[1] - that.offset;
      interaction(x,y, true);
    }

    function interaction(x,y, isFinal) {
      var arc = Math.atan(y/x)/(Math.PI/180), radians, delta;
      if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        delta = 90;
      } else {
        delta = 270;
      }
      radians = ((delta-that.options.startAngle) + arc) * (Math.PI/180);
      that.value = that.radiansToValue(radians, 100, that.options.endAngle, that.options.startAngle);
      if(that.value >= 0 && that.value <= 100) {
        update(that.value);
        that.valueArc.endAngle(that.valueToRadians(that.value, 100, that.options.endAngle, that.options.startAngle));
        d3.select(that.element).select('#valueArc').attr('d', that.valueArc);
        if (isFinal) {
          that.changeArc.endAngle(that.valueToRadians(that.value, 100, that.options.endAngle, that.options.startAngle));
          d3.select(that.element).select('#changeArc').attr('d', that.changeArc);
        }
        d3.select(that.element).select('#text').text(that.value+"%");
      }
    }
  };

  Knob.prototype.setValue = function(newValue) {
    if ((!this.inDrag) && this.value >= 0 && this.value <= 100) {
      var radians = this.valueToRadians(newValue, 100, this.options.endAngle, this.options.startAngle);
      this.value = newValue;
      this.changeArc.endAngle(radians);
      d3.select(this.element).select('#changeArc').attr('d', this.changeArc);
      this.valueArc.endAngle(radians);
      d3.select(this.element).select('#valueArc').attr('d', this.valueArc);
      d3.select(this.element).select('#text').text(newValue+"%");
    }
  };

  ui.Knob = Knob;

  ui.knobDirective = function() {
    return  {
      restrict: 'E',
      scope: {
        value: '=',
        options: '='
      },
      link: function (scope, element) {
        scope.value = scope.value || 0;
        var defaultOptions = {
          skin: 'simple',
          animate: true,
          animateDuration: 1000,
          size: 200,
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
            knob.setValue(newValue);
          }
        });

        knob.draw(function(value) {
          scope.$apply(function() {
            scope.value = value;
          });
        });
      }
    };
  };

  angular.module('ui.knob', []).directive('uiKnob', ui.knobDirective);
})();
