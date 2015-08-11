module.exports = function(grunt) {
	grunt.initConfig({
		antdeploy: {
			options: {
				// Task-specific options go here.
				user: 'patnaikshekhar@hacktest.com',
				pass: 'hacktest',
				root: 'unpackaged'
			},
			hacktest: {
				// Target-specific file lists and/or options go here.
				pkg: {   // Package to deploy
					apexpage: ['*'],
					staticresource: ['*']
				}
			},
		},

		sass: {
			dist: {
				files: {
					'dist/main.css': 'src/sass/main.scss'
				}
			}
		},

		concat: {
		    options: {
		      separator: '\n',
		    },
		    dist: {
		      src: ['src/app.js', 'src/js/**/*.js'],
		      dest: 'dist/main.js',
		    },
		},

		copy: {
			main: {
				files: [
				// includes files within path
					{ expand: true, cwd: 'src/lib', src: ['**'], dest: 'dist/lib'},
					{ expand: true, cwd: 'src/img', src: ['**'], dest: 'dist/img'}
				],
			},
		},

		watch: {
			scripts: {
				files: ['src/app.js', 'src/js/**/*.js'],
				tasks: ['concat', 'compress', 'antdeploy'],
				options: {
					debounceDelay: 250,
				},
			},
			css: {
				files: 'src/sass/*.scss',
				tasks: ['sass', 'compress', 'antdeploy'],
				options: {
					//livereload: true,
				},
			},
			lib: {
				files: 'src/lib/**/*',
				tasks: ['copy', 'compress', 'antdeploy'],
				options: {
					//livereload: true,
				},
			},
			vf: {
				files: ['unpackaged/pages/*.page', 'unpackaged/pages/*.xml'],
				tasks: ['antdeploy'],
				options: {
					//livereload: true,
				},
			},
			img: {
				files: 'src/img/*',
				tasks: ['copy', 'compress', 'antdeploy'],
				options: {
					//livereload: true,
				},
			}
		},

		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: 'unpackaged/staticresources/dashboard.resource'
				},
				files: [
					{expand: true, cwd: 'dist/', src: ['**'], dest: ''},
				]
			}
		}
	});	

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-ant-sfdc');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['sass', 'concat', 'copy', 'compress', 'antdeploy']);
};