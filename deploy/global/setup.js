var async = require('async');

/**
 * Setup task.
 * - Creates empty virtualenv and activates it.
 */
module.exports = function (grunt) {
	grunt.registerTask('setup', 'Creates empty virtualenv and activates it.', function () {
		var done = this.async();
		grunt.shipit.remote('mkvirtualenv seevcam && workon seevcam', done);

	});
}