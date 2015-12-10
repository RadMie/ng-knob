'use strict';

(function(){

  var ui = {};
  /**
   *   Constructor
   */
  var Knob = function(element, value, options) {
    this.element = element;
    this.value = value;
    this.options = options;
    this.inDrag = false;
  };
  /**
   *   Convert a value from 0-100 to radians
   */
  Knob.prototype.valueToRadians = function(value, d, e, s) {
    var r;
    d = d || 100;
    e = e || 360;
    s = s || 0;
    r = e - s;
    return (s + ((r/d) * value)) * (Math.PI/180);
  };
  /**
   *   Convert radians to a value 0-100
   */
  Knob.prototype.radiansToValue = function(radians, d, e, s) {
    var r;
    d = d || 100;
    e = e || 360;
    s = s || 0;
    r = e - s;
    return Math.round(((180/Math.PI) * Math.abs(radians)) * (d/r));
  };
  /**
   *   Create the arc
   */
  Knob.prototype.createArc = function(innerRadius, outerRadius, startAngle, endAngle) {
    var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle);
    return arc;
  };
  /**
   *   Draw the arc
   */
  Knob.prototype.drawArc = function(svg, arc, label, style, click, drag) {
    var elem = svg.append('path')
    .attr('class', label)
    .attr('d', arc)
    .style(style)
    .attr('transform', 'translate(' + (this.options.size / 2) + ', ' + (this.options.size / 2) + ')');

    if(this.options.readOnly === false) {
      if (click) {
        elem.on('click', click);
      }
      if (drag) {
        elem.call(drag);
      }
    }
    return elem;
  };
  /**
   *   Create the arcs
   */
  Knob.prototype.createArcs = function(skin) {
    var outerRadius = parseInt((this.options.size / 2), 10),
        innerRadius = outerRadius - this.options.thickness,
        startAngle = this.valueToRadians(this.options.startAngle, 360);

    if(skin === "simple") {
      this.changeArc = this.createArc(innerRadius, outerRadius, startAngle, startAngle);
      this.valueArc = this.createArc(innerRadius, outerRadius, startAngle, startAngle);
      this.interactArc = this.createArc(innerRadius, outerRadius, startAngle, this.valueToRadians(this.options.endAngle, 360));

    } else if (skin === "tron") {
      this.hoopArc = this.createArc(outerRadius * 0.95, outerRadius, startAngle, this.valueToRadians(this.options.endAngle, 360));
      this.changeArc = this.createArc(innerRadius, (outerRadius * 0.95) - (outerRadius * 0.05), startAngle, startAngle);
      this.valueArc = this.createArc(innerRadius, (outerRadius * 0.95) - (outerRadius * 0.05), startAngle, startAngle);
      this.interactArc = this.createArc(innerRadius, (outerRadius * 0.95) - (outerRadius * 0.05), startAngle, this.valueToRadians(this.options.endAngle, 360));
    }
  };
  /**
   *   Draw the arcs
   */
  Knob.prototype.drawArcs = function(skin, clickInteraction, dragBehavior) {
    var svg = d3.select(this.element)
    .append('svg')
    .attr("width", this.options.size)
    .attr("height", this.options.size);

    if(this.options.displayInput) {
      svg.append('text')
      .attr('class', 'text')
      .attr("text-anchor", "middle")
      .attr("font-size", (this.options.size*0.2) + "px")
      .style("fill", this.options.textColor)
      .text(this.value + this.options.unit || "")
      .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size*0.05)) + ')');
    }
    if(skin === "simple") {
      this.changeElem = this.drawArc(svg,this.changeArc, 'changeArc', {"fill": "black", "fill-opacity": 0.2});
      this.valueElem = this.drawArc(svg,this.valueArc, 'valueArc', {"fill": "red", "fill-opacity": 0.5});
      this.drawArc(svg,this.interactArc, 'interactArc', {"fill": "red", "fill-opacity": 0.1, "cursor": "pointer"}, clickInteraction, dragBehavior);

    } else if (skin === "tron") {
      this.drawArc(svg, this.hoopArc, 'hoopArc', {"fill": "black", "fill-opacity": 0.8});
      this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', {"fill": "black", "fill-opacity": 0.2});
      this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', {"fill": "red", "fill-opacity": 0.5});
      this.drawArc(svg, this.interactArc, 'interactArc', {"fill": "red", "fill-opacity": 0.1, "cursor": "pointer"}, clickInteraction, dragBehavior);
    }
  };
  /**
   *   Draw knob component
   */
  Knob.prototype.draw = function(update) {
    var that = this;

    that.createArcs(that.options.skin);

    var dragBehavior = d3.behavior.drag()
    .on('drag', dragInteraction)
    .on('dragend', clickInteraction);

    that.drawArcs(that.options.skin, clickInteraction, dragBehavior);

    if(that.options.animate.enabled) {
      that.valueElem.transition().ease(that.options.animate.ease).duration(that.options.animate.duration).tween('',function() {
        var i = d3.interpolate(that.valueToRadians(that.options.startAngle, 360), that.valueToRadians(that.value, 100, that.options.endAngle, that.options.startAngle));
        return function(t) {
          var val = i(t);
          that.valueElem.attr('d', that.valueArc.endAngle(val));
          that.changeElem.attr('d', that.changeArc.endAngle(val));
        };
      });
    } else {
      that.changeArc.endAngle(this.valueToRadians(this.value, 100, this.options.endAngle, this.options.startAngle));
      that.changeElem.attr('d', that.changeArc);
      that.valueArc.endAngle(this.valueToRadians(this.value, 100, this.options.endAngle, this.options.startAngle));
      that.valueElem.attr('d', that.valueArc);
    }

    function dragInteraction() {
      that.inDrag = true;
      var x = d3.event.x - (that.options.size / 2);
      var y = d3.event.y - (that.options.size / 2);
      interaction(x,y, false);
    }

    function clickInteraction() {
      that.inDrag = false;
      var coords = d3.mouse(this.parentNode);
      var x = coords[0] - (that.options.size / 2);
      var y = coords[1] - (that.options.size / 2);
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
        d3.select(that.element).select('.valueArc').attr('d', that.valueArc);
        if (isFinal) {
          that.changeArc.endAngle(that.valueToRadians(that.value, 100, that.options.endAngle, that.options.startAngle));
          d3.select(that.element).select('.changeArc').attr('d', that.changeArc);
        }
        if(that.options.displayInput) {
          d3.select(that.element).select('.text').text(that.value + that.options.unit || "");
        }
      }
    }
  };
  /**
   *   Set a value
   */
  Knob.prototype.setValue = function(newValue) {
    if ((!this.inDrag) && this.value >= 0 && this.value <= 100) {
      var radians = this.valueToRadians(newValue, 100, this.options.endAngle, this.options.startAngle);
      this.value = newValue;
      this.changeArc.endAngle(radians);
      d3.select(this.element).select('.changeArc').attr('d', this.changeArc);
      this.valueArc.endAngle(radians);
      d3.select(this.element).select('.valueArc').attr('d', this.valueArc);
      if(this.options.displayInput) {
        d3.select(this.element).select('.text').text(newValue + this.options.unit || "");
      }
    }
  };

  ui.Knob = Knob;
  /**
   *   Angular knob directive
   */
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
          animate: {
            enabled: true,
            duration: 1000,
            ease: 'bounce'
          },
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
