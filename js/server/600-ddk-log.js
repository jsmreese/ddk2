DDK.log = (function () {
	var counter = 0,
		metricName = K("metric.metric_name"),
		metricId = K("metric.id");
	
	return function DDK_LOG() {
		var args = [].slice.call(arguments);
		
		counter += 1;
		
		return ("<table style='margin:5px;font-family:monospace;white-space:nowrap;'>" + 
			"<tr><td colspan=2 style='color:#888;padding:1px 3px;border: 1px solid #ccc;background:#eee;'>" + counter + " - " + metricName + " / " + metricId + "</td></tr>" + 
			_.reduce(args, function (accumulator, arg, index) {
				var str,
					type,
					bgColor = (index % 2 ? "#E5F3FF" : "#F5FAFF");
				
				if (_.isArray(arg)) {
					str = DDK.renderJSON(arg);
					type = "array";
				} else if (_.isPlainObject(arg)) {
					str = DDK.renderJSON(arg);
					type = "object";
				} else if (arg == null) {
					str = "";
					type = typeof arg;
				} else {
					str = _.escape(arg.toString());
					type = typeof arg;
				}
				
				return accumulator + "<tr style='background:" + bgColor + ";'><td style='color:#888;text-align:right;padding:2px 5px;'>" + type + "</td>" + "<td style='color:#444;padding:2px 5px;'>" + str + "</td></tr>";
			}, "") + "</table>").replace(/%%/g, "&#37;&#37;").replace(/%\{/g, "&#37;&#123;").replace(/\}%/g, "&#125;&#37;").replace(/%@/g, "&#37;&#64;").replace(/@%/g, "&#64;&#37;").replace(DDK.regex.tilde, "&#126;");
	};
})();