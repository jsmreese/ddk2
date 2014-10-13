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
})(_, _.createCaseConverter);