'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*******************************************************\n' +
            ' * Name:          <%= pkg.name %>\n' +
            ' * Description:   <%= pkg.description %>\n' +
            ' * Version:       <%= pkg.version %>\n' +
            ' * Homepage:      <%= pkg.homepage %>\n' +
            ' * Licence:       <%= pkg.license %>\n' +
            ' *******************************************************/\n',

    csslint: {
      demo: {
        src: "demo/demo.css"
      }
    },
    /**************************************************
    *  Validate files with JSHint
    *  https://github.com/gruntjs/grunt-contrib-jshint
    ***************************************************/
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'gruntfile.js'
      },
      source: {
        src: 'src/ng-knob.js'
      },
      demo: {
        src: 'demo/demo.js'
      }
    },
    /**************************************************
    *  Minify files with UglifyJS
    *  https://github.com/gruntjs/grunt-contrib-uglify
    ***************************************************/
    uglify: {
      development: {
        options: {
          banner: '<%= banner %>',
          mangle: false,
          beautify: true
        },
        files: {
          'dist/ng-knob.js': 'src/ng-knob.js'
        }
      },
      production: {
        options: {
          banner: '<%= banner %>',
          mangle: false
        },
        files: {
          'dist/ng-knob.min.js': 'src/ng-knob.js'
        }
      }
    }
  });

  /**************************************************
  *  Load multiple grunt tasks
  *  https://github.com/sindresorhus/load-grunt-tasks
  ***************************************************/
  require('load-grunt-tasks')(grunt);

  /**************************************************
  *  Register task
  ***************************************************/
  grunt.registerTask('default', ['jshint', 'uglify', 'csslint']);

};
