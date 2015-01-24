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
				current: '/home/seevcam/app/seevcam/current',

				repositoryUrl: 'git@github.com:giuse88/seevcam.git',
				branch: 'deploy_improvements',
				ignores: ['.git', 'node_modules', 'seeVcam/static/bower_components'],

				keepReleases: 5,
				requirements: 'staging.txt'
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
	grunt.shipit.on('fetched', function () {
		grunt.task.run([
			'npm_install_local', 'bower_install_local', 'minify_local'
		]);
	});

	grunt.shipit.on('published', function () {
		grunt.task.run([
			'env_update', 'django_log_link', 'django_migrate','django_collectstatic',
			'gunicorn_reload','nginx_reload']);
	});
};