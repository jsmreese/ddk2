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
			throw new Error("Error loading module '" + id + "'. " + err.name + ". " + err.message + ".");
		}
		
		return cache[id];
	}
	
	var cache = {};
	
	return require;
})();
