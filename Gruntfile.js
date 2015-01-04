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
				deployTo: '/home/seevcam/app/seevcam',

				repositoryUrl: pkg.repository.url,
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

//	Shipit task list
	grunt.registerTask('setup', 'Install environments', function () {
		var done = this.async();
		grunt.shipit.remote('mkvirtualenv seevcam && workon seevcam', done);

	});

	grunt.registerTask('env_update', 'Install environments', function () {
		var done = this.async();
		var requirements = grunt.config('shipit.options.requirements');
		grunt.shipit.remote(
				'workon seevcam '
				+ '&& cd ' + grunt.config('shipit.options.current')
				+ '&& pip install -r requirements/' + requirements
			, done);

	});

	grunt.registerTask('npm_install', 'install npm', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')
				+ '&& npm install'
			, done);

	});

	grunt.registerTask('bower_install', 'install npm', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current') +'/seeVcam/static '
				+ '&& bower update'
			, done);

	});

	grunt.registerTask('minify', 'Run grunt for less and requirejs', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')
				+ '&& grunt less '
				+ '&& grunt requirejs'
			, done);

	});

//	Task registration
	grunt.shipit.on('published', function () {
		grunt.task.run(['npm_install','bower_install', 'minify']);
	});
};