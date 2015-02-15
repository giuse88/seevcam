var async = require('async');

/**
 * Clean task.
 * - Run grunt for less and requirejs tasks.
 */

module.exports = function (grunt) {
	grunt.registerTask('minify', 'Run grunt for less and requirejs tasks', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+' '
				+ '&& grunt less:dashboard'
        + '&& grunt less:interviewRoom'
        + '&& grunt requirejs:dashboard'
				+ '&& grunt requirejs:interviewRoom'
			, done);

	});
};