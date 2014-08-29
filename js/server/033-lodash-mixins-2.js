(function (_, func) {
	_.mixin({
		toCase: _.delegator({
			snake: func(_.string.underscored),
			kebab: func(_.string.dasherize),
			camel: func(_.string.camelize),
			title: func(_.string.titleize),
			upper: func(_.toUpperCase),
			lower: func(_.toLowerCase),
			none: func(_.identity)
		}, "lower")
	});
	
	_.mixin({
		isWidgetName: function (str) {
			if (!str || (typeof str !== "string")) { return false; }
			
			return /\[A-Za-z0-9\_\]/.test(str) && (+getMetricIdByName(str)) > 0
		}
	});
})(_, _.createCaseConverter);