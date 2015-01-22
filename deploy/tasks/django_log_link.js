var async = require('async');

/**
 * Django log and tmp symlinks to shared folder.
 * - Django log and tmp symlinks to shared folder
 */

module.exports = function (grunt) {
	grunt.registerTask('django_log_link', 'log and tmp symlinks to shared folder', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/seeVcam '
				+ '&& ln -s '+grunt.config('shipit.options.deployTo')+'/shared/log log '
			, done);
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+' '
				+ '&& ln -s '+grunt.config('shipit.options.deployTo')+'/shared/log log '
			, done);
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+' '
				+ '&& ln -s '+grunt.config('shipit.options.deployTo')+'/shared/tmp tmp '
			, done);
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/seeVcam '
				+ '&& ln -s '+grunt.config('shipit.options.deployTo')+'/shared/media media '
			, done);
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/public '
				+ '&& ln -s '+grunt.config('shipit.options.deployTo')+'/shared/media media '
			, done);
	});
};



