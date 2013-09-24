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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

};