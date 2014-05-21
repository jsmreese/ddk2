// DDK Validation Functions
$.extend(true, DDK.validate, {
	numberIntegerList: function(value) {
		var listItems = value.split(",");
		return _.map(listItems, function (listItem) { return DDK.validate.numberInteger(listItem); }).join(",");
	},
	numberFloatList: function(value) {
		var listItems = value.split(",");
		return _.map(listItems, function (listItem) { return DDK.validate.numberFloat(listItem); }).join(",");
	},
	numberInteger: function(value) {
		var isNegative = (value.indexOf("-") === 0 ? true : false),
			valuePart = value.replace(/[^0-9]+/g, "");
		if (valuePart) {
			valuePart = _.string.ltrim(valuePart, "0") || "0";
		}
		return (isNegative ? "-" : "") + valuePart;
	},
	numberFloat: function(value) {
		var isNegative = (value.indexOf("-") === 0 ? true : false),
			valueParts = value.replace(/[^0-9\.]+/g, "").split(".");
		if (valueParts[0]) {
			valueParts[0] = _.string.ltrim(valueParts[0], "0") || "0";
		}
		return (isNegative ? "-" : "") + (valueParts.length > 1 ? [valueParts[0]].concat(_.reduce(valueParts.slice(1), function(memo, valuePart) { return memo + valuePart.toString(); }, "")).join(".") : valueParts[0]);
	},
	textSafe: function(value) {
		// jsmreese: DDK 2.0.0b7 removes the comma character from the white list.
		return value.replace(/[^ `\w!@#$%&*()+/\\=?_.:;{}|\-\u2013\u2014]/gi, "");	//the unicodes are en and em dash
		//return value.replace(/\'/g, "").replace(/~/g, "").replace(/\^/g, "").replace(/\"/g, "").replace(/\[/g, "").replace(/\]/g, "");
	},
	textSafeList: function(value) {
		// Adds a comma to the whitelist of textSafe
		return value.replace(/[^ `\w!@#$%&*()+/\\=?_.,:;{}|\-\u2013\u2014]/gi, "");	//the unicodes are en and em dash
	},
	labelSafe: function(value){
		return value.replace(/[^ `\w!@#$%&*()+/\\=?_.,:;'{}|\-\u2013\u2014]/gi, "");
	},
	wordSafe: function(value){
		return value.replace(/\W/g, "");
	},
	nameSafe: function(value){
		value = value.replace(/\W/g, "");
		return (!isNaN(value[0]) ? "_" : "") + value;
	},
	email: function(value){
		var	valueParts = value.replace(/[^\w.@]/g, "").split("@");
		return valueParts.length > 1 ? [valueParts[0]].concat(_.reduce(valueParts.slice(1), function(memo, valuePart) { return memo + valuePart.toString(); }, "")).join("@") : valueParts[0];
	},
	textAreaSafe: function (value) {
		return value.replace(/[^ \r\n`\w!@#$%&*()+/\\=?_.,:;{}|\-\u2013\u2014]/gi, "");	//the unicodes are en and em dash
	}
});