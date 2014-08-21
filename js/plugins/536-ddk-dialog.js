// DDK Dialogs
$.extend(true, DDK.dialog, {
	chooseMetricsBamset: {
		dlgButtons: "_Add_Set OK Cancel",
		dlgClassName: "ddk-dialog-large",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				id = data.ddkControlId,
				name = data.ddkControlName,
				$content = $dialog.find(".ddk-dialog-content"),
				controlData = $("#psc_" + name + "_data_" + id).data(),
				controlElementData = $("#" + id).data(),
				$dialogContent,
				// metrics = _.uniq(_.map(data.ddkMetrics.split(","), function(value, index) {
					// return value.split("_")[0];
				// })),
				metrics = _.uniq(_.map(data.ddkMetrics, function(value) {
					return {
						name: value.columnMetric,
						label: _.string.titleize(value.columnMetric)
					};
				}), false, function(value, index) { return value.name; }),
				attributes =  _.uniq(_.map(data.ddkMetrics, function(value) {
					return {
						name: value.columnMetricAttr,
						label: _.string.titleize(value.columnMetricAttr)
					};
				}), false, function(value, index) { return value.name; }).sort(function(a, b) {
					//console.log(a.label, b.label, a.label > b.label);
					if (a.label > b.label) {
						return 1;
					} else if (b.label > a.label) {
						return -1;
					} else {
						return 0;
					}
				}),
				displays;

			$.extend(true, data, controlData, controlElementData);
			displays = _.map($.extend(true, {}, DDK.template.metricDisplay, (DDK.bamset.data[id] && DDK.bamset.data[id].customMetricDisplayTemplate) || {}), function(value, key) {
				return {name: key, label: value.displayLabel};
			}).sort(function(a, b) {
				//console.log(a.label, b.label, a.label > b.label);
				if (a.label > b.label) {
					return 1;
				} else if (b.label > a.label) {
					return -1;
				} else {
					return 0;
				}
			});
			//console.log(data, metrics, displays);

			$dialogContent = $(DDK.template.render.bamsetChooseMetricsDialog(data))
				.find("select.display")
					//.html("<optgroup label=\"Formatted\">" + DDK.template.render.option(displays) + "</optgroup><optgroup label=\"Unformatted\">" + DDK.template.render.option(attributes) + "</optgroup>")
					.html(DDK.template.render.option(displays))
					.val(function(index, value) {
						var $this = $(this),
							data = $this.data(),
							display = data.ddkDisplay;

						return display;
					})
					.end()
				.find("select.metric")
					.html(DDK.template.render.option(metrics))
					.val(function(index, value) {
						var $this = $(this),
							data = $this.data(),
							metric = data.ddkMetric.toUpperCase();

						return metric;
					})
					.end()
				.find("button")
					.each(DDK.makeButton)
					.end()
				.replaceAll($content.children())
				.find(".ddk-dialog-bamset-bam-options")
					.toggle()
					.end();

			$dialog
				.position({
						my: "left top",
						at: "left bottom",
						of: data.ddkClickedButton,
						offset: "-9 3",
						collision: "fit"
					})
				.on("click", "button[data-ddk-button]", function() {
					var $this = $(this),
						$dialog = $this.closest(".ddk-dialog"),
						data = $.extend(true, {}, $this.data(), $dialog.data()),
						action = data.ddkButton,
						id = data.ddkControlId,
						name = data.ddkControlName,
						controlElementData = $("#" + id).data(),
						controlData = $("#psc_" + name + "_data_" + id).data(),
						$clusters,
						newBamsetBam = [],
						oldConfig,
						newConfig,
						cluster;

					$.extend(true, data, controlData, controlElementData);
					// console.log($this, action, $this.data("ddkAction"));

					switch (action) {
						case "removeSet":
							$this.closest(".ddk-dialog-bamset-cluster").remove();
							break;
						case "removeMetric":
							$this.closest(".ddk-dialog-bamset-bam").remove();
							break;
						case "Add_Set":
							$("<div class=\"ddk-dialog-bamset-cluster\"><div class=\"ddk-dialog-bamset-cluster-bams\">"
								+ DDK.template.render.bamsetDialogBam()
								+ "</div>"
								+ "<div class=\"ddk-dialog-bamset-cluster-buttons\"><button data-ddk-button=\"addMetric\" class=\"ddk-bamset-add-metric\">Add Metric</button><button data-ddk-button=\"removeSet\" class=\"ddk-bamset-remove-cluster ui-priority-secondary\">Remove Set</button></div>"
								+ "</div>")
								.find("select.display")
									.html(DDK.template.render.option(displays))
									.end()
								.find("select.metric")
									.html(DDK.template.render.option(metrics))
									.end()
								.find("button")
									.each(DDK.makeButton)
									.end()
								.appendTo($dialog.find(".ddk-dialog-content-clusters"))
								.find(".ddk-dialog-bamset-bam-options")
									.toggle()
									.end()
								.find(".ddk-dialog-bamset-cluster-bams")
									.sortable({
										placeholder: "ddk-dialog-bamset-bam-placeholder ui-state-highlight",
										connectWith: ".ddk-dialog-bamset-cluster-bams",
										handle: ".ui-icon-grip-dotted-vertical"
									});
							break;
						case "addMetric":
							$(DDK.template.render.bamsetDialogBam())
								.find("select.display")
									//.html("<optgroup label=\"Formatted\">" + DDK.template.render.option(displays) + "</optgroup><optgroup label=\"Unformatted\">" + DDK.template.render.option(attributes) + "</optgroup>")
									.html(DDK.template.render.option(displays))
									.val("currentValue")
									.end()
								.find("select.metric")
									.html(DDK.template.render.option(metrics))
									.end()
								.find("button")
									.each(DDK.makeButton)
									.end()
								.appendTo($this.closest(".ddk-dialog-bamset-cluster").find(".ddk-dialog-bamset-cluster-bams"))
								.find(".ddk-dialog-bamset-bam-options")
									.toggle()
									.end();
							break;
						case "expandOptions":
							$this
								.find(".ui-icon")
									.toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s")
									.end()
								.closest(".ddk-dialog-bamset-bam")
									.find(".ddk-dialog-bamset-bam-options")
									.toggle();
							break;
						case "OK":
							oldConfig = data && data.config  || {};
							$clusters = $dialog.find(".ddk-dialog-bamset-cluster");
							$clusters.each(function() {
								var $this = $(this);
								cluster = [];
								$this.find(".ddk-dialog-bamset-bam").each(function() {
									var $this = $(this),
										metric = ($this.find(".metric").val() || ""),
										display = ($this.find(".display").val() || ""),
										layout = ($this.find(".layout").val() || ""),
										title = ($this.find(".title").val() || ""),
										subtitle = ($this.find(".subtitle").val() || ""),
										newBam = {};

									newBam.bamMetric = $.trim((metric + " " + display + " " + layout));
									if (title) {
										newBam.bamTitle = title;
									}
									if (subtitle) {
										newBam.bamSubtitle = subtitle;
									}
									cluster.push(newBam);
								});
								newBamsetBam.push(cluster);
							});

							newConfig = oldConfig;
							newConfig.bamsetBam = newBamsetBam;
							newConfig.bamsetDatabind = $dialog.find(".ddk-bamset-databind").prop("checked");

							//console.log(newConfig, JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(91)).replace(/\x5D/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(93)));

							//K("s_" + id + "_con", JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, String.fromCharCode(92) + String.fromCharCode(91)).replace(/\x5D/g, String.fromCharCode(92) + String.fromCharCode(93)));
							K("s_" + id + "_con", DDK.escape.brackets(JSON.stringify(newConfig)));
							//console.log(K("s_" + id + "_con"));
							DDK.bamset.reload(id);
							break;
					}
				})
				.find(".ddk-dialog-bamset-cluster-bams")
					.sortable({
						placeholder: "ddk-dialog-bamset-bam-placeholder ui-state-highlight",
						connectWith: ".ddk-dialog-bamset-cluster-bams",
						handle: ".ui-icon-grip-dotted-vertical"
					});
		},
		dlgTitle: "Choose Metrics"
	},
	chooseMetricsScorecard: {
		dlgButtons: "_Add_Column OK Cancel",
		dlgClassName: "ddk-dialog-large",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				id = data.ddkControlId,
				name = data.ddkControlName,
				$content = $dialog.find(".ddk-dialog-content"),
				controlData = $("#psc_" + name + "_data_" + id).data(),
				controlElementData = $("#" + id).data(),
				$dialogContent,
				// metrics = _.uniq(_.map(data.ddkMetrics.split(","), function(value, index) {
					// return value.split("_")[0];
				// })),
				metrics = _.uniq(_.map(data.ddkMetrics, function(value) {
					return {
						name: value.columnMetric,
						label: _.string.titleize(value.columnMetric)
					};
				}), false, function(value, index) { return value.name; }),
				attributes =  _.uniq(_.map(data.ddkMetrics, function(value) {
					return {
						name: value.columnMetricAttr,
						label: _.string.titleize(value.columnMetricAttr)
					};
				}), false, function(value, index) { return value.name; }).sort(function(a, b) {
					//console.log(a.label, b.label, a.label > b.label);
					if (a.label > b.label) {
						return 1;
					} else if (b.label > a.label) {
						return -1;
					} else {
						return 0;
					}
				}),
				displays;

			$.extend(true, data, controlData, controlElementData);
			displays = _.map($.extend(true, {}, DDK.template.metricDisplay, (DDK.scorecard.data[id] && DDK.scorecard.data[id].customMetricDisplayTemplate) || {}), function(value, key) {
				return {name: key, label: value.displayLabel};
			}).sort(function(a, b) {
				//console.log(a.label, b.label, a.label > b.label);
				if (a.label > b.label) {
					return 1;
				} else if (b.label > a.label) {
					return -1;
				} else {
					return 0;
				}
			});

			//console.log(data, metrics, displays);

			$dialogContent = $(DDK.template.render.scorecardChooseMetricsDialog(data))
				.find("select.display")
					//.html("<optgroup label=\"Formatted\">" + DDK.template.render.option(displays) + "</optgroup><optgroup label=\"Unformatted\">" + DDK.template.render.option(attributes) + "</optgroup>")
					.html(DDK.template.render.option(displays))
					.val(function(index, value) {
						var $this = $(this),
							data = $this.data(),
							display = data.ddkDisplay;

						return display;
					})
					.end()
				.find("select.metric")
					.html(DDK.template.render.option(metrics))
					.val(function(index, value) {
						var $this = $(this),
							data = $this.data(),
							metric = data.ddkMetric.toUpperCase();

						return metric;
					})
					.each(function() {
						var $this = $(this);
						if (metrics.length === 1) {
							$this.prop("disabled", true);
						}
					})
					.end()
				.find("button")
					.each(DDK.makeButton)
					.end()
				.replaceAll($content.children())
				.find(".ddk-dialog-bamset-bam-options")
					.toggle()
					.end();

			$dialog
				.position({
						my: "left top",
						at: "left bottom",
						of: data.ddkClickedButton,
						offset: "-9 3",
						collision: "fit"
					})
				.on("click", "button[data-ddk-button]", function() {
					var $this = $(this),
						$dialog = $this.closest(".ddk-dialog"),
						data = $.extend(true, {}, $this.data(), $dialog.data()),
						action = data.ddkButton,
						id = data.ddkControlId,
						name = data.ddkControlName,
						controlElementData = $("#" + id).data(),
						controlData = $("#psc_" + name + "_data_" + id).data(),
						oldConfig,
						newConfig,
						columns = [],
						$column,
						columnData;

					$.extend(true, data, controlData, controlElementData);
					// console.log($this, action, $this.data("ddkAction"));

					switch (action) {
						case "editMetric":
							$column = $this.closest(".ddk-dialog-bamset-bam");
							columnData = $column.data();

							columnData.$dialog = DDK.dialogs.edit({ 
								title: "Edit Column",
								save: function (value) {
									$column.data("columnConfig", _.string.parseJSON(value));
								},
								dataType: "json",
								value: JSON.stringify(columnData.columnConfig),
								$target: $this
							});
							
							if (columnData.$dialog.dialog("isOpen")) {
								columnData.$dialog.dialog("moveToTop");
							} else {
								columnData.$dialog.dialog("open");
							}
							break;
						case "removeMetric":
							$this.closest(".ddk-dialog-bamset-bam").remove();
							break;
						case "Add_Column":
							$(DDK.template.render.scorecardDialogColumn({ columnMetric: metrics[0].name + " currentValue" }))
								.find("select.display")
									//.html("<optgroup label=\"Formatted\">" + DDK.template.render.option(displays) + "</optgroup><optgroup label=\"Unformatted\">" + DDK.template.render.option(attributes) + "</optgroup>")
									.html(DDK.template.render.option(displays))
									.val("currentValue")
									.end()
								.find("select.metric")
									.html(DDK.template.render.option(metrics))
									.each(function() {
										var $this = $(this);
										if (metrics.length === 1) {
											$this.prop("disabled", true);
										}
									})
									.end()
								.find("button")
									.each(DDK.makeButton)
									.end()
								.appendTo($this.closest(".ddk-dialog").find(".ddk-dialog-content-columns"))
								.find(".ddk-dialog-bamset-bam-options")
									.toggle()
									.end();
							break;
						case "expandOptions":
							$this
								.find(".ui-icon")
									.toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s")
									.end()
								.closest(".ddk-dialog-bamset-bam")
									.find(".ddk-dialog-bamset-bam-options")
									.toggle();
							break;
						case "OK":
							oldConfig = data && data.config || {};
							$columns = $dialog.find(".ddk-dialog-bamset-bam");

							$columns.each(function() {
								var $this = $(this),
									metric = ($this.find(".metric").val() || ""),
									display = ($this.find(".display").val() || ""),
									layout = ($this.find(".layout").val() || ""),
									title = ($this.find(".title").val() || ""),
									subtitle = ($this.find(".subtitle").val() || ""),
									newColumn = $this.data("columnConfig");

								newColumn.columnMetric = $.trim((metric + " " + display + " " + layout));
								if (title) {
									newColumn.columnTitle = title;
								}
								if (subtitle) {
									newColumn.columnSubtitle = subtitle;
								}
								columns.push(newColumn);
							});

							if (columns.length) {
								newConfig = oldConfig;
								newConfig.scorecardColumn = columns;
							} else {
								newConfig = "\"\"";
							}

							//newConfig = oldConfig;
							//newConfig.scorecardColumn = (columns.length ? columns : "\"\"");

							//console.log("Scorecard config dialog: ", newConfig);

							//console.log(newConfig, JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(91)).replace(/\x5D/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(93)));

							//K("s_" + id + "_con", JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, String.fromCharCode(92) + String.fromCharCode(91)).replace(/\x5D/g, String.fromCharCode(92) + String.fromCharCode(93)));
							K("s_" + id + "_con", DDK.escape.brackets(JSON.stringify(newConfig)));
							DDK.scorecard.reload(id);
							break;
					}
				})
				.find(".ddk-dialog-content-columns")
					.sortable({
						placeholder: "ddk-dialog-bamset-bam-placeholder ui-state-highlight",
						handle: ".ui-icon-grip-dotted-vertical"
					});
		},
		dlgTitle: "Choose Columns"
	},

	// {
		// dlgButtons: "_Add_Column OK Cancel",
