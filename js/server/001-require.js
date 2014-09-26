var require = (function () {
	function require(id) {
		var code;
		
		if (cache[id]) {
			return cache[id];
		}
		
		keywordUpdate("html.bypass", "true");
		
		code = DDK.unescape.brackets(run(id));
		
		keywordFlush("html.bypass");
		
		try {
			cache[id] = eval(code);
		} catch (err) {
			// on error, check to see if the widget actually exists
			if (+getMetricIdByName(id) > 0) {
				throw new Error("Error loading module '" + id + "'. " + err.name + ". " + err.message + ".");
			}
			
			throw new Error("Error loading module '" + id + "'. Widget does not exist.");
		}
		
		return cache[id];
	}
	
	var cache = {};
	
	return require;
})();
