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

require.exec = function (moduleName, methodName) {
	var module, method, rMethod, args, result;
	
	// any additional arguments are passed to the method
	args = [].slice.call(arguments, 2);
	
	module = require(moduleName);
	
	if (module) {
		if (typeof module[methodName] === "function") {
			method = methodName;
		}

		if (!method) {
			rMethod = new RegExp("^" + methodName, "i");

			method = _.findKey(module, function (value, key) {
				return rMethod.test(key);
			});
		}
	}
	
	if (method) {
		result = module[method].apply(null, args);
		
		if (result) { return result; }
	}
	
	return "";
};
