var widgetFunctions = {
	"-": function (widgetName) {
		return FunctionLib.run(widgetName);
	},
	
	"DDK_Data_Request": function () {
		return require("DDK_Data_Request_Module").render();
	},
	
	"SCIDIM_Query": function () {
		return require("SCIDIM_Query_Module").query();
	},
	
	"SCIDIM_Query_Header": function () {
		return require("SCIDIM_Query_Module").queryHeader();
	}
};

// runFav Queries
_.each(["Id", "Name"], function (config, index) {
	function select(ref, fields) {
		return _.map(fields, function (field) {
			if (field === "value") {
				return "CASE WHEN t.sci_type_label = 'Component' THEN REPLACE(REPLACE(REPLACE(CAST(" + ref + ".sci_fav_" + field + " AS VARCHAR(MAX)), CHAR(91), '%5B'), CHAR(93), '%5D'), CHAR(126), '%25%25') ELSE REPLACE(REPLACE(REPLACE(CAST(" + ref + ".sci_fav_" + field + " AS VARCHAR(MAX)), CHAR(91), CHAR(92) + CHAR(91)), CHAR(93), CHAR(92) + CHAR(93)), CHAR(126), CHAR(37) + CHAR(37)) END AS sci_fav_" + field;
			}
			
			if (field === "notes" || field === "description") {
				return "REPLACE(REPLACE(REPLACE(CAST(" + ref + ".sci_fav_" + field + " AS VARCHAR(MAX)), CHAR(91), CHAR(92) + CHAR(91)), CHAR(93), CHAR(92) + CHAR(93)), CHAR(126), CHAR(37) + CHAR(37)) AS sci_fav_" + field;
			}
			
			return ref + ".sci_fav_" + field + " AS sci_fav_" + field;
		}).join(", \n\t ");
	}
	
	var fields;
	
	fields = "id type function name label abbr description url value ext_id1 ext_id2 ext_id3 owner_org_id owner_id userid sort_order color img1 img2 img3 notes status created_by created_date modified_by modified_date".split(" ");
	
	widgetFunctions["PSC_Favorites_Record_Query_" + config] = function () {
		var favId;
		
		favId = K("ddk_fav_id");
		
		return "SELECT * FROM (" +
			"\n SELECT" + 
			"\n\t 0 AS sci_fav_list_order," + 
			"\n\t t.sci_type_label AS sci_fav_type_label," + 
			"\n\t " + select("fav", fields) + 
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
			"\n\t cfav.sci_fav_sort_order AS sci_fav_list_order," + 
			"\n\t t.sci_type_label AS sci_fav_type_label," + 
			"\n\t " + select("cfav", fields) + 
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
			"\n\t ON fr.sci_fr_fav2_id = cfav.sci_fav_id" +
			"\n ) LIST_DETAIL" +
			"\n ORDER BY sci_fav_list_order";	
	};		
		
		
/*

\[{"listOrder":"0","typeLabel":"Component","id":"991","areaId":"c872f21c-074c-e311-a099-00163e2af41d","type":"5","function":"0","name":"jsmreese,2014-07-03 13:34:51,Menu_List_Control,list,MB2_Content_Options","label":"Menu List Control","abbr":"","description":"","url":"","value":"&s_content_qhw=DDK2_FCat_Tree_Query_Header&s_content_con=%7B%22listMode%22%3A%22menu%22%2C%22imageSrc%22%3A%22%25%25x%25%25%22%7D&s_content_iw=MB2_Content_Options&s_content_qw=DDK2_FCat_Tree_Query&s_content_te=false&s_content_fod=false&s_content_keywords=%26p_fcat%3DPS_MENU&s_content_type=table","extId1":"Metrics_Browser_2","extId2":"","extId3":"content","ownerOrgId":"","ownerId":"","userid":"jsmreese","sortOrder":"200","color":"","img1":"","img2":"","img3":"","notes":"","status":"1","createdBy":"jsmreese","createdDate":"7/3/2014 1:34:51 PM","modifiedBy":"jsmreese","modifiedDate":"7/8/2014 3:12:59 PM"}\]
		
		return "SELECT * FROM (" +
			"\n SELECT" + 
			"\n\t 0 AS sci_fav_list_order," + 
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
			"\n\t cfav.sci_fav_sort_order AS sci_fav_list_order," + 
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
			"\n\t ON fr.sci_fr_fav2_id = cfav.sci_fav_id" +
			"\n ) LIST_DETAIL" +
			"\n ORDER BY sci_fav_list_order";	
	};
*/
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