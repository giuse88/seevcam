var async = require('async');

/**
 * Django Runserver task.
 * - Runs Django devel server
 */

module.exports = function (grunt) {
	grunt.registerTask('django_runserver', 'Runs Django devel server', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/seeVcam '
				+ '&& workon seevcam '
				+ '&& nohup python manage.py runserver 0:8000 &'
			, done);
	});
};