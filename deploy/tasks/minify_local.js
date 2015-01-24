var async = require('async');

/**
 * Clean task.
 * - Run grunt for less and requirejs tasks locally.
 */

module.exports = function (grunt) {
	grunt.registerTask('minify_local', 'Run grunt for less and requirejs tasks locally', function () {
		var done = this.async();
		grunt.shipit.local(
				'cd ' + grunt.config('shipit.options.workspace')+' '
				+ '&& grunt less '
				+ '&& grunt requirejs'
			, done);

	});
};