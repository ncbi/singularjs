module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    version: {
      typescript: {
        options: {
          prefix: '[^\\-]version:string[\'"]?\\s*[:=]\\s*[\'"]',
        },
        src: ['src/js/interface.ts'],
      },
    },

    typescript: {
      base: {
        src: ['src/js/*.ts'],
        dest: 'src/js',
        options: {
          sourceMap: true,
        },
      },
    },

    copy: {
      main: {
        files: [
          { expand: true,
            cwd: 'src',
            src: '**',
            dest: 'dist/', 
          },
        ],
      },
    },

    concat: {
      // 2. Configuration js src files goes here.
      js: {
        src: [
          "src/js/crossfilter_1.3.7_quicksort_modified.js",
          "src/js/dc_1.7.5_modified.js",
          "src/js/interface.js",
          "src/js/angular-singular.js"],
        dest: 'dist/Singular.js'
      },
      css: {
        src: ["bower_components/dcjs/dc.css", "src/css/angular-singular.css"],
        dest: 'dist/Singular.css'
      }
    },

    uglify: {
      build: {
        src: 'dist/Singular.js',
        dest: 'dist/Singular.min.js'
      }
    },

    cssmin: {
      cssbuild: {
        src: 'dist/Singular.css',
        dest: 'dist/Singular.min.css'
      }
    },
    // FIXME: get this working
    // watch: {
    //     scripts: {
    //         files: ['src/**/*.ts'],
    //         tasks: ['typescript'],
    //     },
    // },
    // Compile less -> css
    less: {
      components: {
        options: {},
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['css/*.less'],
            dest: 'src',
            ext: '.css',
          },
        ],
      },
    },
  });

  grunt.registerTask('compile', 
    ['version', 'typescript', 'less', ]);
  grunt.registerTask('default', 
    ['compile', 'copy:main', 'concat', 'uglify', 'cssmin']);
};
