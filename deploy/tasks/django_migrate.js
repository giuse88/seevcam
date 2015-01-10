var async = require('async');

/**
 * Django migration task.
 * - Runs Django migration for database
 */

module.exports = function (grunt) {
	grunt.registerTask('django_migrate', 'Runs Django migration for database', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/seeVcam '
				+ '&& workon seevcam '
				+ '&& python manage.py migrate'
			, done);
	});
};