var async = require('async');

/**
 * Clean task.
 * - Install bower packages.
 */

module.exports = function (grunt) {
	grunt.registerTask('bower_install_local', 'Install bower packages', function () {
		var done = this.async();
		grunt.shipit.local(
				'cd ' + grunt.config('shipit.options.workspace') + '/seeVcam/static '
				+ '&& bower update'
			, done);

	});
};