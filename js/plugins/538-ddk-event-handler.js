// DDK Event Handlers
$.extend(true, DDK.eventHandler, {
	controlRefresh: function(e, data) {
		if (PS.app && PS.app.forceReload) {
				PS.app.forceReload();
		}
		DDK[data.name].reload(data.id);
	},
	exportCSV: function(e, data) {
		var url = "amengine.aspx",
			insertWidget = "PSC_CCS_Export_Parameters",
			exportWidget = "PSC_CCS_Data_Set",
			exportData = data.url.slice(40).replace(/'/g, "''"),
			detail = _.toCase("camel", _.string.parseQueryString(exportData)),
			name = detail.componentName,
			id = detail.componentId,
			exportGetData = function (feid) {
				var data = {
					"config.mn": exportWidget,
					"output": "csv",
					"f_eid": feid,
					"component_name": name,
					"component_id": id
				};
				
				data[name + "_id"] = id;
				data[name + "_export_query_widget"] = detail[name + "ExportQueryWidget"];
				data[name + "_query_header_widget"] = detail[name + "QueryHeaderWidget"];
				data[name + "_query_widget"] = detail[name + "QueryWidget"];
				data[name + "_datasource"] = detail[name + "Datasource"];
				data.filename = detail.filename;
				
				return data;
			},
			loadingMessage = "<html><head><title>Building CSV Output...</title><style>body { background: #f4f4f4; text-align: center; font-family: sans-serif; font-size: 1em; line-height: 1.414em; color: #444; }</style></head><body><div>Building CSV Output...</div></body></html>",
			exportWindow = window.open();
	
		exportWindow.document.open();
		exportWindow.document.write(loadingMessage);
		exportWindow.document.close();
			
		$.post(url, {
			"config.mn": insertWidget,
			"fav_export_value": exportData
		},
		function (feid) {
			exportWindow.location = url + "?" + $.param(exportGetData(feid));
		});	
	},
	loadDefaultFavorite: function(e, data) {
		K.flush("s_" + data.id + "_");
		DDK[data.name].reload(data.id);
	},
	clearFavoriteBar: function(e, data) {
		K.flush(["fid", "fdesc", "fuid", "flab"], "s_" + data.id + "_");
		data.$this.closest("div.ddk-fav-bar").remove();
		DDK[data.name].resize(data.id);
	}
});	