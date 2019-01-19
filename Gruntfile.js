module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy:{
            src:{
                files:[
                    {expand: true, cwd:"src/", src: ['**/*.js'], dest: 'dist/', filter: 'isFile'}
                ]
            },
            spec:{
                files:[
                    {expand: true, cwd:"spec/", src: ['**/*.js'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};