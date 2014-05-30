/*jslint node: true */
(function () {
    
    
    'use strict';
    var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
    var modRewrite = require('connect-modrewrite');
    var mountFolder = function (connect, dir) {
        return connect['static'](require('path').resolve(dir));
    };

    // # Globbing
    // for performance reasons we're only matching one level down:
    // 'test/spec/{,*/}*.js'
    // use this if you want to recursively match all subfolders:
    // 'test/spec/**/*.js'

    module.exports = function (grunt) {

        var LIVERELOAD_PORT = 35729;

        grunt.loadNpmTasks('grunt-autoprefixer');
        grunt.loadNpmTasks('grunt-concurrent');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-htmlmin');
        grunt.loadNpmTasks('grunt-contrib-imagemin');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-connect-proxy');
        grunt.loadNpmTasks('grunt-ngmin');
        grunt.loadNpmTasks('grunt-open');
        grunt.loadNpmTasks('grunt-usemin');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-htmlrefs');
        grunt.loadNpmTasks('grunt-contrib-livereload');
        grunt.loadNpmTasks('grunt-merge-json');

    

        // Define the configuration for all the tasks
        grunt.initConfig({

            // Project settings
            yeoman: {
                // configurable paths
                app: require('./bower.json').appPath || 'src',
                dist: 'dist'
            },

            // Watches files for changes and runs tasks based on the changed files
            watch: {
                options: {
                    livereload: true
                },
                data: {
                    files: ['{.tmp,<%= yeoman.app %>}/data/*']
                },
                phrases: {
                    files: ['<%= yeoman.app %>/phrases/*.json'],
                    tasks: ['merge-json']
                },
                js: {
                    files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.js']
                },
                sass: {
                    files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                    tasks: ['sass', 'autoprefixer']
                },
                gruntfile: {
                    files: ['gruntfile.js']
                },
                livereload: {
                    options: {
                        livereload: LIVERELOAD_PORT
                    },
                    files: [
                        '<%= yeoman.app %>/{,*/}*.html',
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            },
            
            
            // merge phrase files togoether
            "merge-json": {
                "phrases": {
                    src: [ "src/phrases/*.json" ],
                    dest: "<%= yeoman.dist %>/data/phrases.json"
                },
                "tmp-phrases": {
                    src: [ "src/phrases/*.json" ],
                    dest: ".tmp/data/phrases.json"
                }
            },
            
            
            
            // serve static files and proxy dynaimic requests to other services
            connect: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: LIVERELOAD_PORT
                },
                proxies: [
                    {
                        context: '/api',
                        host: 'localhost',
                        port: 9001
                    },
                    {
                        context: '/globe',
                        host: 'localhost',
                        port: 9001
                    },
                    {
                        context: '/storage',
                        host: 'localhost',
                        port: 9001
                    }
                ],
                livereload: {
                    options: {
                        open: true,
                        base: [
                            '.tmp',
                            '<%= yeoman.app %>'
                        ],
                        middleware: function (connect) {
                            return [
                                require('grunt-connect-proxy/lib/utils').proxyRequest,
                                modRewrite([
                                    '!\\.html|\\.js|\\.css|\\.swf|\\.json|\\.mp3|\\.ogg|\\.png|\\.jpg|\\.eot|\\.svg|\\.ttf|\\.woff$ /index.html'
                                ]),
                                lrSnippet,
                                mountFolder(connect, '.tmp'),
                                mountFolder(connect, 'src'),
                                mountFolder(connect, '../futurism-shared')
                            ];
                        }
                    }
                }
            },
            

            // Make sure code styles are up to par and there are no obvious mistakes
            jshint: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                all: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/**/*.js'
                ],
                test: {
                    options: {
                        jshintrc: 'test/.jshintrc'
                    },
                    src: ['test/spec/{,*/}*.js']
                }
            },

            // Empties folders to start fresh
            clean: {
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }]
                },
                server: '.tmp'
            },

            // Add vendor prefixed styles
            autoprefixer: {
                options: {
                    browsers: ['last 1 version']
                },
                dist: {
                    src: '.tmp/styles/main-noprefix.css',
                    dest: '.tmp/styles/main.css'
                }
            },


            // Compile Sass to CSS
            sass: {
                dist: {
                    /*options: {
                        includePaths: ['<%= yeoman.app %>/bower_components']
                    },*/
                    files: {
                        '.tmp/styles/main-noprefix.css': '<%= yeoman.app %>/styles/main.scss'
                    }
                }
            },

            // Reads HTML for usemin blocks to enable smart builds that automatically
            // concat, minify and revision files. Creates configurations in memory so
            // additional tasks can operate on them
            useminPrepare: {
                html: '<%= yeoman.app %>/index.html',
                options: {
                    dest: '<%= yeoman.dist %>'
                }
            },

            // Performs rewrites based on rev and the useminPrepare configuration
            usemin: {
                html: ['<%= yeoman.dist %>/index.html'],
                css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
                options: {
                    assetsDirs: ['<%= yeoman.dist %>']
                }
            },

            // The following *-min tasks produce minified files in the dist folder
            imagemin: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }]
                }
            },
            htmlmin: {
                dist: {
                    options: {
                        // Optional configurations that you can uncomment to use
                        // removeCommentsFromCDATA: true,
                        // collapseBooleanAttributes: true,
                        // removeAttributeQuotes: true,
                        // removeRedundantAttributes: true,
                        // useShortDoctype: true,
                        // removeEmptyAttributes: true,
                        // removeOptionalTags: true*/
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }]
                }
            },


            // Allow the use of non-minsafe AngularJS files. Automatically makes it
            // minsafe compatible so Uglify does not destroy the ng references
            ngmin: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }]
                }
            },


            htmlrefs: {
                dist: {
                    /** @required  - string including grunt glob variables */
                    src: '<%= yeoman.dist %>/**/*.html'
                    /** @optional  - string directory name*/
                    //dest: '<%= yeoman.dist %>/**/*.html',
                    /** any other parameter included on the options will be passed for template evaluation */
                    //options: {
                    //    buildNumber: 47878
                    //}
                }
            },


            // Copies remaining files to places other tasks can use
            copy: {
                dist: {
                    files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'images/{,*/}*.{webp}',
                            'data/*',
                            'sounds/*',
                            'styles/*.css',
                            'fonts/*'
                        ]
                    }, {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }]
                },
                styles: {
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    dest: '.tmp/styles/',
                    src: '{,*/}*.css'
                }
            },


            // Run some tasks in parallel to speed up the build process
            concurrent: {
                server: [
                    'sass',
                    'copy:styles'
                ],
                test: [
                    'sass',
                    'copy:styles'
                ],
                dist: [
                    'sass',
                    'copy:styles',
                    'imagemin',
                    'htmlmin'
                ]
            },

        });



        grunt.registerTask('serve', function (target) {
            if (target === 'dist') {
                return grunt.task.run(['build', 'develop']);
            }

            grunt.task.run([
                'clean:server',
                'merge-json:tmp-phrases',
                'sass',
                'copy:styles',
                'autoprefixer',
                'configureProxies:server',
                'connect:livereload',
                'watch'
            ]);
        });


        grunt.registerTask('test', [
            'concurrent:test',
            'autoprefixer'
        ]);


        grunt.registerTask('build', [
            'clean:dist',
            'merge-json',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'ngmin',
            'htmlmin',
            'copy:dist',
            'cssmin',
            'uglify',
            'usemin',
            'htmlrefs'
        ]);


        grunt.registerTask('default', [
            'test',
            'build'
        ]);
    };
}());