module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      full_src: {
        options: {
          beautify: true,
          mangle: false,
          banner: '/*!              ~ CLNDR v<%= pkg.version %> ~ \n' +
                  ' * ============================================== \n'  +
                  ' *       https://github.com/kylestetz/CLNDR \n'        +
                  ' * ============================================== \n'  +
                  ' *  created by kyle stetz (github.com/kylestetz) \n'   +
                  ' *        &available under the MIT license \n'         +
                  ' * http://opensource.org/licenses/mit-license.php \n'  +
                  ' * ============================================== \n'  +
                  ' */\n'
        },
        files: {
          './<%= pkg.name %>.js': 'src/<%= pkg.name %>.js'
        }
      },
      mini_src: {
        options: {
          banner: '/*! <%= pkg.name %>.min.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          './<%= pkg.name %>-<%= pkg.version %>.min.js': 'src/<%= pkg.name %>.js'
        }
      }
    },
    less: {
      development: {
       files: {
          "example/styles/clndr.css": "example/styles/clndr.less"
        }
      },
      production: {
        options: {
          compress: true,
          report: "min",
          sourceMap: true
        },
        files: {
          "example/styles/clndr.css": "example/styles/clndr.less"
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      uglify: {
        files: ['src/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
          debounceDelay: 1000 // Don't call uglify more than once per second
        }
      },
      less: {
        files: ['example/styles/*.less'],
        tasks: ['less:development']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'less:production']);

};