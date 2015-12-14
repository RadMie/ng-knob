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
          beautify: true,
          compress: false
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
    },
    /**************************************************
    *  CSS autoprefixer
    *  https://github.com/nDmitry/grunt-autoprefixer
    ***************************************************/
    autoprefixer: {
      options: {
        browsers: ["last 2 version"]
      },
      demo: {
        src: 'demo/demo.css'
      },
    },
    /**************************************************
    *  Lint CSS files with csslint
    *  https://github.com/gruntjs/grunt-contrib-csslint
    ***************************************************/
    csslint: {
      options: {
        import: 2
      },
      demo: {
        src: "demo/demo.css"
      }
    },
    /**************************************************
    *  Connect web server
    *  https://github.com/gruntjs/grunt-contrib-connect
    ***************************************************/
    connect: {
      server: {
        options: {
          open: true,
          port: 9000,
          livereload: 35729,
          debug: false,
          //keepalive: true,
          base: './'
        }
      }
    },
    /**************************************************
    *  Watch
    *  https://github.com/gruntjs/grunt-contrib-watch
    ***************************************************/
    watch: {
      css: {
        files: ['demo/demo.css'],
        tasks: ['autoprefixer', 'csslint'],
        options: {
          livereload: '<%= connect.server.options.livereload %>'
        }
      },
      gruntfile: {
        files: ['gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
      source: {
        files: ['src/ng-knob.js'],
        tasks: ['jshint:source', 'uglify'],
        options: {
          livereload: '<%= connect.server.options.livereload %>'
        }
      },
      demo: {
        files: ['demo/demo.js'],
        tasks: ['jshint:demo'],
        options: {
          livereload: '<%= connect.server.options.livereload %>'
        }
      },
      html: {
        files: ['index.html'],
        options: {
          livereload: '<%= connect.server.options.livereload %>'
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
  grunt.registerTask('build', ['jshint', 'uglify', 'autoprefixer', 'csslint']);
  grunt.registerTask('server', ['connect']);
  grunt.registerTask('default', ['build', 'server', 'watch']);
};
