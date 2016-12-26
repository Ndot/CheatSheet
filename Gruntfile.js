module.exports = function (grunt) {
    'use strict';
    // Set Delimiters for the templates
    grunt.template.addDelimiters('myDelimiters', '{{', '}}');

    // Project configuration.
    grunt.initConfig({
        concat: {
            DEV: {
                options: {
                    process: function (src, filepath) {
                        var obj = grunt.file.readYAML(filepath),
                            tmpl = filepath.replace(/.*?\/(.*?)\/.*/, 'contents/$1/_tmpl.html');
                        return grunt.template.process(grunt.file.read(tmpl), {data: obj, delimiters: 'myDelimiters'});
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['contents/*/**/*.yaml'],
                        dest: '',
                        ext: '.html',
                        extDot: 'first'
                    }
                ]
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            DIST: {
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: [
                            '*.html',
                            'contents/**/*.html',
                            '!contents/**/_tmpl.html'
                        ],
                        dest: 'docs/',
                        ext: '.html',
                        extDot: 'first'
                    }
                ]
            }
        },
        copy: {
            DIST: {
                files: [
                    {
                        expand: true,
                        src: [
                            'contents/contents.json',
                            'assets/fonts/*',
                            'assets/media/*',
                            'assets/js/vendor/*'
                        ],
                        dest: 'docs/'
                    }
                ]
            }
        },
        uglify: {
            DIST: {
                src: 'assets/js/*.js',
                dest: 'docs/assets/js/app.js'
            }
        },
        less: {
            DIST: {
                options: {
                    strictMath: true,
                    compress: true
                },
                files: [
                    {
                        expand: true,
                        src: [
                            'assets/css/main.css',
                            'assets/css/theme/*.css',
                            'assets/css/vendor/*.css'
                        ],
                        dest: 'docs/',
                        ext: '.css'
                    }
                ]
            },
            DEV: {
                options: {
                    strictMath: true,
                    plugins: [new (require('less-plugin-autoprefix'))({browsers: ["last 7 versions"]})]
                },
                files: [
                    {
                        expand: true,
                        cwd: './assets/css/less/',
                        src: [
                            'main.less',
                            'theme/*.less'
                        ],
                        dest: 'assets/css/',
                        ext: '.css'
                    }
                ]
            }
        },
        imagemin: {
            DIST: {
                files: [
                    {
                        expand: true,
                        src: ['assets/img/*'],
                        dest: 'docs'
                    }
                ]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['contents/**/*.yaml', 'assets/css/less/**/*.less', 'assets/js/**/*.js'],
            tasks: [
                'concat:DEV',
                'less:DEV'
            ]
        },
        connect: {
            DEV: {
                options: {
                    port: 9000,
                    protocol: 'http',
                    hostname: 'localhost',
                    open: true,
                    livereload: true,
                    base: './'
                }
            },
            DIST: {
                options: {
                    port: 9001,
                    protocol: 'http',
                    hostname: 'localhost',
                    open: true,
                    keepalive: true,
                    base: './docs/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // DEFAULT
    grunt.registerTask('default', ['htmlmin', 'uglify', 'copy', 'less:DIST', 'connect:DIST']);

    // DEVELOPMENT
    grunt.registerTask('d', ['connect:DEV', 'watch']);
    
    // JUST IMAGES
    grunt.registerTask('img', ['imagemin']);
};