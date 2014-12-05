var keywordUpdate = function (key, value) {
	if (_.isPlainObject(value) || _.isArray(value)) {
		value = JSON.stringify(value);
	}
	
	// don't set recursive keywords
	//if ((value === DDK.char.tilde + key + DDK.char.tilde) || (value === "%%" + key + "%%")) {
		// instead, get the value of the keyword (could be an empty string!) and set the keyword to that value
	//	value = K(key);
	//}
	
	// unescape DDK Keywords (%% to ~) in keyword values
	// then eval before setting new keyword values
	if (typeof value === "string") {
		value = evalKeywordValue(value.replace(/%%/g, DDK.char.tilde));
	}
	
	FunctionLib.keywordUpdate(key, value);
};

var KeywordUpdate = keywordUpdate;

var run = function (widgetName, keywords) {
	var result;
	
	// widgetName is both the caseKey and the first arument to the delegated widget function
	result = K.scope(function () {
		return runDelegator(widgetName, widgetName);
	}, keywords);

	if (_.string.startsWith(result, "AMEngine can't load starting widget ID '00' or widget name '" + widgetName + "' from database")) {
		return "AMEngine error: widget '" + widgetName + "' does not exist.";
	}
	
	return result;
};

var Run = run;