// //		dlgClassName: "ddk-dialog-large",
		// dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		// dlgInit: function($dialog) {
			// var data = $dialog.data(),
				// id = data.ddkControlId,
				// name = data.ddkControlName,
				// $content = $dialog.find(".ddk-dialog-content"),
				// controlData = $("#psc_" + name + "_data_" + id).data(),
				// controlElementData = $("#" + id).data(),
				// $dialogContent,
				// // metrics = _.uniq(_.map(data.ddkMetrics.split(","), function(value, index) {
					// // return value.split("_")[0];
				// // })),
				// metrics = _.pluck(data.ddkMetrics, "columnName"),
				// columnTemplates;

			// $.extend(true, data, controlData, controlElementData);
			// columnTemplates = _.map(DDK.template.columnTemplate, function(value, key) {
				// return {name: key, label: value.displayLabel};
			// });
			// //console.log(data, metrics, displays);

			// $dialogContent = $(DDK.template.render.scorecardChooseMetricsDialog(data))
				// .find("select.column")
					// .html(function(index, value) {
						// if (index) {
							// return DDK.template.render.option(_.reject(columnTemplates, function(value, index) { return (value.name === "metricName"); }));
						// } else {
							// return DDK.template.render.option(columnTemplates);
						// }
					// })
					// .val(function(index, value) {
						// var $this = $(this),
							// data = $this.data(),
							// template = data.ddkTemplate;

						// return template;
					// })
					// .end()
				// .find("button")
					// .each(DDK.makeButton)
					// .end()
				// .replaceAll($content.children())
				// .find(".ddk-dialog-column-options")
					// .toggle()
					// .end();

			// $dialog
				// .position({
						// my: "left top",
						// at: "left bottom",
						// of: data.ddkClickedButton,
						// offset: "-9 3",
						// collision: "fit"
					// })
				// .on("click", "button[data-ddk-button]", function() {
					// var $this = $(this),
						// $dialog = $this.closest(".ddk-dialog"),
						// data = $.extend(true, {}, $this.data(), $dialog.data()),
						// action = data.ddkButton,
						// id = data.ddkControlId,
						// name = data.ddkControlName,
						// controlElementData = $("#" + id).data(),
						// controlData = $("#psc_" + name + "_data_" + id).data(),
						// $columns,
						// newScorecardColumn = [],
						// oldConfig,
						// newConfig
						// columnTemplates;

					// $.extend(true, data, controlData, controlElementData);
					// // console.log($this, action, $this.data("ddkAction"));
					// columnTemplates = _.map(DDK.template.columnTemplate, function(value, key) {
						// return {name: key, label: value.displayLabel};
					// });

					// switch (action) {
						// case "removeColumn":
							// $this.closest(".ddk-dialog-bamset-bam").remove();
						// break;
						// case "Add_Column":
							// $(DDK.template.render.scorecardDialogColumn())
								// .find("select.column")
									// .html(DDK.template.render.option(_.reject(columnTemplates, function(value, index) { return (value.name === "metricName"); })))
									// .end()
								// .find("button")
									// .each(DDK.makeButton)
									// .end()
								// .appendTo(".ddk-dialog-content")
								// .find(".ddk-dialog-column-options")
									// .toggle()
									// .end();
						// break;
						// case "expandOptions":
							// $this
								// .find(".ui-icon")
									// .toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s")
									// .end()
								// .closest(".ddk-dialog-bamset-bam")
									// .find(".ddk-dialog-column-options")
									// .toggle();
						// break;
						// case "OK":
							// oldConfig = data.config;
							// $columns = $dialog.find(".ddk-dialog-bamset-bam");
							// $columns.each(function() {
								// var $this = $(this);
									// template = ($this.find(".column").val() || ""),
									// layout = ($this.find(".layout").val() || ""),
									// title = ($this.find(".title").val() || ""),
									// column = {};

								// column.columnTemplate = $.trim((template + " " + layout));
								// if (title) {
									// column.columnTitle = title;
								// }

								// newScorecardColumn.push(column);
							// });

							// newConfig = oldConfig;
							// newConfig.scorecardColumn = newScorecardColumn;

							// //console.log(newConfig, JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(91)).replace(/\x5D/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(93)));

							// K("s_" + id + "_con", JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, String.fromCharCode(92) + String.fromCharCode(91)).replace(/\x5D/g, String.fromCharCode(92) + String.fromCharCode(93)));
							// DDK.scorecard.reload(id);
						// break;
					// }
				// });
		// },
		// dlgTitle: "Choose Columns"
	// },
	chartQueryFilter: {
		dlgButtons: "OK Cancel",
		//dlgClassName: "ddk-dialog-large",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgIcon: "ui-icon-pencil",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				id = data.ddkControlId,
				name = data.ddkControlName,
				$content = $dialog.find(".ddk-dialog-content"),
				controlData = $("#psc_" + name + "_data_" + id).data(),
				controlElementData = $("#" + id).data(),
				$dialogContent,
				dialogContent = "",
				co = data.ddkQuery,
				metrics = _.map(_.pluck(data.ddkMetrics, "columnName"), function(value, index) {
					return {
						label: value.replace(/_/g, " ").toUpperCase(),
						name: value.toUpperCase()
					};
				}),
				sortDirections = "ASC DESC".split(" "),
				dimensions = (co.query_dimension_list ? _.map(co.query_dimension_list.toUpperCase().replace(/'/g, "").split(","), function(value, index) {
					return {
						label: value.replace(/_/g, " "),
						name: value
					};
				}) : []),
				sortFieldNames = [],
				sortFieldOrders = [],
				orderPair,
				sortDirOptions = DDK.template.render.option(sortDirections),
				sortFieldOptions = DDK.template.render.option(metrics),
				sortFieldRow = "<div class=\"ui-helper-clearfix\"><span class=\"ddk-dialog-label\">&nbsp;</span><select class=\"sort-field ddk-dialog-field\">" + sortFieldOptions + "</select><select class=\"sort-dir ddk-dialog-field\">" + sortDirOptions + "</select><button class='right sort-remove ui-priority-secondary'>Remove Sort Field</button></div>";


			$.extend(true, data, controlData, controlElementData);

			//console.log(data);

			if (co.query_order) {
				if (co.query_order.indexOf("'") === -1) {
					// old format for query order `FIELD_NAME_1 ASC`
					orderPair = co.query_order.toUpperCase().split(" ");
					sortFieldNames.push(orderPair[0]);
					sortFieldOrders.push(orderPair[1]);
				} else {
					// new serialized format for query order
					// `'FIELD_NAME_1','ASC'^'FIELD NAME 2','ASC'`
					// new format allows application of query_fieldname_escapechar option
					_.each(co.query_order.toUpperCase().replace(DDK.regex.singleQuote, "").split("^"), function (value) {
						var orderPair = value.split(","),
							fieldName = orderPair[0],
							fieldOrder = orderPair[1];

						sortFieldNames.push(fieldName);
						sortFieldOrders.push(fieldOrder);
					});
				}
			} else {
				sortFieldNames.push(co.query_dimension.toUpperCase());
				sortFieldOrders.push(co.query_dimension_order);
			}

			if (co.query_dimension_list) {
				dialogContent += "<div class=\"ui-helper-clearfix\"><span class=\"ddk-dialog-label\">X-AXIS</span><select class=\"group-field ddk-dialog-field\"></select></div>";
			}

			if (co.query_top_enabled === "true") {
				dialogContent += "<div class=\"ddk-dialog-spacer ui-helper-clearfix\"><span class=\"ddk-dialog-label\">TOP</span><input class=\"query-top ddk-dialog-field\" data-ddk-validate=\"numberInteger\" value=\"" + (parseInt(co.query_top, 10) ? co.query_top : "") + "\"/></div>";
			}

			dialogContent += "<div class=\"ddk-dialog-spacer ui-helper-clearfix\" style=\"position: relative;\"><span class=\"ddk-dialog-label\" style=\"position: absolute; top: 3px;\">SORT BY</span></div>";

			_.each(sortFieldNames, function (value, index) {
				dialogContent += sortFieldRow;
			});

			dialogContent += "<div class=\"ui-helper-clearfix\"><button class='right sort-add ui-priority-secondary'>Add Sort Field</button></div>";


			$dialogContent = $(dialogContent)
				.find("select.sort-dir")
					.val(function (index, value) {
						return sortFieldOrders[index];
					})
					.end()
				.find("select.sort-field")
					.val(function (index, value) {
						return sortFieldNames[index];
					})
					.end()
				.find("select.group-field")
					.html(DDK.template.render.option(dimensions))
					.val(co.query_dimension.toUpperCase())
					// .change(function() {
						// var $this = $(this),
							// $dialog = $this.closest(".ps-tooltip-dialog"),
							// data = $dialog.data(),
							// dimensions = (co.query_dimension_list ? _.map(co.query_dimension_list.toUpperCase().replace(/'/g, "").split(","), function(value, index) {
								// return {
									// label: value.replace(/_/g, " "),
									// name: value
								// };
							// }) : []),
							// $sortOptions = $dialog.find("select.sort-field option"),
							// groupBy = this.value;

						// $sortOptions.each(function() {
							// var $this = $(this),
								// dimensionIndex = _.indexOf(_.pluck(dimensions, "name"), this.value),
								// groupByIndex = _.indexOf(_.pluck(dimensions, "name"), groupBy);

							// if (dimensionIndex > -1) {
								// $this.attr("value", groupBy).html(_.pluck(dimensions, "label")[groupByIndex]);
							// }
						// });

					// })
					.end()
				.replaceAll($content.children());

			$dialog
				.position({
						my: "left top",
						at: "left bottom",
						of: data.ddkClickedButton,
						offset: "-9 3",
						collision: "fit"
					})
				.find(".sort-add")
					.click(function () {
						$(this).closest("div").before(
							$(sortFieldRow)
								.find(".sort-remove")
								.click(function () {
									$(this).closest("div").remove();
								})
								.button({ icons: { primary: 'ui-icon-closethick' }, text: false })
								.end()
						);
					})
					.button({ icons: { primary: 'ui-icon-plusthick' }, text: false })
					.end()
				.find(".sort-remove")
					.click(function () {
						$(this).closest("div").remove();
					})
					.button({ icons: { primary: 'ui-icon-closethick' }, text: false })
					.end()
				.find("button[data-ddk-button=\"OK\"]")
					.click(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							id = data.ddkControlId,
							name = data.ddkControlName,
							$sortDirs = $dialog.find("select.sort-dir"),
							$sortFields = $dialog.find("select.sort-field"),
							sortPairs = [],
							groupField = $dialog.find("select.group-field").val(),
							queryTop = $dialog.find("input.query-top").val(),
							co = data.ddkQuery,
							options;

						// collect the sort fields and sort dirs
						$sortFields.each(function (index, elem) {
							sortPairs[index] = { fieldName: elem.value };
						});

						$sortDirs.each(function (index, elem) {
							sortPairs[index].fieldOrder = elem.value;
						});

						// if there are no sort fields defined, default to sorting on the query_dimension
						if (!sortPairs.length) {
							sortPairs[0] = { fieldName: co.query_dimension, fieldOrder: co.query_dimension_order };
						}

						// duplicate field names are not allowed in the ORDER BY clause
						sortPairs = _.unique(sortPairs, "fieldName");

						options = { qo: _.map(sortPairs, function (value, index) {
							return "'" + value.fieldName + "','" + value.fieldOrder + "'";
						}).join("^") };

						if (queryTop) {
							options.qt = queryTop;
						} else {
							options.qt = "NONE";
						}
						if (groupField) {
							options.qd = groupField;
						}

						K(options, "s_" + id + "_");
						DDK[name].reload(id);
					});
			},
		dlgTitle: "Edit Parameters"
	},
	chartConfig: {
		dlgButtons: "OK Cancel",
		dlgClassName: "ddk-dialog-medium",
		dlgContent: "<div><span class=\"ddk-dialog-label\">TITLE</span><input class=\"ti ddk-dialog-field\" data-ddk-validate=\"textSafe\" /></div>"
			+ "<div><span class=\"ddk-dialog-label\">X AXIS LABEL</span><input class=\"lax ddk-dialog-field\" data-ddk-validate=\"textSafe\" /></div>"
			+ "<div><span class=\"ddk-dialog-label\">Y1 AXIS LABEL</span><input class=\"lay ddk-dialog-field\" data-ddk-validate=\"textSafe\" /></div>"
			+ "<div><span class=\"ddk-dialog-label\">Y2 AXIS LABEL</span><input class=\"lay2 ddk-dialog-field\" data-ddk-validate=\"textSafe\" /></div>"
			+ "<div class=\"ddk-dialog-separator ui-helper-clearfix\"><span class=\"ddk-dialog-label\">SERIES CONFIG</span><select class=\"scp ddk-dialog-field\"></select></div>"
			+ "<div><span class=\"ddk-dialog-label\">LEGEND</span><select class=\"lp ddk-dialog-field\"></select></div>"
			+ "<div class=\"ddk-dialog-separator ui-helper-clearfix\"><span class=\"ddk-dialog-label\">STACKED TOTALS</span></div>"
			+ "<div><span class=\"ddk-dialog-label\">Y1 AXIS</span><input type=\"checkbox\" class=\"layse ddk-dialog-field\" /></div>"
			+ "<div><span class=\"ddk-dialog-label\">Y2 AXIS</span><input type=\"checkbox\" class=\"lay2se ddk-dialog-field\" /></div>",
		dlgInit: function($dialog) {
			var positions = "none top right bottom left".split(" "),
				data = $dialog.data(),
				co = data.ddkChartOptions;

			$dialog
				.find(".ddk-dialog-field.scp")
					.html(DDK.template.render.option(positions))
					.val(co.series_config_position)
					.end()
				.find(".ddk-dialog-field.lp")
					.html(DDK.template.render.option(positions))
					.val(co.legend_position)
					.end()
				.find(".ddk-dialog-field.ti")
					.val(co.title)
					.end()
				.find(".ddk-dialog-field.lax")
					.val(co.label_axisx)
					.end()
				.find(".ddk-dialog-field.lay")
					.val(co.label_axisy)
					.end()
				.find(".ddk-dialog-field.lay2")
					.val(co.label_axisy2)
					.end()
				.find(".ddk-dialog-field.layse")
					.prop("checked", co.label_axisy_stacked_enabled === "true")
					.end()
				.find(".ddk-dialog-field.lay2se")
					.prop("checked", co.label_axisy2_stacked_enabled === "true")
					.end()
				.find("button[data-ddk-button=\"OK\"]")
					.click(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							id = data.ddkControlId,
							name = data.ddkControlName,
							options = "scp lp ti lax lay lay2 layse lay2se".split(" "),
							option,
							keywords = {},
							i,
							value,
							checked,
							$field;

						for (i = 0; i < options.length; i += 1) {
							option = options[i];
							$field = $dialog.find(".ddk-dialog-field." + option);
							if ($field.attr("type") === "checkbox") {
								checked = $field.prop("checked");
								keywords[option] = (checked ? "true" : "false");
							} else {
								value = $field.val();
								keywords[option] = value;
							}
						}

						K(keywords, "s_" + id + "_");

						$dialog.remove();
						DDK[name].reload(id);
					})
					.end();
		},
		dlgTitle: "Chart Options"
	},
	addFilter: {
		dlgButtons: "OK Cancel",
		dlgClassName: "ddk-dialog-small",
		dlgContent: "<div><span class=\"ddk-dialog-label\">METRIC</span><select class=\"metric ddk-dialog-field\"></select></div>"
			+ "<div><span class=\"ddk-dialog-label\">OPERATOR</span><select class=\"operator ddk-dialog-field\"></select></div>"
			+ "<div><span class=\"ddk-dialog-label\">VALUE</span><input class=\"value ddk-dialog-field\" data-ddk-validate=\"textSafe\" /></div>",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				metrics = _.map(_.pluck(data.ddkMetrics, "columnName"), function(value, index) {
					return {
						name: value.replace(/_/g, " ").toUpperCase(),
						value: value.toUpperCase()
					};
				}),
				operators = "=,NOT =,LIKE,NOT LIKE,IN,NOT IN,&gt;,&gt;=,&lt;,&lt;=".split(",");

			$dialog
				.find(".ddk-dialog-field.metric")
					.html(DDK.template.render.option(metrics))
					.change(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							metric = this.value,
							operator = $dialog.find(".ddk-dialog-field.operator").val(),
							$value = $dialog.find(".ddk-dialog-field.value"),
							type = _.find(data.ddkMetrics, function(item) { return (item.columnName.toUpperCase() === metric.toUpperCase()); }).columnType;

						switch (type) {
							case "int":
								$value.data("ddkValidate", "numberInteger" + (operator.indexOf("IN") > -1 ? "List" : ""));
								break;
							case "float":
								$value.data("ddkValidate", "numberFloat" + (operator.indexOf("IN") > -1 ? "List" : ""));
								break;
							default:
								$value.data("ddkValidate", "textSafeList");
						}

						$value.trigger("change");
					})
					.end()
				.find(".ddk-dialog-field.operator")
					.html(DDK.template.render.option(operators))
					.change(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							$metric = $dialog.find(".ddk-dialog-field.metric");

						setTimeout(function() {$metric.trigger("change");});
					})
					.end()
				.find("button[data-ddk-button=\"OK\"]")
					.click(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							id = data.ddkControlId,
							name = data.ddkControlName,
							metric = $dialog.find(".ddk-dialog-field.metric").val(),
							operator = $dialog.find(".ddk-dialog-field.operator").val(),
							value = $dialog.find(".ddk-dialog-field.value").val(),
							type = _.find(data.ddkMetrics, function(item) { return (item.columnName.toUpperCase() === metric.toUpperCase()); }).columnType,
							newFilter = "'" + metric + "','" + operator + "','" + value + "','" + type + "'",
							filterValue = (data.ddkFilterValue === "NONE" ? newFilter : data.ddkFilterValue + "^" + newFilter);

						K("s_" + id + "_fiv", filterValue);

						$dialog.remove();
						DDK[name].reload(id);
					})
					.end();
			$dialog.find(".ddk-dialog-field.metric").trigger("change");
		},
		dlgTitle: "Add Filter"
	},
	editFilter: {
		dlgButtons: "_Delete OK Cancel",
		dlgClassName: "ddk-dialog-small",
		dlgContent: "<div><span class=\"ddk-dialog-label\">METRIC</span><select class=\"metric ddk-dialog-field\"></select></div>"
			+ "<div><span class=\"ddk-dialog-label\">OPERATOR</span><select class=\"operator ddk-dialog-field\"></select></div>"
			+ "<div><span class=\"ddk-dialog-label\">VALUE</span><input class=\"value ddk-dialog-field\" data-ddk-validate /></div>",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				metrics = _.map(_.pluck(data.ddkMetrics, "columnName"), function(value, index) {
					return {
						name: value.replace(/_/g, " ").toUpperCase(),
						value: value.toUpperCase()
					};
				}),
				operators = "=,NOT =,LIKE,NOT LIKE,IN,NOT IN,&gt;,&gt;=,&lt;,&lt;=".split(","),
				filter = $dialog.data().ddkFilter.split("','"),
				metric = filter[0].replace(/'/g, "").toUpperCase(),
				operator = filter[1],
				value = filter[2].replace(/'/g, ""),
				$value = $dialog.find(".ddk-dialog-field.value"),
				type = _.find(data.ddkMetrics, function(item) { return (item.columnName.toUpperCase() === metric.toUpperCase()); }).columnType;

			switch (type) {
				case "int":
					$value.data("ddkValidate", "numberInteger" + (operator.indexOf("IN") > -1 ? "List" : ""));
					break;
				case "float":
					$value.data("ddkValidate", "numberFloat" + (operator.indexOf("IN") > -1 ? "List" : ""));
					break;
				default:
					$value.data("ddkValidate", "textSafeList");
			}

			$dialog
				.find(".ddk-dialog-field.metric")
					.html(DDK.template.render.option(metrics))
					.change(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							metric = this.value,
							operator = $dialog.find(".ddk-dialog-field.operator").val(),
							$value = $dialog.find(".ddk-dialog-field.value"),
							type = _.find(data.ddkMetrics, function(item) { return (item.columnName.toUpperCase() === metric.toUpperCase()); }).columnType;

						switch (type) {
							case "int":
								$value.data("ddkValidate", "numberInteger" + (operator.indexOf("IN") > -1 ? "List" : ""));
								break;
							case "float":
								$value.data("ddkValidate", "numberFloat" + (operator.indexOf("IN") > -1 ? "List" : ""));
								break;
							default:
								$value.data("ddkValidate", "textSafeList");
						}

						$value.trigger("change");
					})
					.val(metric)
					.end()
				.find(".ddk-dialog-field.operator")
					.html(DDK.template.render.option(operators))
					.change(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							$metric = $dialog.find(".ddk-dialog-field.metric");

						setTimeout(function() {$metric.trigger("change");});
					})
					.val(operator)
					.end()
				.find(".ddk-dialog-field.value")
					.val(value)
					.end()
				.find("button[data-ddk-button=\"Delete\"]")
					.click(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							id = data.ddkControlId,
							name = data.ddkControlName,
							oldFilter = data.ddkFilter,
							filters = data.ddkFilterValue.split("^"),
							filterCount = filters.length,
							filter
							i;

						K("s_" + id + "_fiv", (_.reject(filters, function(value, index) {
							return (value === oldFilter);
						}).join("^") || "NONE"));

						$dialog.remove();
						DDK[name].reload(id);
					})
					.end()
				.find("button[data-ddk-button=\"OK\"]")
					.click(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							id = data.ddkControlId,
							name = data.ddkControlName,
							oldFilter = data.ddkFilter,
							metric = $dialog.find(".ddk-dialog-field.metric").val(),
							operator = $dialog.find(".ddk-dialog-field.operator").val(),
							value = $dialog.find(".ddk-dialog-field.value").val(),
							type = _.find(data.ddkMetrics, function(item) { return (item.columnName.toUpperCase() === metric.toUpperCase()); }).columnType,
							newFilter = "'" + metric + "','" + operator + "','" + value + "','" + type + "'",
							filters = data.ddkFilterValue.split("^"),
							filterCount = filters.length,
							filter
							i;

						K("s_" + id + "_fiv", _.map(filters, function(value, index) {
							return (value === oldFilter ? newFilter : value);
						}).join("^"));

						$dialog.remove();
						DDK[name].reload(id);
					})
					.end();
		},
		dlgTitle: "Edit Filter"
	},
	controlPreviewLink: {
		dlgClassName: "ddk-dialog-medium",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgIcon: "ui-icon-link",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				name = data.ddkControlName,
				id = data.ddkControlId,
				keywords = {};

			keywords[name + "_id"] = id;
			keywords["s_" + id + "_iw"] = K("s_" + id + "_iw") || K(name + "__" + id + "_init_widget") || $("#psc_" + name + "_" + id + "_widget").data("options");
			
			//K(name + "_id", id);
			//K("s_" + id + "_iw", K("s_" + id + "_iw") || K(name + "__" + id + "_init_widget") || $("#psc_" + name + "_" + id + "_widget").data("options"));

			keywords["component_name"] = name;
			keywords["component_id"] = id;
			
			//K({
			//	name: name,
			//	id: id
			//}, "component_");

			run("ddk_dialog_content", "PSC_WPS_Dialog_Content", keywords, null, { stateFilter: "s_" + id + "_" });
		},
		dlgTitle: "Control Link"
	},
	chooseMetrics: {
		dlgClassName: "ddk-dialog-large",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				$control = $("#psc_" + data.ddkControlName + "_" + data.ddkControlId + "_widget");

			$.extend(true, data, $control.data());
			//console.log(data)

			$dialog.find("#ddk_dialog_title").html(data.ddkChooseMetricsLabel);

			K({ id: data.ddkControlId, name: data.ddkControlName }, "component_");
			K({ id: data.ddkControlId, init_widget: data.options }, data.ddkControlName + "_");
			if (data.keywords) {
				// grab the data-keywords from the control container, and merge them
				// into any existing `s_<id>_keywords` keyword value
				var oldKeys = _.zipObject(_.map(decodeURIComponent(K("s_" + data.ddkControlId + "_keywords") || "").split("&"), function (value) {
					return value.split("=");
				}));

				var newKeys = _.string.parseQueryString(data.keywords);

				K("s_" + data.ddkControlId + "_keywords", _.reduce(_.extend({}, oldKeys, newKeys), function (memo, value, key) {
					return memo + (key ? "&" + key + "=" + (value ? encodeURIComponent(value) : "") : "");
				}, ""));
			}
			
			if (K("ddk")) {
				K("ddk.path", K("ddk").path);
				K("ddk.theme", K("ddk").theme);
			}
			run("ddk_dialog_content", "PSC_CMS_Dialog_Frame", null, null, { stateFilter: "s_" + data.ddkControlId + "_" });
		}
	},
	saveFavorite: {
		dlgButtons: "OK Cancel",
		dlgConfirm: true,
		dlgInit: function($dialog) {
			$dialog.find("button[data-ddk-button=\"OK\"]").click(DDK.updateFavoriteValue);
		},
		dlgTitle: "Save Changes"
	},
	addFavorite: {
		dlgButtons: "_Advanced_Options OK Cancel",
		//dlgClassName: "ddk-dialog-medium",
		dlgContent: "<div><span class=\"ddk-dialog-label\">NAME</span><input class=\"ddk-fav-label ddk-dialog-field\" data-ddk-validate=\"textSafe\" /></div>"
			+ "<div><span class=\"ddk-dialog-label\">DESCRIPTION</span><textarea class=\"ddk-fav-desc ddk-dialog-field\" data-ddk-validate=\"textSafe\"></textarea></div>",
		dlgIcon: "ui-icon-plusthick",
		dlgInit: function($dialog) {
			$dialog
				.find("button[data-ddk-button=\"Advanced_Options\"]")
					.click(function() {
						var $this = $(this),
							$dialog = $this.closest("div.ps-tooltip-dialog"),
							data = $dialog.data(),
							id = data.ddkControlId,
							name = data.ddkControlName,
							$content = $dialog.find(".ddk-dialog-content"),
							icons = " ps-icon-bulb-black ps-icon-bulb-gray ps-icon-bulb-green ps-icon-bulb-yellow ps-icon-bulb-red".split(" "),
							advancedContent = "",
							groups = [""].concat(K("sec.usergroups").split(",")).concat("Public"),
							isAdmin = (K("sec.usertype") === "SysAdmin");

						advancedContent += "<div class=\"ddk-dialog-spacer\"><span class=\"ddk-dialog-label\">DEFAULT</span><input type=\"checkbox\" class=\"ddk-fav-default ddk-dialog-field\" /><span class=\"ddk-dialog-note\">set as personal default</span></div>";
						if (isAdmin) {
							advancedContent += "<div class=\"ddk-dialog-separator\"><span class=\"ddk-dialog-label\">PUBLISH</span><select class=\"ddk-group ddk-dialog-field\"></select></div>";
							advancedContent += "<div><span class=\"ddk-dialog-label\">&nbsp;</span><input type=\"checkbox\" class=\"ddk-fav-group-default ddk-dialog-field\" /><span class=\"ddk-dialog-note\">set as group default</span></div>";
						}
						advancedContent += "<div class=\"ddk-fav-icon ddk-dialog-" + (isAdmin ? "spacer" : "separator") + "\"><span class=\"ddk-dialog-label\">ICON</span>" + DDK.template.render.radioIcons(icons) + "</div>";
						advancedContent += "<div><span class=\"ddk-dialog-label\">SORT ORDER</span><input class=\"ddk-fav-sort ddk-dialog-field\" data-ddk-validate=\"numberInteger\" value=\"200\"/></div>";
						advancedContent += "<div><span class=\"ddk-dialog-label\">COLOR</span><input class=\"ddk-color ddk-dialog-field\" data-target=\"ddk-colorpicker\"/></div>";
						advancedContent += "<div class=\"ps-hidden ps-tooltip-dialog ps-configure ui-state-focus ui-corner-all\" style=\"clear: both; float: right; position: fixed;\" id=\"ddk-colorpicker\"></div>";

						$(advancedContent)
							.find(".ddk-dialog-field.ddk-group")
								.html(DDK.template.render.option(groups))
								.end()
							.find("input[type=\"radio\"]")
								.first()
									.parent()
										.buttonset()
										.end()
									.end()
								.end()
							.appendTo($content);

						$this.remove();

						$dialog.position({
							my: "left top",
							at: "left bottom",
							of: data.ddkClickedButton,
							offset: "-9 3",
							collision: "fit"
						})
					})
					.end()
				.find("button[data-ddk-button=\"OK\"]")
					.click(true, DDK.writeFavoriteChanges)
					.end();
		},
		dlgTitle: "Add Favorite"
	},
	configureFavorite: {
		dlgButtons: "OK Cancel",
		//dlgClassName: "ddk-dialog-medium",
		dlgIcon: "ui-icon-gear",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				id = data.ddkControlId,
				name = data.ddkControlName,
				$content = $dialog.find(".ddk-dialog-content"),
				icons = " ps-icon-bulb-black ps-icon-bulb-gray ps-icon-bulb-green ps-icon-bulb-yellow ps-icon-bulb-red".split(" "),
				dialogContent = "",
				groups = [""].concat(K("sec.usergroups").split(",")).concat("Public"),
				isAdmin = (K("sec.usertype") === "SysAdmin"),
				isPersonal = false,
				fav;

			$.extend(true, data, data.ddkClickedButton.closest("div").data());

			$dialog.find("#ddk_secondary_dialog_subtitle").html(data.ddkFavorite.label);

			fav = data.ddkFavorite;
			if (fav.grouptitle === "Personal") {
				isPersonal = true;
			}
			//console.log(fav, fav.image);

			if (isPersonal) {
				dialogContent += "<div><span class=\"ddk-dialog-label\">NAME</span><input class=\"ddk-fav-label ddk-dialog-field\" data-ddk-validate=\"textSafe\" value=\"" + fav.label + "\"/></div>";
				dialogContent += "<div><span class=\"ddk-dialog-label\">DESCRIPTION</span><textarea class=\"ddk-fav-desc ddk-dialog-field\" data-ddk-validate=\"textSafe\">" + fav.description + "</textarea></div>";
				dialogContent += "<div class=\"ddk-dialog-spacer\"><span class=\"ddk-dialog-label\">DEFAULT</span><input type=\"checkbox\" class=\"ddk-fav-default ddk-dialog-field\" " + (fav.isPersonalDefault ? "checked" : "") + " /><span class=\"ddk-dialog-note\">set as personal default</span></div>";
				if (isAdmin) {
					dialogContent += "<div class=\"ddk-dialog-separator\"><span class=\"ddk-dialog-label\">PUBLISH</span><select class=\"ddk-group ddk-dialog-field\"></select></div>";
					dialogContent += "<div><span class=\"ddk-dialog-label\">&nbsp;</span><input type=\"checkbox\" class=\"ddk-fav-group-default ddk-dialog-field\" " + (fav.isGroupDefault ? "checked" : "") + " /><span class=\"ddk-dialog-note\">set as group default</span></div>";
				}
				dialogContent += "<div class=\"ddk-fav-icon ddk-dialog-" + (isAdmin ? "spacer" : "separator") + "\"><span class=\"ddk-dialog-label\">ICON</span>" + DDK.template.render.radioIcons(icons) + "</div>";
				dialogContent += "<div><span class=\"ddk-dialog-label\">SORT ORDER</span><input class=\"ddk-fav-sort ddk-dialog-field\" data-ddk-validate=\"numberInteger\" value=\"" + fav.sort + "\"/></div>";
				dialogContent += "<div><span class=\"ddk-dialog-label\">COLOR</span><input class=\"ddk-color ddk-dialog-field\" data-target=\"ddk-colorpicker\" value=\"" + fav.color + "\"/></div>";
				dialogContent += "<div class=\"ps-hidden ps-tooltip-dialog ps-configure ui-state-focus ui-corner-all\" style=\"clear: both; float: right; position: fixed;\" id=\"ddk-colorpicker\"></div>";
			} else {
				dialogContent += "<div class=\"ddk-dialog-spacer\"><span class=\"ddk-dialog-label\">DEFAULT</span><input type=\"checkbox\" class=\"ddk-fav-default ddk-dialog-field\" " + (fav.isPersonalDefault ? "checked" : "") + " /><span class=\"ddk-dialog-note\">set as personal default</span></div>";
				if (isAdmin) {
					dialogContent += "<div class=\"ddk-dialog-spacer\"><span class=\"ddk-dialog-label\">PUBLISH</span><input type=\"checkbox\" class=\"ddk-fav-published ddk-dialog-field\" data-group=\"" + fav.grouptitle + "\" checked /><span class=\"ddk-dialog-note\">published to group " + fav.grouptitle + "</span></div>";
					dialogContent += "<div><span class=\"ddk-dialog-label\">&nbsp;</span><input type=\"checkbox\" class=\"ddk-fav-group-default ddk-dialog-field\" " + (fav.isGroupDefault ? "checked" : "") + " /><span class=\"ddk-dialog-note\">set as group default</span></div>";
				}
			}

			$(dialogContent)
				.find(".ddk-dialog-field.ddk-group")
					.html(DDK.template.render.option(groups))
					.val(fav.grouptitle === "Personal" ? "" : fav.grouptitle)
					.end()
				.find("input[type=\"radio\"]")
					.first()
						.parent()
							.buttonset()
							.end()
						.end()
					.end()
				.appendTo($content);

			$dialog
				.position({
						my: "left top",
						at: "left bottom",
						of: data.ddkClickedButton,
						offset: "-9 3",
						collision: "fit"
					})
				.find("input[type=\"radio\"][value=\"" + fav.image + "\"]")
					.click()
					.end()
				.find("button[data-ddk-button=\"OK\"]")
					.click(DDK.writeFavoriteChanges)
					.end();
		},
		dlgSecondary: true,
		dlgTitle: "Configure Favorite"
	},
	favorites: {
		dlgClassName: "ddk-dialog-medium",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgIcon: "ui-icon-star",
		dlgInit: function($dialog) {
			var data = $dialog.data();

			K("fav_comp_id", data.ddkControlId);
			K("fav_comp_name", data.ddkControlName);
			run("ddk_dialog_content", "PSC_Favorites_Comp_Dialog_Content", null, function() {
				// console.log("favorites content loaded");
				$("#ddk_dialog_content")
					.on("click", ".ps-button-favorite", function() {
						// console.log("clicked", this);
						var $this = $(this),
							$container = $this.closest("div"),
							$dialog = $this.closest(".ps-tooltip-dialog"),
							data = $.extend(true, {}, $this.data(), $container.data(), $dialog.data());

						DDK.loadFavorite(data.ddkControlName, data.ddkControlId, data.ddkFavorite);
					})
					.find("button")
						.each(DDK.makeButton);

				$dialog.position({
						my: "left top",
						at: "left bottom",
						of: data.ddkClickedButton,
						offset: "-9 3",
						collision: "fit"
				});
			}, { stateFilter: "s_" + data.ddkControlId + "_" });
		},
		dlgTitle: "Favorites"
	},
	deleteFavorite: {
		dlgButtons: "OK Cancel",
		dlgConfirm: true,
		dlgInit: function($dialog) {
			var data = $dialog.data();

			$.extend(true, data, data.ddkClickedButton.closest("div").data());
			// console.log("Delete", data.ddkFavorite.id);
			$dialog.find("button[data-ddk-button=\"OK\"]").click(DDK.deleteFavorite);
			$dialog.find("#ddk_secondary_dialog_subtitle").html(data.ddkFavorite.label);
		},
		dlgSecondary: true,
		dlgTitle: "Confirm Delete"
	},
	chartType: {
		dlgClassName: "ddk-dialog-xsmall",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				$content = $dialog.find(".ddk-dialog-content"),
				dialogContent = DDK.template.render.chartTypesDialog(data.ddkChartType);

			$(dialogContent)
				.find("input")
					.each(DDK.makeButton)
					.end()
				.find(".ddk-buttonset")
					.buttonset()
					.end()
				.appendTo($content);

			$content.on("click", "label", data.ddkControlId, DDK.chart.setType);
		},
		dlgTitle: "Chart Type"
	},
	help: {
		dlgClassName: "ddk-dialog-large",
		dlgContent: "<div class=\"ddk-dialog-content-placeholder\"></div>",
		dlgInit: function($dialog) {
			var data = $dialog.data(),
				id = data.ddkControlId,
				name = data.ddkControlName,
				$content = $dialog.find(".ddk-dialog-content"),
				$dialogContent,
				dialogContent = "",
				controlHelpContent = (DDK[name].data[id] && DDK[name].data[id].customHelpContent) || DDK.help[name] || [],
				controlHelpImage = (DDK[name].data[id] && DDK[name].data[id].customHelpImage) || ((oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/help/" + name + ".jpg"),
				controlHelpListTag = (DDK[name].data[id] && DDK[name].data[id].customHelpListTag) || "ol",
				controlHelpFooter = DDK[name].data[id] && DDK[name].data[id].customHelpFooter,
				helpWidget = data.ddkHelpWidget || "",
				controlName = data.ddkControlName,
				controlId = data.ddkControlId,
				i;

			// disable image when customHelpImage is false
			if (DDK[name].data[id] && (DDK[name].data[id].customHelpImage === false)) { controlHelpImage = false; }

			// disable footer when customHelpFooter is false
			if (DDK[name].data[id] && (DDK[name].data[id].customHelpFooter === false)) { controlHelpFooter = false; }
			else { controlHelpFooter = controlHelpFooter || true; }

			if (!helpWidget) {
				if (controlHelpImage) { dialogContent += "<div class=\"ddk-dialog-center ddk-dialog-spacer\"><img src=\"" + controlHelpImage + "\" /></div>"; }
				dialogContent += "<div><" + controlHelpListTag + ">";

				for (i = 0; i < controlHelpContent.length; i += 1) {
					dialogContent += "<li><strong>";
					dialogContent += controlHelpContent[i].name;
					dialogContent += " &#150;</strong> ";
					dialogContent += controlHelpContent[i].description;
				}

				dialogContent += "</" + controlHelpListTag + "></div>";

				if (controlHelpFooter === true) {
					dialogContent += "<div class=\"ddk-dialog-indent ddk-dialog-separator\">For more information on these options, including instructions on how to use them, please refer to the <a href=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/docs/PureShare%20Dashboard%20Controls.pdf\">PureShare Dashboard Controls</a> <span style=\"font-size: 80%;\">(pdf)</span> document.</div>";
					dialogContent += "<div class=\"ddk-dialog-indent ddk-dialog-spacer ddk-dialog-note\"><em>Please note that these options may not be available in all " + name + " controls.</em></div>";
				} else if (controlHelpFooter) {
					dialogContent += "<div class=\"ddk-dialog-indent ddk-dialog-separator\">" + controlHelpFooter + "</div>";
				}
				dialogContent += "<div class=\"ddk-dialog-spacer\"></div>";

				$dialogContent = $(dialogContent).replaceAll($content.children());
			}

			$dialog.position({
				my: "left top",
				at: "left bottom",
				of: data.ddkClickedButton,
				offset: "-9 3",
				collision: "fit"
			});

			if (helpWidget) {
				run("ddk_dialog_content", helpWidget, null, function() {
					callback = DDK[controlName].data && DDK[controlName].data[controlId] && DDK[controlName].data[controlId].customHelpCallback;
					if (typeof callback === "function") {
						callback.call(window, $dialog);
					}
				}, { stateFilter: "s_" + controlId + "_" });
			}
		},
		dlgTitle: "Help"
	}
});

