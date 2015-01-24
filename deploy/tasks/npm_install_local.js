var async = require('async');

/**
 * Clean task.
 * - Install npm packages
 */

module.exports = function (grunt) {
	grunt.registerTask('npm_install_local', 'Install npm packages', function () {
		var done = this.async();
		grunt.shipit.local(
				'cd ' + grunt.config('shipit.options.workspace')
				+ '&& npm install'
			, done);

	});
};