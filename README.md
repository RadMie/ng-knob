ng-knob
=============

[![Join the chat at https://gitter.im/RadMie/ng-knob](https://badges.gitter.im/RadMie/ng-knob.svg)](https://gitter.im/RadMie/ng-knob?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> Angular.js directive to Knob component powered by d3.js (without jQuery)

![screenshot](https://cloud.githubusercontent.com/assets/8116937/11868119/ef1c194e-a4b5-11e5-9ebe-40b6ebb9e5cf.png)

Features
-------
- very easy to implement
- without jQuery dependencies
- powered by d3.js
- 2-way data binding
- configurable minimum, maximum values and step
- animated
- shows previous value
- tiny - 11.5kb minified
- great ability to configure
- configurable scale
- touch, click and drag events implemented

#### Dependencies

- AngularJS (tested with 1.4.x although it probably works with older versions)
- D3.js (tested with 3.5.x although it probably works with older versions)

#### Browser Support

- Chrome, Firefox, Safari, Opera, IE9+

Get started
-------

#### Installation
You can also use bower to install the component:
```bash
$ bower install ng-knob --save
```

#### Usage

###### HTML:
```html
<body ng-app="KnobDemoApp">
  <div ng-controller="knobCtrl">
    <ui-knob value="value" options="options"></ui-knob>
  </div>
</body>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.10/d3.min.js"></script>
<script src="bower_components/ng-knob/dist/ng-knob.min.js"></script>
```
###### Angular.js:

```javascript
var app = angular.module('KnobDemoApp', ['ui.knob'])
app.controller('knobCtrl', function ($scope) {
  $scope.value = 65;
  $scope.options = {
    size: 300
    //other options
  };
});
```

Options
-------

###### You can pass these options to the initialize function to set a custom look and feel for the plugin.

| Property         | Type         | Default                                                                                               | Description                                                                                  |
|------------------|--------------|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| skin             | object       | { type: 'simple', width: 10, color: 'rgba(255,0,0,.5)', spaceWidth: 5 }                               | Type: `simple` or `tron`                                                                     |
| animate          | object       | { enabled: true, duration: 1000, ease: 'bounce' }                                                     | Duration in milliseconds, Ease: `linear`, `bounce`, `sin`, `cubic`, `quad`, `exp`, `circle`  |
| size             | integer      | 200                                                                                                   | Size of knob in px. It will always be a square                                               |
| startAngle	     | integer      | 0                                                                                                     | Start angle in degrees                                                                       |
| endAngle         | integer      | 360                                                                                                   | End angle in degrees                                                                         |
| unit             | string       | ''                                                                                                    | Unit values                                                                                  |
| displayInput     | boolean      | true                                                                                                  | Display input value (`true` or `false`)                                                      |
| inputFormatter     | function      | function(value){ return value; }                                                                   | Formats the input value **before appending the `unit`** and displaying it to the DOM                                                      |
| readOnly         | boolean      | false                                                                                                 | Disabled change value (`true` or `false`)                                                    |
| trackWidth       | integer      | 50                                                                                                    | Width track bar in px                                                                        |
| barWidth         | integer      | 50                                                                                                    | Width bar value in px                                                                        |
| trackColor       | string       | 'rgba(0,0,0,0)'                                                                                       | Color track bar                                                                              |
| barColor         | string       | 'rgba(255,0,0,.5)'                                                                                    | Color bar value                                                                              |
| prevBarColor     | string       | 'rgba(0,0,0,0)'                                                                                       | Color bar previous value                                                                     |
| textColor        | string       | '#222'                                                                                                | Text color                                                                                   |
| barCap           | integer      | 0                                                                                                     | Defines how the ending of the bar line looks like in radius                                  |
| fontSize         | string       | 'auto'                                                                                                | Font size in px. `auto`: automatic change                                                    |
| subText          | object       | { enabled: false, text: '', color: 'gray', font: 'auto' }                                             | Subtext options                                                                              |
| bgColor          | string       | ''                                                                                                    | Background color                                                                             |
| scale            | object       | { enabled: false, type: 'lines', color: 'gray', width: 4, quantity: 20, height: 10, spaceWidth: 15 }  | Scale options, type: `lines` or `dots`                                                       |
| step             | integer      | 1                                                                                                     | Step change, min `0.1`                                                                       |
| displayPrevious  | boolean      | false                                                                                                 | Display previous value (`true` or `false`)                                                   |
| min              | integer      | 0                                                                                                     | Min value (start value), only integer                                                        |
| max              | integer      | 100                                                                                                   | Max value (end value), only integer                                                          |
| dynamicOptions   | boolean      | false                                                                                                 | Dynamic change options (`true` or `false`)                                                   |

Contributing
-------

1. Fork the repo
2. Install dependencies: `npm install` and `bower install`
3. Run: `grunt`
4. Make your changes
5. Submit pull request

License
-------

Licensed under the MIT license
