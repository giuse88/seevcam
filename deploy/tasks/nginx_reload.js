var async = require('async');

/**
 * Nginx Gracefull Reload.
 * - reloads nginx process
 */

module.exports = function (grunt) {
	grunt.registerTask('nginx_reload', 'reloads nginx process', function () {
		var done = this.async();
		grunt.shipit.remote(
				'cd ' + grunt.config('shipit.options.current')+' '+
				'&& sudo nginx -s reload'
			, done);
	});
};