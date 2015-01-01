module.exports = function(grunt) {
  grunt.initConfig({

    less: {
      default: {
        options: {
          compress: true,
          cleancss: true,
          yuicompress: true,
          optimization: 2,
          sourceMap : true,
          strictImports :true,
          plugins: [
//            new require('less-plugin-autoprefix')({browsers: ["last 2 versions"]}),
//            new require('less-plugin-clean-css')({ advanced : true })
          ]
        },
        files: {
          "public/css/seevcam.css": "seeVcam/static/client/dashboard/main.less"
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "seeVcam/static/",
          mainConfigFile: "./seeVcam/static/client/dashboard/boot.js",
          paths: {
            requireLib: 'bower_components/requirejs/require'
          },
          name: "./client/dashboard/boot",
          out: "public/js/seevcam.min.js",
          include: ["requireLib"]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
};