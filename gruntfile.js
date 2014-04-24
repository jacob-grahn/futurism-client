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

        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        // Time how long tasks take. Can help when optimizing build times
        require('time-grunt')(grunt);

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
                js: {
                    files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.js']
                },
                tests: {
                    files: ['test/spec/**/*.js'],
                    tasks: ['newer:jshint:test', 'karma']
                },
                sass: {
                    files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                    tasks: ['sass']
                },
                styles: {
                    files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                    tasks: ['newer:copy:styles', 'autoprefixer']
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
            
            // serve static files
            // The actual grunt server settings
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
                                    '!\\.html|\\.js|\\.css|\\.swf|\\.json|\\.mp3|\\.ogg|\\.png|\\.jpg$ /index.html'
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
                    files: [{
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }]
                }
            },


            // Compile Sass to CSS
            sass: {
                dist: {
                    options: {
                        includePaths: ['<%= yeoman.app %>/bower_components']
                    },
                    files: {
                        '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
                    }
                }
            },

            // Renames files for browser caching purposes
            rev: {
                dist: {
                    files: {
                        src: [
                            '<%= yeoman.dist %>/scripts/{,*/}*.js',
                            '<%= yeoman.dist %>/styles/{,*/}*.css',
                            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                            '<%= yeoman.dist %>/styles/fonts/*'
                        ]
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
            svgmin: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.svg',
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
                            'bower_components/**/*',
                            'images/{,*/}*.{webp}',
                            'fonts/*',
                            'data/*',
                            'sounds/*'
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
                    'svgmin',
                    'htmlmin'
                ]
            },


            // Test settings
            karma: {
                unit: {
                    configFile: 'test/karma.conf.js',
                    singleRun: true
                },
                watch: {
                    configFile: 'test/karma.conf.js',
                    autoWatch: true
                }
            },



            // Postpone whatever tasks come after this one
            wait: {
                options: {
                    delay: 2500
                },
                after: function () {
                    return 'wait does not seem to work unless this function exists';
                }
            },


            // e2e test runner
            protractor: {
                options: {
                    configFile: 'protractor.conf.js',
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    noColor: false, // If true, protractor will not use colors in its output.
                    args: {
                        // Arguments passed to the command
                    }
                }
            }

        });



        grunt.registerTask('serve', function (target) {
            if (target === 'dist') {
                return grunt.task.run(['build', 'develop']);
            }

            grunt.task.run([
                'clean:server',
                'concurrent:server',
                'autoprefixer',
                'configureProxies:server',
                'connect:livereload',
                'watch'
            ]);
        });


        grunt.registerTask('test', [
            'concurrent:test',
            'autoprefixer',
            'karma'
        ]);


        grunt.registerTask('watch-tests', [
            'karma:watch'
        ]);


        grunt.registerTask('build', [
            'clean:dist',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'ngmin',
            'htmlmin',
            'copy:dist',
            'cssmin',
            'uglify',
            //'rev',
            'usemin',
            'htmlrefs'
        ]);


        grunt.registerTask('default', [
            'newer:jshint',
            'test',
            'build'
        ]);
    };
}());