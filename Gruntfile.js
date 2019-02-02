module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            src: {
                src: 'src/**/*.ts',
                dest: 'dist/gtable.ts'
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

    grunt.registerTask('build:src', ['concat:src']);
    grunt.registerTask('build:test', ['build:src', 'concat:spec', 'copy:manifest']);

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