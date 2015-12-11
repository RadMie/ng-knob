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
  Knob.prototype.createArc = function(innerRadius, outerRadius, startAngle, endAngle, cornerRadius) {
    var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .cornerRadius(cornerRadius);
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
    startAngle = this.valueToRadians(this.options.startAngle, 360),
    endAngle = this.valueToRadians(this.options.endAngle, 360);

    if(this.options.scale.enabled) {
        outerRadius -= (this.options.scale.width * 2) + this.options.scale.width;
    }
    var trackInnerRadius = outerRadius - this.options.trackWidth,
    changeInnerRadius = outerRadius - this.options.barWidth,
    valueInnerRadius = outerRadius - this.options.barWidth,
    interactInnerRadius = outerRadius - this.options.barWidth,

    trackOuterRadius = outerRadius,
    changeOuterRadius = outerRadius,
    valueOuterRadius = outerRadius,
    interactOuterRadius = outerRadius,
    diff;

    if(this.options.barWidth > this.options.trackWidth) {
      diff = (this.options.barWidth - this.options.trackWidth) / 2;
      trackInnerRadius -= diff;
      trackOuterRadius -= diff;
    } else if(this.options.barWidth < this.options.trackWidth) {
      diff = (this.options.trackWidth - this.options.barWidth) / 2;
      changeOuterRadius -= diff;
      valueOuterRadius -= diff;
      changeInnerRadius -= diff;
      valueInnerRadius -= diff;
      interactInnerRadius = outerRadius - this.options.trackWidth;
    }
    if(this.options.bgColor) {
      this.bgArc = this.createArc(0, outerRadius, startAngle, endAngle);
    }
    if(skin === 'tron') {
      trackOuterRadius = (trackOuterRadius * 0.95) - (trackOuterRadius * 0.05);
      changeOuterRadius = (changeOuterRadius * 0.95) - (changeOuterRadius * 0.05);
      valueOuterRadius = (valueOuterRadius * 0.95) - (valueOuterRadius * 0.05);
      interactOuterRadius = (interactOuterRadius * 0.95) - (interactOuterRadius * 0.05);
      this.hoopArc = this.createArc(outerRadius * 0.95, outerRadius, startAngle, endAngle);
    }

    this.trackArc = this.createArc(trackInnerRadius, trackOuterRadius, startAngle, endAngle);
    this.changeArc = this.createArc(changeInnerRadius, changeOuterRadius, startAngle, startAngle, this.options.barCap);
    this.valueArc = this.createArc(valueInnerRadius, valueOuterRadius, startAngle, startAngle, this.options.barCap);
    this.interactArc = this.createArc(interactInnerRadius, interactOuterRadius, startAngle, endAngle);
  };
  /**
   *   Draw the arcs
   */
  Knob.prototype.drawArcs = function(skin, clickInteraction, dragBehavior) {
    var svg = d3.select(this.element)
    .append('svg')
    .attr("width", this.options.size)
    .attr("height", this.options.size);

    if(this.options.bgColor) {
      this.drawArc(svg, this.bgArc, 'bgArc', { "fill": this.options.bgColor });
    }

    if(this.options.displayInput) {
      var fontSize = (this.options.size*0.15) + "px";
      if(this.options.fontSize !== 'auto') {
        fontSize = this.options.fontSize + "px";
      }
      svg.append('text')
      .attr('class', 'text')
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize)
      .style("fill", this.options.textColor)
      .text(this.value + this.options.unit || "")
      .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size*0.05)) + ')');

      if(this.options.subText.enabled) {
        fontSize = (this.options.size*0.07) + "px";
        if(this.options.subText.font !== 'auto') {
          fontSize = this.options.subText.font + "px";
        }
        svg.append('text')
        .attr('class', 'sub-text')
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize)
        .style("fill", this.options.subText.color)
        .text(this.options.subText.text)
        .attr('transform', 'translate(' + ((this.options.size / 2)) + ', ' + ((this.options.size / 2) + (this.options.size*0.14)) + ')');
      }
    }
    if(this.options.scale.enabled) {
      if(this.options.scale.type === 'dots') {
        var width = this.options.scale.width,
        radius = (this.options.size / 2) - width,
        quantity = this.options.scale.quantity,
        count = 1 / quantity,
        offset = radius + this.options.scale.width,
        angle = 0,
        data = d3.range(quantity).map(function () {
          angle = count * Math.PI * 2;
          count = count + (1 / quantity);
          return {
            cx: offset + Math.cos(angle) * radius,
            cy: offset + Math.sin(angle) * radius,
            r: width
          };
        });
        svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr({
          r: function (d) {
              return d.r;
          },
          cx: function (d) {
              return d.cx;
          },
          cy: function (d) {
              return d.cy;
          },
          fill: this.options.scale.color
        });
      }
    }
    if(skin === 'tron') {
      this.drawArc(svg, this.hoopArc, 'hoopArc', { "fill": this.options.barColor });
    }
    this.drawArc(svg, this.trackArc, 'trackArc', { "fill": this.options.trackColor });
    this.changeElem = this.drawArc(svg, this.changeArc, 'changeArc', { "fill": this.options.prevBarColor });
    this.valueElem = this.drawArc(svg, this.valueArc, 'valueArc', { "fill": this.options.barColor });
    this.drawArc(svg, this.interactArc, 'interactArc', { "fill-opacity": 0, "cursor": "pointer" }, clickInteraction, dragBehavior);
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
          unit: "%",
          displayInput: true,
          readOnly: false,
          trackWidth: 50,
          barWidth: 50,
          trackColor: "rgba(255,0,0,.1)",
          barColor: "rgba(255,0,0,.5)",
          prevBarColor: "rgba(0,0,0,.2)",
          textColor: '#222',
          barCap: 0,
          fontSize: 'auto',
          subText: {
            enabled: false
          },
          bgColor: false,
          scale: {
            enabled: false
          }
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
