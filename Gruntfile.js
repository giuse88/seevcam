var pkg = require('./package.json');
var path = require('path');

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
				deployTo: '/home/seevcam/app/seevcam',

				repositoryUrl: pkg.repository.url,
				branch:'deployment',
				ignores: ['.git', 'node_modules'],

				keepReleases: 5,
				requirements:'staging.txt',
				current:'/home/seevcam/app/seevcam/current'
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
	grunt.loadTasks(path.join(__dirname, 'deploy/tasks'));
	grunt.loadTasks(path.join(__dirname, 'deploy/global'));

//	Task registration
	grunt.shipit.on('published', function () {
		grunt.task.run(['npm_install','bower_install', 'minify','env_update','django_runserver']);
	});
};