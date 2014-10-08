(function () {
	var dfd = $.Deferred();
	
	dfd.resolve();
	
	DDK.loadTools = function () {
		return dfd;
	};
})();