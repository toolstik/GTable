var ts2gas = require('ts2gas');

module.exports = function (grunt) {

    var ts2gasConfig = {
        "target": "es5",
        "lib": [
            "es2015",
            "es5",
            "es6",
            "es2017"
        ],
        "strict": true,
        "inlineSourceMap": true,
    };

    function trinspileTs(tsFile) {
        var tsBody = grunt.file.read(tsFile);
        var jsBody = ts2gas(tsBody, ts2gasConfig);
        var jsFile = tsFile.substr(0, tsFile.lastIndexOf(".")) + ".js";
        grunt.file.write(jsFile, jsBody);
        grunt.file.delete(tsFile, jsBody);
    };


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            src: {
                src: 'src/**/*.ts',
                dest: 'dist/gibernate.ts'
            },
            spec: {
                src: ['spec/spec.ts', 'spec/TestSuite.ts', 'spec/**/*.ts'],
                dest: 'dist/spec.ts'
            }
        },
        copy: {
            manifest: {
                files: [
                    { expand: true, src: ['appsscript.json'], dest: 'dist/', filter: 'isFile' }
                ]
            }
        },
        exec: {
            clasp_push: "clasp push -f",
            clasp_run_repo_test: "clasp run runRepositoryTests",
            clasp_run_session_test: "clasp run runSessionTests",
            clear_dist: "rm -r -f dist"
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exec');

    grunt.task.registerTask('compile', function (target) {
        if (target == "src") {
            trinspileTs("dist/gibernate.ts");
        } else if (target == "spec") {
            trinspileTs("dist/spec.ts");
        }
    });

    grunt.registerTask('build:src', ['concat:src', 'compile:src']);
    grunt.registerTask('build:test', ['build:src', 'concat:spec', 'compile:spec', 'copy:manifest']);

    grunt.registerTask('exec:clasp_run_test', ['exec:clasp_run_repo_test', 'exec:clasp_run_session_test']);

    grunt.registerTask('push', [
        'exec:clear_dist',
        'build:test',
        'exec:clasp_push'
    ]);

    grunt.registerTask('test:all', [
        'push',
        'exec:clasp_run_test'
    ]);

    grunt.registerTask('test:repo', [
        'push',
        'exec:clasp_run_repo_test'
    ]);

    grunt.registerTask('test:session', [
        'push',
        'exec:clasp_run_session_test'
    ]);


};