DDK.controlTemplates = DDK.controlTemplates || {};

DDK.controlTemplates.PSC_Bamset2_Content = function () {
	var out = "",
		temp = "",
		bamset = "",
		data = DDK.data.toArray({ useRecordObjects: true, useCoercedTypes: false, escapeMode: "html" }),
		config, 
		cfo = K.toObject2("component_"),
		co = K.toObject2("bamset2_"),
		bamsetBodyDiv = "",
		recordCount = K("rec.count"),
		//DDK_COLUMNS = DDK.columns2(),
		columnNames = _.map(_.pluck(DDK_COLUMNS, "name"), function (value) { return value.toUpperCase(); }),
		keywordList = [],
		taggedKeywordList,
		taggedValueList,
		// DDK Keyword matching function
		// pushes a keyword onto the keywordList
		// if it is not a column name in the current dataset
		keywordMatch = function (match) {
			match = match.slice(2, -2).toUpperCase();
			if (!_.contains(columnNames, match)) {
				keywordList.push(match);
			}
		},
		defaultElementConfig = {
			elemAttr: "",
			elemClassName: "",
			elemValue: "",
			elemFormat: "text",
			elemFormatStyle: "",
			elemGridAttr: "",
			elemGridClassName: ""
		},
		defaultBamConfig = {
			bamPrefix: "",
			bamTitle: "",
			bamSubtitle: "",
			bamAttr: "",
			bamClassName: "",
			bamHeaderAttr: "",
			bamHeaderClassName: "",
			bamHeaderGridAttr: "",
			bamHeaderGridClassName: "",
			bamContentAttr: "",
			bamContentClassName: "",
			bamContentGridAttr: "",
			bamContentGridClassName: "",
			bamFooterAttr: "",
			bamFooterClassName: "",
			bamFooterGridAttr: "",
			bamFooterGridClassName: "",
			bamGridAttr: "",
			bamGridClassName: ""
		},
		defaultSetConfig = {
			setAttr: "",
			setClassName: "",
			setTitle: "",
			setSubtitle: "",
			setDatabind: 1,
			setHeaderAttr: "",
			setHeaderClassName: "",
			setHeaderGridAttr: "",
			setHeaderGridClassName: "",
			setBodyAttr: "",
			setBodyClassName: "",
			setBodyGridAttr: "",
			setBodyGridClassName: "",
			setFooterAttr: "",
			setFooterClassName: "",
			setFooterGridAttr: "",
			setFooterGridClassName: ""
		},
		setupElementDefaults = function (elem) {
			_.defaults(elem, defaultElementConfig);
		},
		setupBamDefaults = function (bam) {
			_.defaults(bam, defaultBamConfig);
			
			// setup config element object defaults
			bam.bamHeaderElements = bam.bamHeaderElements || [];
			bam.bamContentElements = bam.bamContentElements || [];
			bam.bamFooterElements = bam.bamFooterElements || [];			
					
			_.each(bam.bamHeaderElements, setupElementDefaults);
			_.each(bam.bamContentElements, setupElementDefaults);
			_.each(bam.bamFooterElements, setupElementDefaults);
			
			// bam title/subtitle
			if (!bam.bamHeaderElements.length && (bam.bamTitle || bam.bamSubtitle)) {
				_.each([bam.bamTitle, bam.bamSubtitle], function (title) {
					if (title) {
						bam.bamHeaderElements.push(_.extend(_.cloneDeep(defaultElementConfig), { elemValue: title }));
					}
				});
			}
		},
		buildKeywordList = function (obj) {
			_.forOwn(obj, function (value, key) {
				if (_.isArray(value)) {
					_.each(value, buildKeywordList);
				} else if (typeof value === "string") {
					_.each(value.match(DDK.regex.ddkKeyword), keywordMatch);
				}
			});		
		},
		evalKeywordAlias = function (obj, prefix) {
			var prefixKey;
			
			if (!prefix) {
				prefixKey = _.find(_.keys(obj), function (key) {
					return key.match(/prefix/gi);
				});
				
				if (prefixKey) {
					prefix = obj[prefixKey];
				}
			}
			
			_.forOwn(obj, function (value, key) {
				if (_.isArray(value)) {
					_.each(value, function (obj) {
						evalKeywordAlias(obj, prefix);
					});
				} else if (typeof value === "string" && prefix) {
					obj[key] = DDK.template.render.keywordAlias(value, prefix)
				}
			});	
		};
	
	config = eval("(function(){return " + DDK.unescape.brackets(K("bamset2_config").replace(/\n|\r|\t/g, "")) + ";})()");
		
	// flush unused control options
	K.flush(["bamset2_series", "bamset2_nodes", "bamset2_color", "bamset2_label", "bamset2_legend", "bamset2_type", "bamset2_title", "bamset2_auto"]);

	// normalize databind
	if (config.setDatabind === true) {
		config.setDatabind = 1;
	} else if (config.setDatabind === false) {
		config.setDatabind = 2;
	} else {
		config.setDatabind = config.setDatabind || 1;
	}
	
	config.setDatabind = config.setDatabind.toString();


	// trim config object of properties with empty string values
	_.prune(config);
	_.each(config.columns, _.prune);
	
	// open wrapping data div
	out += "<div id=\"psc_bamset2_data_" + co.id + "\" class=\"ps-bamset" + (co.groupingKey ? " ps-bamset-grouped" : "") + "\"";
	out += " data-sortable=\"" + (co.sortEnabled || "") + "\"";
	out += " data-count=\"" + recordCount.toString() + "\""; 
	out += " data-height=\"" + (co.height || "") + "\"";
	out += " data-md=\"" + (co.metricsDynamic || "") + "\"";
	out += " data-ms=\"" + (co.metricsStatic || "") + "\"";
	out += " data-gk=\"" + (co.groupingKey || "") + "\"";
	out += " data-ge=\"" + (co.groupingExpanded || "") + "\"";
	// for data-config JSON, html-escape and escape DDK script blocks
	out += " data-config='" + DDK.renderJSON(config, true, false, true).replace(/%%/g, "&#37;&#37;") + "'>";
	
	///////////////////////////////////////
	// setup config object for rendering //
	///////////////////////////////////////

	// setup config set object defaults
	_.defaults(config, defaultSetConfig);
	
	// setup config bam object defaults
	config.setHeaderBams = config.setHeaderBams || [];
	config.setBodyBams = config.setBodyBams || [];
	config.setFooterBams = config.setFooterBams || [];
	
	_.each(config.setHeaderBams, setupBamDefaults);
	_.each(config.setBodyBams, setupBamDefaults);
	_.each(config.setFooterBams, setupBamDefaults);
	
	// bamset title/subtitle
	if (!config.setHeaderBams.length && (config.setTitle || config.setSubtitle)) {
		config.setHeaderBams[0] = (_.cloneDeep(defaultBamConfig));
		config.setHeaderBams[0].bamHeaderElements = [];
		config.setHeaderBams[0].bamContentElements = [];
		config.setHeaderBams[0].bamFooterElements = [];	
		
		_.each([config.setTitle, config.setSubtitle], function (title) {
			if (title) {
				config.setHeaderBams[0].bamContentElements.push(_.extend(_.cloneDeep(defaultElementConfig), { elemValue: title }));
			}
		});
	}
	
	//////////////////////////////////////////////////////
	// construct Prepped Config and Tagged Keyword List //
	//////////////////////////////////////////////////////
	
	buildKeywordList(config);
	evalKeywordAlias(config, null);


	//////////////////////////////
	// eval Tagged Keyword List //
	//////////////////////////////
	
	// remove duplicates from keywordList
	keywordList = _.unique(keywordList);
	
	// construct Tagged Keyword List
	taggedKeywordList = _.map(keywordList, function (key) {
		return "<taggedpair><taggedkey>" + key + "</taggedkey><taggedvalue>" + DDK.char.tilde + key + DDK.char.tilde + "</taggedvalue></taggedpair>";
	}).join("");

	// DEBUG out += "<div style='margin:10px;padding:10px;;background:#fcc;'>" + DDK.renderJSON(keywordList) + "</div>";	

	// Tagged Keyword List
	K("ddk_tagged_keyword_list", taggedKeywordList);
	
	// Evalute Tagged Keyword List via subwidget (let AMEngine to keyword replacement)
	// html-escape returned values
	taggedValueList = _.reduce(_.string.parseTaggedList(run("PSC_CWP_Tagged_Keyword_Eval")), function (accumulator, value) {
		accumulator[value[0].toLowerCase()] = _.escape(value[1]);
		return accumulator;
	}, {});

	// DEBUG out += "<div style='margin:10px;padding:10px;;background:#ccc;'>" + DDK.renderJSON(taggedValueList) + "</div>";	

	//////////////////
	// render bamset //
	//////////////////

	// open bamset
	bamset += "\n\n<div id=\"" + co.id + "\" class=\"bamset " + co["class"] + " " + config.setClassName + "\" " + config.setAttr + ">";

	//log(DDK.renderJSON(config, null, "\t"));

	// render the inner table elements only if there is data and column configuration
	if (recordCount) {
	
		// bamset header
		bamset += "\n\n<div class=\"row full bamset-header " + config.setHeaderClassName + " " + config.setHeaderGridClassName + "\" " + config.setHeaderAttr + " " + config.setHeaderAttr + ">";
		bamset += DDK.template.render.bamset2Bams("header", co, config, taggedValueList, _.last(data));
		bamset += "</div>";
		
		// bamset body
		bamsetBodyDiv = "\n\n<div class=\"row full bamset-body " + config.setBodyClassName + " " + config.setBodyGridClassName + "\" " + config.setBodyAttr + " " + config.setBodyGridAttr + ">";
		
		// == here is intentional
		if (config.setDatabind == 1 || config.setDatabind == 2) {
			// setDatabind == 1 or 2
			bamset += bamsetBodyDiv;
			
			_.each(config.setDatabind == 2 ? data : data.slice(-1), function (record) {
				bamset += DDK.template.render.bamset2Bams("body", co, config, taggedValueList, record);
			});
			
			bamset += "</div>";
		} else {
			// setDatabind == 3
			_.each(data, function (record) {
				bamset += bamsetBodyDiv;
				bamset += DDK.template.render.bamset2Bams("body", co, config, taggedValueList, record);
				bamset += "</div>";
			});			
		}
		
		
		// bamset footet
		bamset += "\n\n<div class=\"row full bamset-footer " + config.setFooterClassName + " " + config.setFooterGridClassName + "\" " + config.setFooterAttr + " " + config.setFooterGridAttr + ">";
		bamset += DDK.template.render.bamset2Bams("footer", co, config, taggedValueList, _.last(data));
		bamset += "</div>";

	}

	// close bamset
	bamset += "</div>";	
	
	// add table to output
	out += DDK.unescape.tildes(DDK.escape.brackets(bamset));
	
	// close wrapping data div
	out += "</div>";
	
	return out;
};