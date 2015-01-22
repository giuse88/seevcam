var async = require('async');

/**
 * Clean task.
 * - Install bower packages.
 */

module.exports = function (grunt) {
	grunt.registerTask('bower_install', 'Install bower packages', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current') + '/seeVcam/static '
				+ '&& bower update'
			, done);

	});
};