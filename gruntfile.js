// Generated on 2013-12-01 using generator-angular 0.6.0-rc.2
'use strict';

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
			app: require('./bower.json').appPath || 'client/src',
			dist: 'client/dist',
			server: 'server'
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			options: {
				livereload: true
			},
			server: {
				files: [
					'server/**/*.js'
				],
				tasks: ['develop', 'wait'],
				options: {nospawn: true}
			},
			data: {
				files: ['{.tmp,<%= yeoman.app %>}/data/*']
			},
			js: {
				files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.js']
				//tasks: ['newer:jshint:all']
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			sass: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
				tasks: ['sass', 'autoprefixer']
			},
			styles: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
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




		// Compiles Sass to CSS and generates necessary files if requested
		/*compass: {
		 options: {
		 sassDir: '<%= yeoman.app %>/styles',
		 cssDir: '.tmp/styles',
		 generatedImagesDir: '.tmp/images/generated',
		 imagesDir: '<%= yeoman.app %>/images',
		 javascriptsDir: '<%= yeoman.app %>/scripts',
		 fontsDir: '<%= yeoman.app %>/styles/fonts',
		 importPath: '<%= yeoman.app %>/bower_components',
		 httpImagesPath: '/images',
		 httpGeneratedImagesPath: '/images/generated',
		 httpFontsPath: '/styles/fonts',
		 relativeAssets: false,
		 assetCacheBuster: false
		 },
		 dist: {
		 options: {
		 generatedImagesDir: '<%= yeoman.dist %>/images/generated'
		 }
		 },
		 server: {
		 options: {
		 debugInfo: true
		 }
		 }
		 },*/


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
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
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


		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= yeoman.dist %>/*.html']
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
						'data/*'
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
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},


		// Run the node server in server/test-server.js
		develop: {
			server: {
				file: '<%= yeoman.server %>/test-server.js',
				//env: {NODE_ENV: 'production'},
				nodeArgs: ['--debug']
			}
		},


		// Run unit tests on node server
		jasmine_node: {
			forceExit: false,
			match: '.',
			matchall: false,
			captureExceptions: true,
			extensions: 'js',
			specNameMatcher: 'Spec',
			projectRoot: '<%= yeoman.server %>/spec'
		},


		// Postpone whatever tasks come after this one
		wait: {
			options: {
				delay: 2500
			},
			after: function() {
				console.log('gamble');
				return Math.random() < 0.05 ? false : true;
			}
		},


		// e2e test runner
		protractor: {
			options: {
				configFile: "protractor.conf.js",
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
			'develop',
			'watch'
		]);
	});

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'jasmine_node',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'ngmin',
		'copy:dist',
		'cdnify',
		'cssmin',
		'uglify',
		'rev',
		'usemin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);

	grunt.registerTask('just-server', ['develop', 'watch']);
	grunt.registerTask('unit', ['jasmine_node']);
};