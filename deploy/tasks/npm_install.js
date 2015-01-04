var async = require('async');

/**
 * Clean task.
 * - Install npm packages
 */

module.exports = function (grunt) {
	grunt.registerTask('npm_install', 'Install npm packages', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')
				+ '&& npm install'
			, done);

	});
};