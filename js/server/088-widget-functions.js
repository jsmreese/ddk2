var widgetFunctions = {
	"-": function (widgetName) {
		return FunctionLib.run(widgetName);
	},
	
	"DDK_Data_Request": function () {
		return require("DDK_Data_Request_Module").render();
	}
};

// runFav Queries
_.each(["Id", "Name"], function (config, index) {
	widgetFunctions["PSC_Favorites_Record_Query_" + config] = function () {
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
			"\n\t AND fav." + (index ? "sci_fav_name = '" : "sci_fav_id = ") + favId + (index ? "'" : "") +
			
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
			"\n\t AND pfav." + (index ? "sci_fav_name = '" : "sci_fav_id = ") + favId + (index ? "'" : "") +
			"\n INNER JOIN sci_favorite_rel fr WITH(NOLOCK)" + 
			"\n\t ON pfav.sci_fav_id = fr.sci_fr_fav1_id" + 
			"\n INNER JOIN sci_favorites cfav WITH(NOLOCK)" + 
			"\n\t ON fr.sci_fr_fav2_id = cfav.sci_fav_id";	
	};
});

// DDK Controls
var tilde = String.fromCharCode(126);

_.each([
	{
		name: "tree",
		component: { 
			choose_metrics_label: "",
			query_widget: "PSC_Tree_Query_" + tilde + "tree_query_mode" + tilde,
			query_header_widget: "PSC_Tree_Query_Header_" + tilde + "tree_query_mode" + tilde,
			content_mode: "nav"
		}
	},
	{ name: "navset2", component: { choose_metrics_label: "Build Navset", content_mode: "nav2" } },
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