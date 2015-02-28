define(function(require){
	var BaseView = require('BaseView');
	return BaseView.extend({
		className:"spinner",
		template: require('text!./templates/loader.html')
	});
});