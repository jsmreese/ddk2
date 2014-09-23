var keywordUpdate = function (key, value) {
	if (_.isPlainObject(value) || _.isArray(value)) {
		value = JSON.stringify(value);
	}
	FunctionLib.keywordUpdate(key, value);
};

var KeywordUpdate = keywordUpdate;

var run = function (widgetName, keywords) {
	var result;
	
	result = K.scope(function () {
		return FunctionLib.run(widgetName);
	}, keywords);

	if (_.string.startsWith(result, "AMEngine can't load starting widget ID '00' or widget name '" + widgetName + "' from database")) {
		return "AMEngine error: widget '" + widgetName + "' does not exist.";
	}
	
	return result;
};

var Run = run;