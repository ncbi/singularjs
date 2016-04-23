module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: '*.*',
                        dest: 'dist'
                    },
                    {
                        expand: true,
                        cwd: 'src/json',
                        src: '*.*',
                        dest: 'dist/json'
                    }
                ]
            }
        },

        concat: {
            // JavaScript src files
            js: {
                src: [
                    "src/js/crossfilter_1.3.7_quicksort_modified.js",
                    "src/js/dc_1.7.5_modified.js",
                    "src/js/interface.js",
                    "src/js/angular-singular.js"],
                dest: 'dist/singular.js'
            },
            css: {
                src: ["vendor/dcjs-1.7.5/dc.css", "src/css/angular-singular.css"],
                dest: 'dist/singular.css'
            }
        },

        uglify: {
            build: {
                src: 'dist/singular.js',
                dest: 'dist/singular.min.js'
            }
        },

        cssmin: {
            cssbuild: {
                src: 'dist/singular.css',
                dest: 'dist/singular.min.css'
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
                        ext: '.css'
                    }
                ]
            }
        }
    });

    grunt.registerTask('compile',
        ['version', 'typescript', 'less',]);
    grunt.registerTask('default',
        ['compile', 'copy:main', 'concat', 'uglify', 'cssmin']);
};
