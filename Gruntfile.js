var pkg = require('./package.json');

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
    },

		shipit: {
			options: {

				workspace: '/tmp/seevcam_tmp',
				deployTo: 'app/seevcam',

				repositoryUrl: pkg.repository.url,
				ignores: ['.git', 'node_modules'],

				keepReleases: 5
			},

			// Staging environment.
			staging: {
				servers: ['seevcam@ec2-54-154-138-99.eu-west-1.compute.amazonaws.com']
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-shipit');
};