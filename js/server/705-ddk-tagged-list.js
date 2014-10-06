DDK.taggedKeywordEval = function (keys, escape) {
	var taggedList;
	
	if (!_.isArray(keys) || !keys.length) { return {}; }

	taggedList = _.map(keys, function (key) {
		return "<taggedpair><taggedkey>" + key + "</taggedkey><taggedvalue>" + DDK.char.tilde + key + DDK.char.tilde + "</taggedvalue></taggedpair>";
	}).join("");
	
	K("ddk_tagged_keyword_list", taggedList);
	
	taggedList = _.reduce(_.string.parseTaggedList(run("PSC_CWP_Tagged_Keyword_Eval")), function (accumulator, value) {
		if (_.isArray(value) && value.length === 2) {
			accumulator[value[0].toLowerCase()] = (escape === true ? _.escape(value[1] || "") : (value[1] || ""));
		}
		return accumulator;
	}, {});
	
	K.flush("ddk_tagged_keyword_list");
	
	return taggedList;
};

DDK.taggedDataEval = function (keys, query, datasource, escape) {
	var taggedList;
	
	if (!_.isArray(keys) || !keys.length || !query) { return {}; }

	taggedList = _.map(keys, function (key) {
		return "<taggedpair><taggedkey>" + key + "</taggedkey><taggedvalue>" + DDK.char.tilde + key + DDK.char.tilde + "</taggedvalue></taggedpair>";
	}).join("");
	
	K("ddk_tagged_data_list", taggedList);
	K("ddk_tagged_data_query", query);
	K("ddk_tagged_data_datasource", datasource || "db.amdb");
	
	taggedList = _.reduce(_.string.parseTaggedList(run("PSC_CWP_Tagged_Data_Eval")), function (accumulator, value) {
		if (_.isArray(value) && value.length === 2) {
			accumulator[value[0].toLowerCase()] = (escape === true ? _.escape(value[1] || "") : (value[1] || ""));
		}
		return accumulator;
	}, {});
	
	K.flush("ddk_tagged_data_");
	
	return taggedList;
};