var async = require('async');

/**
 * Gunicorn Gracefull Reload.
 * - reloads gunicorn process
 */

module.exports = function (grunt) {
	grunt.registerTask('gunicorn_reload', 'reloads gunicorn process', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'seeVcam '
				+ '&& workon seevcam '
				+ '&& kill -HUP `cat ../tmp/gunicorn.pid`'
			, done);
	});
};