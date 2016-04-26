'use strict';
var extend = require('extend');


const demoHtmls = [
  'index.html',
  'bar-chart.html',
  'multi-bar-charts.html',
  'filtering.html',
  'multi-row-charts.html',
  'time-series-bar-chart.html',
  // FIXME: why does this one have an underscore?
  'angular_singular.html',
];



module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  // Helpers to set up the usemin config.
  // It's a little bit tricky to add custom options to one of the steps 
  // controlled by usemin. 

  // Add custom options to one of the usemin-generated steps.
  function addOptions(opts) {
    return function(context, block) {
      context.options.generated.options = opts;
    };
  };

  // These are the options we'll add to the `concat` task; it adds some banners 
  // and file markers to the concatenated output files.
  const concatOpts = {
    // This is the banner at the top of the concatenated file
    banner:
      '/*******************************************/\n' +
      '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n',

    // The per-file banner:
    process: function(src, filepath) {
      return '/**********************************************/\n' + 
        '/* ' + filepath + ' */\n\n' +
        src;
    },
  };

  // Prefixes each of an array of strings
  function prefix(pfx, arr) {
    return arr.map(x => pfx + x);
  }


  var defaultConfig = {
    pkg: grunt.file.readJSON('package.json'),

    // This takes the version number from package.json and propogates it to
    // bower.json and src/js/interface.js
    version: {
      bower: {
        src: 'bower.json',
      },
      typescript: {
        src: 'src/js/interface.ts',
        options: {
          prefix: '[^\\-]version:string[\'"]?\\s*[:=]\\s*[\'"]',
        },
      },
    },

    typescript: {
      base: {
        src: 'src/js/*.ts',
        dest: 'src/js',
        options: {
          sourceMap: true
        }
      }
    },

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
            ext: '.css'
          }
        ]
      }
    },

    copy: {
      main: {
        files: [
          { expand: true,
            cwd: 'src',
            src: '*.*',
            dest: 'dist'
          },
          { expand: true,
            cwd: 'src/json',
            src: '*.*',
            dest: 'dist/json'
          }
        ]
      },

      // The end results of usemin are copied from tmp:
      // - unminified/concat/singular.(js|css)  =>  dist/singular.(js|css)
      // - minified/singular.(js|css)  =>  dist/singular.min.(js|css)
      products: {
        files: [
          { src: 'tmp/unminified/concat/singular.js',
            dest: 'dist/singular.js', },        
          { src: 'tmp/unminified/concat/singular.css',
            dest: 'dist/singular.css', },
          { src: 'tmp/minified/singular.js',
            dest: 'dist/singular.min.js', },
          { src: 'tmp/minified/singular.css',
            dest: 'dist/singular.min.css', },
        ],
      },
    },

    // FIXME: get this working
    // watch: {
    //     scripts: {
    //         files: ['src/**/*.ts'],
    //         tasks: ['typescript'],
    //     },
    // },

    useminPrepare: {
      options: {
        dest: 'tmp/minified',
        staging: 'tmp/unminified',
        flow: { 
          steps: { 
            js: ['concat', 'uglify'], 
            css: ['concat', 'cssmin'],
          }, 
          post: {
            // Only need this once; it inserts `options` at the top-level of
            // the concat:generated target, so the `css` step finds it, too.
            'js': [
              { name: 'concat',
                createConfig: addOptions(concatOpts),
              },
            ],
          },
        },
      },
      html: 'src/index.html',
    },

    usemin: {
      html: prefix('dist/', demoHtmls),
    },
  };

  var config = extend(true, {}, defaultConfig);
  grunt.initConfig(config);

  // Sync version number everywhere, then compile. This task is needed before
  // the demos in `src` will work.
  grunt.registerTask('compile', [
    'version', 
    'typescript', 
    'less',
  ]);

  // Concatenate and minify the source js and css; process HTML files with
  // usemin blocks, and put results in dist.
  grunt.registerTask('catmin', [
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin',
    'copy:products',
  ]);

  grunt.registerTask('default', [
    'compile',
    'copy:main',
    'catmin',
  ]);
};
