var keywordUpdate = function (key, value) {
	if (_.isPlainObject(value) || _.isArray(value)) {
		value = JSON.stringify(value);
	}
	FunctionLib.keywordUpdate(key, value);
};

var KeywordUpdate = keywordUpdate;

var run = function (widgetName, keywords) {
	var hasKeywords,
		result,
		cache = {};
	
	if (typeof keywords === "string" && _.string.isQueryString(keywords)) {
		keywords = _.string.parseQueryString(keywords);
	}
	
	if (_.isPlainObject(keywords)) {
		hasKeywords = true;
		
		// for each keyword, cache the global state
		// and update the keyword value
		_.each(keywords, function (value, key) {
			key = _.string.underscored(key);
			cache[key] = (K.isKeyword(key) ? value : null);
			K(key, evalKeywordValue(value));
		});
	}
	
	result = FunctionLib.run(widgetName);
	
	if (hasKeywords) {
		// restore keyword state
		_.each(cache, function (value, key) {
			if (value === null) {
				KeywordDelete(key);
				return;
			}
			
			K(key, value);
		});
	}
	
	if (_.string.startsWith(result, "AMEngine can't load starting widget ID '00' or widget name '" + widgetName + "' from database")) {
		return "AMEngine error: widget '" + widgetName + "' does not exist.";
	}
	
	return result;
};

var Run = run;