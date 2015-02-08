module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            js: {
                // 'js/libs/*.js', // All JS in the libs folder
                // "lib/d3/d3.min.js",
                src: [ "src/js/crossfilter_1.3.7_quicksort_modified.js",
                    "src/js/dc_1.7.0_modified.js",
                    "src/js/CHARTS.js"],
                dest: 'build/dc-charts.js'
            },
            css: {
                src: ["lib/dcjs/dc.css"],
                dest: 'build/dc-charts.css'
            }
        },
        uglify: {
            build: {
                src: 'build/dc-charts.js',
                dest: 'build/dc-charts.min.js'
            }
        },
        cssmin: {
            cssbuild: {
                src: 'build/dc-charts.css',
                dest: 'build/dc-charts.min.css'
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-css');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};
