/**
 * Module dependencies.
 */

var async = require('async');

/**
 * Environment Update task.
 * - Install environment dependencies from requirements file
 */

module.exports = function (grunt) {
	grunt.registerTask('env_update', 'Install environment dependencies from requirements file', function () {
		var done = this.async();
		var requirements = grunt.config('shipit.options.requirements');
		grunt.shipit.remote(
				'workon seevcam '
				+ '&& cd ' + grunt.config('shipit.options.current')
				+ '&& pip install -r requirements/' + requirements
			, done);

	});
}