DDK.dialogs = {
	edit: function (settings) {
		var $dialog = $("<div><textarea></textarea></div>"),
			editor;
		
		settings = _.extend({
			title: "",
			value: "",
			dataType: "",
			save: function () {},
			$target: null
		}, settings);
		
		return $dialog.dialog({
			autoOpen: false,
			dialogClass: "ddk-dialog-edit",
			title: settings.title,
			width: 650,
			height: 400,
			buttons: [
				{ 
					text: "OK",
					click: function (e) {
						var value = $dialog.find("textarea").val(),
							parsedValue,
							saveValue,
							dataType = settings.dataType;
						
						switch (dataType) {
							case "json":
								parsedValue = _.string.parseJSON(value);
								
								if (!_.isPlainObject(parsedValue)) {
									$.jGrowl("Invalid JSON");
									return;
								}
								
								saveValue = JSON.stringify(parsedValue);
								break;
								
							default:
								saveValue = value;
						}
							
						settings.save(saveValue);
						$dialog.dialog("close");	
					}
				},
				{ text: "Cancel", click: function (e) { $dialog.dialog("close"); } }
			],
			open: function (e) {
				var value = _.string.parseJSON(DDK.unescape.brackets(settings.value.toString())),
					widgets = [],
					waiting,
					JSHINT = window.JSHINT || null,
					updateHints = function () {
						editor.operation(function () {
							for (var i = 0; i < widgets.length; ++i) {
								editor.removeLineWidget(widgets[i]);
							}
							
							widgets.length = 0;

							JSHINT(editor.getValue());
							
							// only display the first error
							for (var i = 0; i < 1 /* JSHINT.errors.length */; ++i) {
								var err = JSHINT.errors[i];
								if (!err) continue;
								var msg = document.createElement("div");
								var icon = msg.appendChild(document.createElement("span"));
								icon.innerHTML = "!!";
								icon.className = "lint-error-icon";
								msg.appendChild(document.createTextNode(err.reason));
								msg.className = "lint-error";
								widgets.push(editor.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
							}
						});
						var info = editor.getScrollInfo();
						var after = editor.charCoords({line: editor.getCursor().line + 1, ch: 0}, "local").top;
						if (info.top + info.clientHeight < after)
						editor.scrollTo(null, after - info.clientHeight + 3);
					};		
							
				
				$dialog.find("textarea").val(_.isPlainObject(value) ? JSON.stringify(value, null, 4) : value);
				$dialog.dialog("option", "position", {
					my: "right top",
					at: "right bottom",
					of: settings.$target
				});
				
				settings.$target.closest("[data-column-config]").addClass("ddk-edit-active");
				editor = CodeMirror.fromTextArea($dialog.find("textarea")[0], { indentUnit: 4, mode: { name: "javascript", json: true }, indentWithTabs: true, lineNumbers: true });
				editor.on("blur", function(){
					editor.save()
				});
				
				if (JSHINT) {
					editor.on("change", function() {
						clearTimeout(waiting);
						waiting = setTimeout(updateHints, 500);
					});

					setTimeout(updateHints, 100);
				}
			},
			close: function (e) {
				$dialog.dialog("destroy");
				settings.$target.closest("[data-column-config]").removeClass("ddk-edit-active");
			},
			resizeStop: function (e) {
				editor.refresh();
			}
		});
	}
};