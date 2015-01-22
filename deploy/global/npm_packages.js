var async = require('async');

/**
 * Npm packages task.
 * - Install npm packages used by seevcam.
 */
module.exports = function (grunt) {
	grunt.registerTask('setup', 'Install npm packages used by seevcam.', function () {
		var done = this.async();
		grunt.shipit.remote('npm install -g npm ', done);
		grunt.shipit.remote('npm install -g grunt-cli ', done);
		grunt.shipit.remote('npm install -g bower ', done);

	});
}