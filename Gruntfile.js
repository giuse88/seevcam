var pkg = require('./package.json');
var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({

    less: {
      dashboard: {
        options: {
          compress: true,
          cleancss: true,
          yuicompress: true,
          optimization: 2,
          sourceMap : true,
          strictImports :true,
          plugins: [ ]
        },
        files: {
          "public/css/dashboard.css": "seeVcam/static/apps/dashboard/dashboard.less"
        }
      },
      interviewRoom: {
        options: {
          compress: true,
          cleancss: true,
          yuicompress: true,
          optimization: 2,
          sourceMap: true,
          strictImports: true,
          plugins: [ ]
        },
        files: {
          "public/css/room.css": "seeVcam/static/apps/interview_room/interview_room.less"
        }
      }
    },

    requirejs: {
      dashboard: {
        options: {
          baseUrl: "seeVcam/static/",
          mainConfigFile: "./seeVcam/static/apps/dashboard/boot.js",
          paths: {
            requireLib: 'bower_components/requirejs/require'
          },
          name: "./apps/dashboard/boot",
          out: "public/js/dashboard.min.js",
          include: ["requireLib"]
        }
      },
      interviewRoom: {
        options: {
          baseUrl: "seeVcam/static/",
          mainConfigFile: "./seeVcam/static/apps/interview_room/boot.js",
          paths: {
            requireLib: 'bower_components/requirejs/require'
          },
          name: "./apps/interview_room/boot",
          out: "public/js/room.min.js",
          include: ["requireLib"]
        }
      }
    },

		shipit: {
			options: {

				workspace: '/tmp/seevcam_tmp',
				deployTo: '/home/seevcam/app/seevcam',

				repositoryUrl: 'git@github.com:giuse88/seevcam.git',
				branch:'master',
				ignores: ['.git', 'node_modules'],

				keepReleases: 5,
				requirements:'staging.txt',
				current:'/home/seevcam/app/seevcam/current'
			},

			// Staging environment.
			staging: {
				servers: ['seevcam@ec2-54-154-88-46.eu-west-1.compute.amazonaws.com']
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
		grunt.task.run([
			'npm_install', 'bower_install', 'minify', 'env_update',
			'django_log_link', 'django_migrate','django_collectstatic',
			'gunicorn_reload']);
	});
};