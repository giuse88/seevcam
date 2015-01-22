var async = require('async');

/**
 * Django collect static files task.
 * - Runs Django collectstatic to move static files into the public folder.
 */

module.exports = function (grunt) {
	grunt.registerTask('django_collectstatic', 'Django collect static files task', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/seeVcam '
				+ '&& workon seevcam '
				+ '&& python manage.py collectstatic --noinput'
			, done);
	});
};