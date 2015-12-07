'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    csslint: {
      demo: {
        src: "demo/demo.css"
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'dist/ng-knob.min.js': 'src/ng-knob.js'
        }
      }
    }
  });

  grunt.registerTask('default', ['uglify', 'csslint']);

};
