var async = require('async');

/**
 * Django symlink to the shared log folder.
 * - Django symlink to the shared log folder
 */

module.exports = function (grunt) {
	grunt.registerTask('django_log_link', 'Django symlink to the shared log folder', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+'/seeVcam '
				+ '&& ln -s '+grunt.config('shipit.options.deployTo')+'/shared/log log '
			, done);
	});
};



