// DDK Templates
$.extend(true, DDK.template, {
	render: {
		option: function(options) {
			var out = "",
				i,
				optionCount = options.length,
				option;

			for (i = 0; i < optionCount; i += 1) {
				option = options[i];
				if (option.value) {
					out += "<option value=\"" + (option.value) + "\">" + (option.name) + "</option>";
				} else if (option.label) {
					out += "<option value=\"" + (option.name) + "\">" + (option.label) + "</option>";
				} else {
					out += "<option value=\"" + option + "\">" + option + "</option>";
				}
			}
			// console.log(options, out);

			return out;
		},
		radioIcons: function(icons, state) {
			var out = "",
				i,
				iconCount = icons.length,
				icon;

			for (i = 0; i < iconCount; i += 1) {
				icon = icons[i] || "";
				out += "<input type=\"radio\" name=\"radioIcons\" id=\"radioIcons" + i + "\" value=\"" + icon + "\" " + ((!icon || (state === icon)) ? "checked" : "") + " />";
				out += "<label " + (i ? "" : " style=\"margin-left: 10px;\" ") + "for=\"radioIcons" + i + "\" ><span style=\"padding: 0 4px; width: 12px;\" class=\"" + icon + "\">" + (icon ? "&nbsp;" : "NONE") + "</span></label>";
			}

			return out;
		},
		chartTypesDialog: function(currentChartType) {
			var typeGroups = [["point"], ["line", "stepline"], ["area", "stackedarea", "stackedarea100"], ["column", "stackedcolumn", "stackedcolumn100"], ["bar", "stackedbar", "stackedbar100"], ["pie", "doughnut"]],
				i,
				j,
				typeGroup,
				type,
				out = "";

			for (i = 0; i < typeGroups.length; i += 1) {
				typeGroup = typeGroups[i];
				out += "<div><span class=\"ddk-dialog-label\">" + typeGroup[0].toUpperCase() + "</span><div style=\"display: inline-block;\" class=\"ddk-buttonset\" data-role=\"chart\">";
				for (j = 0; j < typeGroup.length; j += 1) {
					out += "<input type=\"radio\" value=\"" + typeGroup[j] + "\" id=\"chart_type_b_" + typeGroup[j] + "\" name=\"chart_type_b\" " + (currentChartType === typeGroup[j] ? "checked" : "") + "><label for=\"chart_type_b_" + typeGroup[j] + "\">" + typeGroup[j] + "</label>";
				}
				out += "</div></div>"
			}

			return out;
		},
		scorecardChooseMetricsDialog: function(data) {
			var config = data && data.config || {},
				out = "";

			out += "<div class=\"ddk-dialog-content-header ddk-dialog-content-header-border" + (config.scorecardColumn ? "" : " ps-hidden") + "\"><span>Metric</span><span>Display as</span></div>";
			out += "<div class=\"ddk-dialog-content-columns\">";
			if (config.scorecardColumn) {
				out += DDK.template.render.scorecardDialogColumns([].concat(config.scorecardColumn));
			}
			out += "</div>";

			return out;
		},
		scorecardDialogColumns: function(columns) {
			var out = "",
				column,
				columnTemplate,
				template,
				layout,
				title,
				i;

			for (i = 0; i < columns.length; i += 1) {
				column = columns[i];
				out += DDK.template.render.scorecardDialogColumn(column);
			}

			return out;
		},
		scorecardDialogColumn: function(column) {
			var out = "",
				columnMetric = (column ? column.columnMetric.split(" ") : []),
				metric = columnMetric[0] || "",
				display = columnMetric[1] || "",
				layout = columnMetric[2] || 0,
				title = (column && column.columnTitle ? column.columnTitle : ""),
				subtitle = (column && column.columnSubtitle ? column.columnSubtitle : "");

			out += "<div class=\"ddk-dialog-bamset-bam ui-helper-clearfix\" data-column-config=\"" + _.escape(JSON.stringify(column)) + "\">";
			out += "<span class=\"ui-icon ui-icon-grip-dotted-vertical ui-priority-tertiary ps-clickme\" title=\"Reorder Column\"></span>";
			out += "<button class=\"ui-priority-secondary\" data-ddk-button=\"expandOptions\" data-ddk-role=\"ui-icon-triangle-1-e\">Expand Column Options</button>";
			out += "<select class=\"metric\" data-ddk-metric=\"" + metric + "\"></select>";
			out += "<select class=\"display\" data-ddk-display=\"" + display + "\"></select>";
			out += "<button class=\"ddk-button-action ddk-dialog-bamset-bam-remove is-plain-button right\" title=\"Remove Column\" data-ddk-button=\"removeMetric\"><span class=\"ddk-icon\">&#315;</span></button>";
			out += "<button class=\"ddk-button-action ddk-dialog-bamset-bam-edit is-plain-button right\" title=\"Edit\" data-ddk-button=\"editMetric\"><span class=\"ddk-icon\">&#368;</span></button>";

			// out += "<button class=\"ui-priority-secondary\" data-ddk-button=\"removeMetric\" data-ddk-role=\"ui-icon-closethick\">Remove Column</button>";
			out += "<div class=\"ddk-dialog-bamset-bam-options ui-priority-secondary ddk-dialog-separator\">";
			out += "<div><span class=\"ddk-dialog-label\">TITLE</span><input class=\"title ddk-dialog-field\" data-ddk-validate=\"textSafe\" value=\"" + title + "\"/></div>";
			out += "<div><span class=\"ddk-dialog-label\">SUBTITLE</span><input class=\"subtitle ddk-dialog-field\" data-ddk-validate=\"textSafe\" value=\"" + subtitle + "\"/></div>";
			out += "</div></div>";

			return out;
		},
		bamsetChooseMetricsDialog: function(data) {
			var config = data && data.config || {},
				out = "";
			//console.log(config, config.bamsetBam);
			out += "<div><label>Databind <input class=\"ddk-bamset-databind\" type=\"checkbox\" " + (config.bamsetDatabind ? "CHECKED" : "") + "></label></div>";
			out += "<div class=\"ddk-dialog-spacer ddk-dialog-content-header ddk-dialog-content-header-border" + (config.bamsetBam ? "" : " ps-hidden") + "\"><span>Metric</span><span>Display as</span></div>";
			out += "<div class=\"ddk-dialog-content-clusters\">";
			if (config.bamsetBam) {
				out += DDK.template.render.bamsetDialogClusters([].concat(config.bamsetBam));
			}
			out += "</div>";

			return out;
		},
		bamsetDialogClusters: function(clusters, isSubCluster) {
			var out = "",
				cluster,
				i;

			for (i = 0; i < clusters.length; i += 1) {
				if (!isSubCluster) {
					out += "<div class=\"ddk-dialog-bamset-cluster\">";
					out += "<div class=\"ddk-dialog-bamset-cluster-bams\">";
				}
				cluster = clusters[i];
				if (_.isArray(cluster)) {
					out += DDK.template.render.bamsetDialogClusters(cluster, true);
				} else {
					out += DDK.template.render.bamsetDialogBam(cluster);
				}
				if (!isSubCluster) {
					out += "</div>";
					out += "<div class=\"ddk-dialog-bamset-cluster-buttons\"><button data-ddk-button=\"addMetric\" class=\"ddk-bamset-add-metric\">Add Metric</button><button data-ddk-button=\"removeSet\" class=\"ddk-bamset-remove-cluster ui-priority-secondary\">Remove Set</button></div>";
					out += "</div>";
				}
			}

			return out;
		},
		bamsetDialogBam: function(bam) {
			var out = "",
				bamMetric = (bam ? bam.bamMetric.split(" ") : []),
				metric = bamMetric[0] || "",
				display = bamMetric[1] || "",
				layout = bamMetric[2] || 0,
				title = (bam && bam.bamTitle ? bam.bamTitle : ""),
				subtitle = (bam && bam.bamSubtitle ? bam.bamSubtitle : "");

			out += "<div class=\"ddk-dialog-bamset-bam ui-helper-clearfix\">";
			out += "<span class=\"ui-icon ui-icon-grip-dotted-vertical ui-priority-tertiary ps-clickme\" title=\"Reorder Metric\"></span>";
			out += "<button class=\"ui-priority-secondary\" data-ddk-button=\"expandOptions\" data-ddk-role=\"ui-icon-triangle-1-e\">Expand Metric Options</button>";
			out += "<select class=\"metric\" data-ddk-metric=\"" + metric + "\"></select>";
			out += "<select class=\"display\" data-ddk-display=\"" + display + "\"></select>";
			out += "<button class=\"ui-priority-secondary right\" data-ddk-button=\"removeMetric\" data-ddk-role=\"ui-icon-closethick\">Remove Metric</button>";
			out += "<div class=\"ddk-dialog-bamset-bam-options ui-priority-secondary ddk-dialog-separator\">";
			out += "<div><span class=\"ddk-dialog-label\">TITLE</span><input class=\"title ddk-dialog-field\" data-ddk-validate=\"textSafe\" value=\"" + title + "\"/></div>";
			out += "<div><span class=\"ddk-dialog-label\">SUBTITLE</span><input class=\"subtitle ddk-dialog-field\" data-ddk-validate=\"textSafe\" value=\"" + subtitle + "\"/></div>";
			out += "</div></div>";

			return out;
		}
	}
});