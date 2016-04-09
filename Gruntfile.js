module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration js src files goes here.
            js: {
                src: [
                    "src/js/crossfilter_1.3.7_quicksort_modified.js",
                    "src/js/dc_1.7.5_modified.js",
                    "src/js/interface.js"],
                dest: 'dist/Singular.js'
            },
            css: {
                src: ["bower_components/dcjs/dc.css"],
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
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-css');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};
