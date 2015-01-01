module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      default: {
        files: {
          "src/css/style.css": "src/less/style.less"
        }
      }
    },

    watch: {
      files: ['**/*.less'],
      tasks: ['less']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
};