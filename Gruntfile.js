module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            src: {
                src: 'src/**/*.ts',
                dest: 'dist/gtable.ts'
            }
        },
        copy: {
            spec: {
                files: [
                    { expand: true, cwd: "spec/", src: ['**/*.js', '**/*.ts'], dest: 'dist/', filter: 'isFile' }
                ]
            },
            manifest: {
                files: [
                    { expand: true, src: ['appsscript.json'], dest: 'dist/', filter: 'isFile' }
                ]
            }
        },
        exec: {
            clasp_push: "clasp push -f",
            clasp_run_test: "clasp run runSuite",
            clear_dist: "rm -r -f dist"
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('build:src', ['concat:src']);
    grunt.registerTask('build:test', ['build:src', 'copy:spec', 'copy:manifest']);

    grunt.registerTask('test', [
        'exec:clear_dist',
        'build:test',
        'exec:clasp_push',
        'exec:clasp_run_test'
    ]);
};