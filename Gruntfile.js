module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    "src/js/dc_1.7.0_modified.js",
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
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['copy:main', 'concat', 'uglify', 'cssmin']);

};
