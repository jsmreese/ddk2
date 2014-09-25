var keywordUpdate = function (key, value) {
	if (_.isPlainObject(value) || _.isArray(value)) {
		value = JSON.stringify(value);
	}
	FunctionLib.keywordUpdate(key, value);
};

var KeywordUpdate = keywordUpdate;

var runDelegator = _.delegator({
	"-": function (widgetName) {
		return FunctionLib.run(widgetName);
	},
	
	"PSC_Scorecard2_Widget": function () {
		var out;
		
		K({
			name: "scorecard2",
			id: keywordOrDefault("scorecard2_id", ""),
			choose_metrics_label: "Build Scorecard",
			content_widget: "PSC_Scorecard2_Content"
		}, "component_");

		out = require("DDK2_Control_Module").wrapper();
	
		K.flush(["minireport.detail", "component_", "scorecard2_"]);
	
		return out;
	},
	
	"PSC_Chart_Widget": function () {
		var out;
		
		K({
			name: "chart",
			id: keywordOrDefault("chart_id", ""),
			choose_metrics_label: "Choose Metrics",
			content_widget: "PSC_Chart_Content"
		}, "component_");

		out = require("DDK2_Control_Module").wrapper();
	
		K.flush(["minireport.detail", "component_", "chart_", "chart."]);
	
		return out;
	},
	
	"PSC_Favorites_Record_Query_Id": function () {
		var favId = K("ddk_fav_id");
		
		return "SELECT" + 
			"\n\t t.sci_type_label AS sci_fav_type_label," + 
			"\n\t fav.*" + 
			"\n FROM sci_areas a WITH(NOLOCK)" + 
			"\n INNER JOIN sci_types t WITH(NOLOCK)" + 
			"\n\t ON a.sci_area_table = 'sci_favorites'" + 
			"\n\t AND a.sci_area_id = t.sci_type_area_id" + 
			"\n\t AND t.sci_type_label IN ('Component', 'Content', 'Content List')" + 
			"\n INNER JOIN sci_favorites fav WITH(NOLOCK)" + 
			"\n\t ON t.sci_type = fav.sci_fav_type" + 
			"\n\t AND fav.sci_fav_id = " + favId + 
			
			"\n UNION ALL" + 

			"\n SELECT" + 
			"\n\t t.sci_type_label AS sci_fav_type_label," + 
			"\n\t cfav.*" + 
			"\n FROM sci_areas a WITH(NOLOCK)" + 
			"\n INNER JOIN sci_types t WITH(NOLOCK)" + 
			"\n\t ON a.sci_area_table = 'sci_favorites'" + 
			"\n\t AND a.sci_area_id = t.sci_type_area_id" + 
			"\n\t AND t.sci_type_label IN ('Component', 'Content', 'Content List')" + 
			"\n INNER JOIN sci_favorites pfav WITH(NOLOCK)" + 
			"\n\t ON t.sci_type = pfav.sci_fav_type" + 
			"\n\t AND pfav.sci_fav_id = " + favId +
			"\n INNER JOIN sci_favorite_rel fr WITH(NOLOCK)" + 
			"\n\t ON pfav.sci_fav_id = fr.sci_fr_fav1_id" + 
			"\n INNER JOIN sci_favorites cfav WITH(NOLOCK)" + 
			"\n\t ON fr.sci_fr_fav2_id = cfav.sci_fav_id"
	
	},
	
	"PSC_Favorites_Record_Query_Name": function () {
		var favId = K("ddk_fav_id");
		
		return "SELECT" + 
			"\n\t t.sci_type_label AS sci_fav_type_label," + 
			"\n\t fav.*" + 
			"\n FROM sci_areas a WITH(NOLOCK)" + 
			"\n INNER JOIN sci_types t WITH(NOLOCK)" + 
			"\n\t ON a.sci_area_table = 'sci_favorites'" + 
			"\n\t AND a.sci_area_id = t.sci_type_area_id" + 
			"\n\t AND t.sci_type_label IN ('Component', 'Content', 'Content List')" + 
			"\n INNER JOIN sci_favorites fav WITH(NOLOCK)" + 
			"\n\t ON t.sci_type = fav.sci_fav_type" + 
			"\n\t AND fav.sci_fav_name = '" + favId + "'" + 
				
			"\n UNION ALL" + 

			"\n SELECT" + 
			"\n\t t.sci_type_label AS sci_fav_type_label," + 
			"\n\t cfav.*" + 
			"\n FROM sci_areas a WITH(NOLOCK)" + 
			"\n INNER JOIN sci_types t WITH(NOLOCK)" + 
			"\n\t ON a.sci_area_table = 'sci_favorites'" + 
			"\n\t AND a.sci_area_id = t.sci_type_area_id" + 
			"\n\t AND t.sci_type_label IN ('Component', 'Content', 'Content List')" + 
			"\n INNER JOIN sci_favorites pfav WITH(NOLOCK)" + 
			"\n\t ON t.sci_type = pfav.sci_fav_type" + 
			"\n\t AND pfav.sci_fav_name = '" + favId + "'" + 
			"\n INNER JOIN sci_favorite_rel fr WITH(NOLOCK)" + 
			"\n\t ON pfav.sci_fav_id = fr.sci_fr_fav1_id" + 
			"\n INNER JOIN sci_favorites cfav WITH(NOLOCK)" + 
			"\n\t ON fr.sci_fr_fav2_id = cfav.sci_fav_id"
	}
	
}, "-");

var run = function (widgetName, keywords) {
	var result;
	
	// widgetName is both the caseKey and the first arument to the delegated function
	result = K.scope(function () {
		return runDelegator(widgetName, widgetName);
	}, keywords);

	if (_.string.startsWith(result, "AMEngine can't load starting widget ID '00' or widget name '" + widgetName + "' from database")) {
		return "AMEngine error: widget '" + widgetName + "' does not exist.";
	}
	
	return result;
};

var Run = run;