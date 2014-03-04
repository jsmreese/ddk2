DDK.requestMethods = {};

DDK.requestMethods.sampleMethod = function (keywords) {
	return "This text was rendered by DDK.requestMethods.sampleMethod in server JavaScript.\n" +
		"The method was passed this keywords object:\n" +
		JSON.stringify(keywords);
};

DDK.requestMethods.renderControlFromFavorite = function (keywords) {
	var data = K.toDatasetObject("data.last"),
		fav = data && data[0],
		control = {},
		nameParts,
		valueParts,
		initKeywords = {},
		controlKeys;
		
	// test URL:
	// http://rnddeva1.pureshare.com/amengine/amengine.aspx?config.mn=DDK_Data_Request&data.config=%5C%5B%7B%22queryWidget%22%3A%22PSC_Favorites_Record_Query%22%2C%22useCoercedTypes%22%3Afalse%2C%22datasetMode%22%3A%22array%22%2C%22columnPrefix%22%3A%22sci_fav_%22%2C%22shouldCamelizeKeys%22%3Atrue%2C%22keywords%22%3A%22%26ddk.fav.id%3D501%22%7D%2C%7B%22method%22%3A%22renderControlFromFavorite%22%7D%5C%5D
	// $.getJSON("http://rnddeva1.pureshare.com/amengine/amengine.aspx?config.mn=DDK_Data_Request&data.config=%5C%5B%7B%22queryWidget%22%3A%22PSC_Favorites_Record_Query%22%2C%22useCoercedTypes%22%3Afalse%2C%22datasetMode%22%3A%22array%22%2C%22columnPrefix%22%3A%22sci_fav_%22%2C%22shouldCamelizeKeys%22%3Atrue%2C%22keywords%22%3A%22%26ddk.fav.id%3D501%22%7D%2C%7B%22method%22%3A%22renderControlFromFavorite%22%7D%5C%5D", function (data) { var control = data.datasets[1]; $("#layout_content_center").html(DDK.unescape.brackets(control.html)); reloadControlContainer(control.name, control.id, {}); });
	
	if (fav && fav.id && fav.name && fav.extId3 && fav.value) {
		nameParts = fav.name.split(",");
		
		_.extend(control, {
			originalId: fav.extId3,
			favId: fav.id,
			optionsWidget: nameParts[4],
			name: nameParts[3],
			originalFavValue: fav.value
		});
		
		control.id = control.name + control.favId + "x" + _.guid().replace(/\-/g, "");
		control.favValue = control.originalFavValue.replace(RegExp("s_" + control.originalId + "_", "g"), "s_" + control.id + "_")
		
		valueParts = (control.favValue ? control.favValue.split("&") : []);
		
		control.dataKeywords = "";
		control.stateKeywords = "";
		
		_.each(valueParts, function (value) {
			if (_.string.startsWith(value, "s_")) {
				control.stateKeywords += "&" + value;
			} else if (value) {
				control.dataKeywords += "&" + value;
			}
		});
		
		initKeywords[control.name + "_id"] = control.id;
		initKeywords[control.name + "_init_widget"] = control.optionsWidget;
		
		// jsmreese: metric_display_template doesn't seem to be needed -- not sure why!
		/* if (control.name === "bamset" || control.name === "scorecard") {
			initKeywords[control.name + "_metric_display_template"] = "{'currentValue':{'displayLabel':'Current Value','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'{{value}}\\\' data-units=\\\'{{units}}\\\' data-precision=\\\'{{precision}}\\\'','spanFormat':{'type':'demovalue'},'spanValue':'{{value}}'}}},'displayTitle':''},'abbreviation':{'displayLabel':'Name (abbreviation)','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'{{abbr}}\\\' data-units=\\\'{{units}}\\\' data-precision=\\\'{{precision}}\\\'','spanFormat':{'type':'demovalue'},'spanValue':'{{abbr}}'}}},'displayTitle':''},'bar':{'displayLabel':'Current Value (bar)','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'{{value}}\\\'','spanFormat':{'type':'demobar'},'spanValue':'{{value}},{{valueMax}}'}}},'displayTitle':''},'metricName':{'displayLabel':'Name','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'{{name}}\\\'','spanValue':'{{name}}'}}},'displayTitle':'Metric'},'percentChangeTotal':{'displayLabel':'Percent Change (overall)','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'FN: var trend = \\\\[{{trend}}\\\\]; return trend\\\\[trend.length - 1\\\\] / trend\\\\[0\\\\];\\\' data-precision=\\\'{{precision}}\\\' data-orientation=\\\'{{orientation}}\\\' data-color=\\\'{{color}}\\\'','spanFormat':{'type':'democompare'},'spanValue':'{{trend}}'}}},'displayTitle':'Overall Change'},'percentChangeLast':{'displayLabel':'Percent Change (from previous value)','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'FN: return {{value}} / {{prevValue}};\\\' data-precision=\\\'{{precision}}\\\' data-orientation=\\\'{{orientation}}\\\' data-color=\\\'{{color}}\\\'','spanFormat':{'type':'democompare'},'spanValue':'{{prevValue}},{{value}}'}}},'displayTitle':'Change'},'previousValue':{'displayLabel':'Previous Value','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'{{prevValue}}\\\' data-units=\\\'{{units}}\\\' data-precision=\\\'{{precision}}\\\'','spanFormat':{'type':'demovalue'},'spanValue':'{{prevValue}}'}}},'displayTitle':'Previous'},'comparisonResult':{'displayLabel':'Comparison Result','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'sort=\\\'{{result}}\\\' data-color=\\\'{{result}}\\\'','spanFormat':{'type':'democomparisonresult'},'spanValue':'{{result}}'}}},'displayTitle':''},'trend':{'displayLabel':'Chart - Line','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'data-type=\\\'line\\\' data-target=\\\'{{target}}\\\' data-value=\\\'{{trend}}\\\' sort=\\\'{{value}}\\\'','spanFormat':{'type':'minichart'},'spanValue':' '}}},'displayTitle':''},'bullet':{'displayLabel':'Chart - Bullet','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'data-type=\\\'bullet\\\' data-result=\\\'{{result}}\\\' data-value=\\\'{{target}},{{value}}\\\' sort=\\\'{{value}}\\\'','spanFormat':{'type':'minichart'},'spanValue':' '}}},'displayTitle':''},'minicolumns':{'displayLabel':'Chart - Columns','displayLayout':{'bamContent':{'bamsectionSpan':{'spanAttr':'data-type=\\\'bar\\\' data-target=\\\'{{target}}\\\' data-value=\\\'{{trend}}\\\' sort=\\\'{{value}}\\\'','spanFormat':{'type':'minichart'},'spanValue':' '}}},'displayTitle':''}}";
		} */
		
		controlKeys = _.transform(_.extend(initKeywords, _.string.parseQueryString(control.favValue), keywords), function (accumulator, value, key) {
			if (typeof value === "string") {
				accumulator[key] = value;
				return;
			}
			
			if (typeof value === "boolean") {
				accumulator[key] = value.toString().toLowerCase();
				return;
			}
			
			accumulator[key] = value.toString()
				
		}, {});
		//control.log = DDK.log(controlKeys);
		
		control.html = "<div style='height: 100%; width: 100%;' id='psc_" + control.name + "_" + control.id + "_widget' data-options='" + control.optionsWidget + "' data-keywords=\"" + control.dataKeywords + "\">" +
			run("PSC_" + _.string.titleize(control.name) + "_Widget", controlKeys) +
			"</div>";
	}
	
	return control;
};
