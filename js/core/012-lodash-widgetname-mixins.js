(function(root) {
	var _ = root._;
	
	var rWidgetName, rModuleName, rTemplateName;
	
	rWidgetName = /^\w+$/i;
	rModuleName = /^\w+\_Module$/i;
	rTemplateName = /^\w+\_Template$/i;
	
	_.mixin({
		isWidgetName: function (str) {
			if (!str || (typeof str !== "string")) { return false; }
			
			return rWidgetName.test(str);
		},
		
		isModuleName: function (str) {
			if (!str || (typeof str !== "string")) { return false; }
			
			return rModuleName.test(str);
		},
		
		isTemplateName: function (str) {
			if (!str || (typeof str !== "string")) { return false; }
			
			return rTemplateName.test(str);
		}
	});
})(this);
