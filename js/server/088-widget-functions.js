var widgetFunctions = {
	"-": function (widgetName) {
		return FunctionLib.run(widgetName);
	},
	
	"DDK_Data_Request": function () {
		return require("DDK_Data_Request_Module").render();
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
	
};


<!-- Set CCS Options -->
[KeywordUpdate("component_name","tree")]
[KeywordUpdate("component_id","~tree_id~")]
[KeywordUpdate("component_choose_metrics_label","")]
[KeywordUpdate("component_fod_resize","true")]
[KeywordUpdate("component_content_widget","PSC_Tree_Content")]
[KeywordUpdate("component_toolbar_top_left_widget","")]
[KeywordUpdate("component_toolbar_top_right_buttonset_widget","")]
[KeywordUpdate("component_toolbar_top_right_widget", "")]
[KeywordUpdate("component_toolbar_bottom_left_widget","")]
[KeywordUpdate("component_toolbar_bottom_right_widget","")]
[KeywordUpdate("component_toolbar_filter_widget","")]
[KeywordUpdate("component_content_mode","nav")]
[KeywordUpdate("component_query_widget",)]
[KeywordUpdate("component_query_header_widget",)]

[Run("PSC_CCS_Wrapper")]

[KeywordFlush("minireport.detail")&KeywordFlush("component_")&KeywordFlush("tree_")]


// DDK Controls
_.each([
	{
		name: "tree",
		component: { 
			choose_metrics_label: "",
			query_widget: "PSC_Tree_Query_" + DDK.char.tilde + "tree_query_mode" + DDK.char.tilde,
			query_header_widget: "PSC_Tree_Query_Header_" + DDK.char.tilde + "tree_query_mode" + DDK.char.tilde
		}
	},
	{ name: "navset2", component: { choose_metrics_label: "Build Navset", query_widget: "PSC_Navset2_Query" } },
	{ name: "bamset", component: { choose_metrics_label: "Choose Metrics" } },
	{ name: "scorecard", component: { choose_metrics_label: "Choose Columns" } },
	{ name: "scorecard2", component: { choose_metrics_label: "Build Scorecard" } },
	{ name: "chart", component: { choose_metrics_label: "Choose Metrics" } },
	{ name: "bamset2", component: { choose_metrics_label: "Build Bams" } },
	{ name: "list", component: { choose_metrics_label: "Build List", content_mode: "nav" } },
	{ name: "table", component: { choose_metrics_label: "Choose Metrics" } }
], function (config) {	
	widgetFunctions["PSC_" + _.string.titleize(config.name) + "_Widget"] = function () {
		var out = "";
		
		K(	_.extend({}, config.component, {
			name: config.name,
			id: keywordOrDefault(config.name + "_id", "")
		}), "component_");
		
		out = require("DDK2_Control_Module").wrapper();
	
		K.flush(["minireport.detail", "component_", config.name + "_", config.name + "."]);
	
		return out;
	};
});

var runDelegator = _.delegator(widgetFunctions, "-");