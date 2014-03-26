// Wrapped the entire Scorecard control config dialog code
// in a check for Backbone.Epoxy
// because version 1.4.0 of the Metrics Catalog
// overwrites Backbone to version 0.9.2
// and blows away Backbone.Epoxy
if (Backbone.Epoxy) {
	// PS.Collections.Scorecard2
	PS.extend("Collections.Scorecard2"); 

	PS.Collections.Scorecard2.ConfigColumns = Backbone.Collection.extend({
		model: PS.MC.Models.OptionGroup,
		comparator: "ordinal"
	});


	// PS.Views.Scorecard2
	PS.extend("Views.Scorecard2"); 

	PS.Views.Scorecard2.Option = Backbone.Epoxy.View.extend({
		initialize: function () {
			if (!this.options || !this.options.template) {
				this.template = PS.templateCache[_.string.camelize("option_" + (this.model.get("displayType") || "text") + (this.options.hideLabel ? "_nolabel" : ""))];
			} else if (!this.options.noTemplate) {
				switch (typeof this.options.template) {
					case "string":
						this.template = PS.templateCache[_.string.camelize(this.options.template)];
						break;
					case "function":
						this.template = this.options.template;
						break;
				}
			}
		},
		
		render: function () {
			(this.options && this.options.noTemplate) || this.$el.html(this.template(_.extend({}, _.string, this.model.toJSON())));
	
			if (this.model.get("displayType") === "radio" && this.options.template && this.options.template.indexOf("radio") > -1 && this.model.get("values").length) {
				this.$el.find(".option-radio").append(_.reduce(this.model.get("values"), function (accumulator, value, index) {
					return accumulator + PS.templateCache.radio(_.extend({}, _.string, value, { index: index, optionId: this.model.id }));
				}, "", this));
			}

			this.applyBindings();
			
			return this;
		}
	});

	PS.Views.Scorecard2.Toolbar = Backbone.View.extend({
		tagName: "div",

		events: {
			"showadvancedoptions": "showAdvancedOptions"
		},
		
		initialize: function () {
			if (this.options && this.options.template) {
				this.template = PS.templateCache[_.string.camelize(this.options.template)];
			}
			this.optionViews = {};

			this.$el.on("click", "[data-action]", function (e) {
				this.$el.trigger($(e.currentTarget).data("action"));
			}.bind(this));
		},

		renderOption: function (optionId, index) {
			var optionView;
			
			optionView = this.optionViews[optionId] = new PS.Views.Scorecard2.Option({
				model: this.model.getOption(optionId)
			});
			
			optionView.model.app = this.app;
			
			this.$el.append(optionView.render().$el);
		},

		renderAdvancedOption: function (optionId, index) {
			var optionView;
			
			optionView = this.optionViews[optionId] = new PS.Views.Scorecard2.Option({
				model: this.model.getOption(optionId)
			});
			
			this.$advancedOptions.append(optionView.render().$el);
		},

		render: function () {
			DDK.log("PS.Views.Scorecard2.Toolbar.render()");
			
			var buttons, $buttons;
			
			// apply template and bindings
			if (this.template) {
				this.$el.html(this.template(_.extend({}, _.string, this.model.toJSON())));
			}
			
			// render option views
			if (this.options.optionId) {
				_.each([].concat(this.options.optionId), this.renderOption, this);
			}
			
			// render advanced option views
			if (this.options.advancedOptionId) {
				this.$showAdvancedOptions = $("<button data-action=\"showadvancedoptions\">Show Advanced Options</buton>").appendTo(this.$el);
				this.$advancedOptions = $("<div class=\"toolbar-advanced-options\"></div>").appendTo(this.$el);
				_.each([].concat(this.options.advancedOptionId), this.renderAdvancedOption, this);
			}
			
			// render buttons
			if (this.options.buttons) {
				buttons = this.options.buttons;
				
				this.buttonTarget = buttons.target = this.model.getOption(buttons.optionId);
				buttons.value = buttons.target.get("value");
				buttons.values = (buttons.value ? buttons.value.split(" ") : []);
				buttons.groups = PS.Toolbar.getOptionGroup(buttons.toolbarId).collections.optionGroups;
				
				this.buttonTarget.on("change:value", function (model, value) {
					this.updateButtons(value);
				}.bind(this));

				this.$buttons = $buttons = $("<div>" + buttons.groups.reduce(function (accumulator, buttonGroup) {
					var buttonOptions = buttonGroup.collections.options;
					
					var values = buttonOptions.reduce(function (accumulator, buttonOption) {
						var value = buttonOption.get("value");
						if (value) {
							accumulator.push({
								id: buttonOption.id,
								value: value,
								text: buttonOption.get("text"),
								icon: buttonOption.get("icon")
							});
						}
						return accumulator;
					}, []);

					return accumulator + 
						"<span data-label=\"" + buttonGroup.get("label") + "\">" +
							"<button class=\"sc-toolbar-button\" data-toolbar=\"" + buttonGroup.id + "\" data-text=\"" + (buttonGroup.get("text") || "") + "\" data-icon=\"" + (buttonGroup.get("icon") || "") + "\" data-values=\"" + _.escape(JSON.stringify(values)) + "\">" +
							(buttonGroup.get("icon") ? 
							
							"<span class=\"ddk-icon\">" + 
								buttonGroup.get("icon") + 
							"</span>"
							
							:
							
							"<span>" + 
								buttonGroup.get("text") + 
							"</span>"
							
							) +
							"</button>" +
							"<div class=\"" + buttonGroup.id + " toolbar-content ps-hidden\">" +
							buttonOptions.reduce(function (accumulator, buttonOption) {
								return accumulator + 
									"<span data-label=\"" + buttonOption.get("label") + "\">" +
										"<button value=\"" + buttonOption.get("value") + "\" data-values=\"" + _.escape(JSON.stringify(_.pluck(values, "value"))) + "\">" + 
									(buttonOption.get("icon") ? 
									
									"<span class=\"ddk-icon\">" + 
										buttonOption.get("icon") + 
									"</span>"
									
									:
									
									"<span>" + 
										buttonOption.get("text") + 
									"</span>"
									
									) +										"</button>" +
									"</span>";
							}, "") +
							"</div>" +
						"</span>";
				}, "") + "</div>").appendTo(this.$el);

				// bind toolbar button events
				$buttons.find("button[value][data-values]").on("click", function (e) {
					var $target = $(e.currentTarget),
						data = $target.data(),
						value = e.currentTarget.value,
						values = data.values,
						option = buttons.target,
						optionValue = option.get("value"),
						optionValues = (typeof optionValue === "string" ? optionValue.split(" ") : []);
					
					option.set("value", _.compact([value].concat(_.difference(optionValues, values))).join(" "));
				});
				
				// save reference to top-level toolbar buttons
				this.$topButtons = $buttons.find("button[data-text][data-values]");
				
				this.updateButtons(buttons.value);
			}
			
			return this;
		},
		
		updateButtons: function (optionValues) {
			this.$topButtons.each(function (index, elem) {
				var $elem = $(elem),
					data = $elem.data(),
					text = data.text,
					icon = data.icon,
					values = data.values,
					match;
					
				if (typeof optionValues === "string") {
					_.each(optionValues.split(" "), function (optionValue) {
						match = _.find(values, { value: optionValue });
						if (match) {
							return false;
						}
					});
				}
				
				if (match) {
					if (match.icon) {
						$elem.html("<span class='ddk-icon'>" + match.icon + "</span>");
						return;					
					}
					
					if (match.text) {
						$elem.html("<span>" + match.text + "</span>");
						return;	
					}
				}
				
				if (icon) {
					$elem.html("<span class='ddk-icon'>" + icon + "</span>");
					return;	
				}
				
				if (text) {
					$elem.html("<span>" + text + "</span>");
					return;	
				}
				
				$elem.html("<span>NONE</span>");
			});
		},
		
		showAdvancedOptions: function (e) {
			var $el = $(e.currentTarget);

			$el.find("[data-action=\"showadvancedoptions\"]").remove();
			$el.find(".toolbar-advanced-options").show();
			$(".qtip:visible").qtip("reposition", null, false);
		}
	});

	PS.Views.Scorecard2.ColumnListItem = Backbone.View.extend({
		tagName: "li",
		
		attributes: function () {
			return {
				"data-cid": this.model.cid
			};
		},
		
		events: {
			"removeself": "removeSelf",
			"columndialog": "columnDialog"
		},
			
		initialize: function () {
			DDK.log("PS.Views.Scorecard2.ColumnListItem.initialize()");

			this.template = PS.templateCache.sc2ColumnListItem;
			
			this.optionViews = {};
			
			this.$el.on("click", "[data-action]", function (e) {
				this.$el.trigger($(e.currentTarget).data("action"));
			}.bind(this));
			
		},
		
		render: function () {
			DDK.log("PS.Views.Scorecard2.ColumnListItem.render()");

			var self = this;

			var data = this.parent.$el.data("control");
			
			this.prefixSettings = function () {
				return {
					alignSearch: true,
					data: data.prefixes,
					initSelection: function (elem, callback) {
						var val = elem.val().toUpperCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching prefix based on the existing value
							// if no match, create a selection from the existing value
							// if no existing value, create an empty selection
							match = _.find(select2Data, { id: val }) || val && { id: val, text: _.string.titleize(val) } || { id: "", text: "" };
	
						callback(match);							
					}
				};
			};

			this.suffixSettings = function (prefix) {
				var prefixMatch = _.find(data.prefixes, { id: prefix }),
					$suffix = this.$suffix;
				return {
					alignSearch: true,
					allowClear: true,
					placeholder: "",
					data: (prefixMatch ? prefixMatch.suffixes : data.prefixes[0].suffixes),
					initSelection: function (elem, callback) {
						var val = elem.val().toUpperCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching suffix for this prefix based on the existing value
							// ** only for initialization ** create a selection from the existing value
							// if no existing value, find the default suffix for this prefix
							// if no default suffix, create an empty selection
							match = _.find(select2Data, { id: val }) || val && !this.isInitialized && { id: val, text: val } || _.find(select2Data, { id: prefixMatch.defaultSuffix }) || { id: "", text: "" };

						callback(match);
					}.bind(this),
					createSearchChoice: function (term) {
						// can't access the elem directly here because it's not
						// passed as an argument to the creatSearchChoice function
						var select2Settings = $suffix.data("select2").opts,
							select2Data = select2Settings.data,
							// check for a match in the id property by using the UpperCased term
							// check for a match in the text property by using the Titleized term
							match = _.find(select2Data, { id: term.toUpperCase() }) || _.find(select2Data, { text: _.string.titleize(term) }); 
							
						return match || { id: term, text: _.escape(term) };
					}
				};
			}.bind(this);
			
			this.formatSettings = function () {
				return {
					alignSearch: true,
					data: PS.Formatter.formats,
					initSelection: function (elem, callback) {
						var val = elem.val().toLowerCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching format based on the existing value
							// ** only for initialization ** create a selection from the existing value
							// if no existing value, create an empty selection
							match = _.find(select2Data, { id: val }) || val && { id: val, text: val } || { id: "", text: "" };
	
						callback(match);	
					},
					dropdownCss: function () {
						return {
							"z-index": $.topZ()
						};
					}
				};
			};

			this.formatStyleSettings = function (format) {
					// find the matching format
					// or take the first one
				var formatObject = _.find(PS.Formatter.formats, { id: format }) || PS.Formatter.formats[0] || {},
					defaultformatStyleObject;
				
				if (!formatObject.styles.length) {
					return;
				}

				// find the matching format style object within this format
				// or take the first one
				defaultformatStyleObject = _.find(formatObject.styles, { id: this.$formatStyle.val().toLowerCase() }) || formatObject.styles[0];

				return {
					alignSearch: true,
					allowClear: true,
					placeholder: "",
					data: formatObject.styles,
					initSelection: function (elem, callback) {
						var val = elem.val().toLowerCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching format based on the existing value
							// if no match, create a selection from the existing value
							// if no existing value, create an empty selection
							match = _.find(select2Data, { id: val }) || defaultformatStyleObject;

						callback(match);	
					},
					dropdownCss: function () {
						return {
							"z-index": $.topZ()
						};
					}
				};
			}.bind(this);
			
			this.prefixChange = function (e) {
				var prefixMatch = _.find(data.prefixes, { id: e.val || this.$prefix.val().toUpperCase() }) || data.prefixes[0],
					suffixes = prefixMatch.suffixes,
					suffixMatch = _.find(suffixes, { id: this.$suffix.val().toUpperCase() }) || _.find(suffixes, { id: prefixMatch.defaultSuffix });
				
				this.$suffix.select2("destroy");
				
				if (this.isInitialized) {
					this.$suffix.val(suffixMatch.id);				
				}
				this.$suffix.select2(this.suffixSettings(e.val || this.$prefix.val().toUpperCase()));
				this.$suffix.trigger("change");
			};
			
			this.suffixChange = function (e) {
					// find the matching prefix object
					// or take the first one
				var prefixObject = _.find(data.prefixes, { id: this.$prefix.val().toUpperCase() }) || data.prefixes[0] || {},
					// find the matching suffix object within this prefix
					// or take the default suffix object
					// or take the first one
					suffixObject = _.find(prefixObject.suffixes, { id: this.$suffix.val().toUpperCase() }) || _.find(prefixObject, { id: prefixObject.defaultSuffix }) || prefixObject.suffixes[0] || {},
					formatValue = !this.isInitialized && this.$format.val().toLowerCase();
				
				// set format value 
				// to the existing value if not yet initailized
				// or to mapping from suffix type
				// or the default format
				this.$format.select2("val", formatValue || PS.Formatter.typeMap[suffixObject.type] || PS.Formatter.defaultFormat);
				this.$format.trigger("change");
			};
			
			this.formatChange = function (e) {
				var settings = this.formatStyleSettings(e.val || this.$format.val().toLowerCase());
				
				this.$formatStyle.select2("destroy");
				
				if (settings) {
					this.$formatStyle.parent().show();

					// recreate formatStyle select2
					this.$formatStyle.select2(settings);
					this.$formatStyle.trigger("change");
				} else {
					this.$formatStyle.parent().hide();
					this.$formatStyle.val("");
				}
			};

			// apply template and bindings
			this.$el.html(this.template(_.extend({}, _.string, this.model.toJSON())));

			// render option views
			this.columnConfig = this.model; //this.model.getOptionGroup("scorecard_column_config_object_settings");
			this.columnConfig.each(function (optionModel) {
				var optionView = new PS.Views.Scorecard2.Option({
					model: optionModel,
					tagName: "input", 
					className: function () {
						return _.string.classify(this.model.id) + " sizing"
					},
					attributes: function () {
						return {
							"type": "text",
							"data-bind": "value:value"
						};
					},
					noTemplate: true
				});
				this.optionViews[optionModel.id] = optionView;
				this.$el.append(optionView.render().$el);
			}, { id: ["prefix", "body_content_value"], includeEmpty: true }, this);


			// render column settings toolbar
			toolbarName = "column_settings";
			
			var toolbarView = new PS.Views.Scorecard2.Toolbar({
				model: this.columnConfig,
				className: function () {
					return _.string.classify(toolbarName) + " toolbar-content";
				},
				optionId: [
					"body_content_format",
					"body_content_style"
				],
				advancedOptionId: [
					"attr",
					"class_name"
				],
				buttons: {
					toolbarId: toolbarName,
					optionId: "class_name"
				}
			});

			this.optionViews[toolbarName] = toolbarView;
			this.$el.append(toolbarView.render().$el);
			

			// initialize Select2 dropdowns
			this.$prefix = this.$el.find(".prefix");
			this.$suffix = this.$el.find(".body-content-value");
			this.$format = this.$el.find(".body-content-format");
			this.$formatStyle = this.$el.find(".body-content-style");
			
			// prefix change event rebuilds the suffix select2
			// format change event rebuilds the formatStyle select2
			this.$format.select2(this.formatSettings());
			this.$prefix.select2(this.prefixSettings());
			
			this.$prefix.on("change", this.prefixChange.bind(this));
			this.$suffix.on("change", this.suffixChange.bind(this));
			this.$format.on("change", this.formatChange.bind(this));		
			
			this.isInitialized = false;
			this.$prefix.trigger("change");
			this.isInitialized = true;

			
			
			// if there is no format value
			// set an initial format value based on the prefix and suffix values
			//if (!this.$format.val()) { this.$suffix.trigger("change"); }

			// trigger an initial formatStyle render
			//this.$format.trigger("change");

			return this;
		},

		removeSelf: function (e) {
			DDK.log("PS.Views.Scorecard2.ColumnListItem.removeSelf()");
			this.$el.remove();
			this.parent.$el.trigger("removecolumn", { model: this.model });
		},
		
		columnDialog: function (e) {
			DDK.log("PS.Views.Scorecard2.ColumnListItem.columnDialog()");
			
			$(".qtip:visible").qtip("hide");		
			
			var columnDialog = new PS.Views.Scorecard2.ColumnDialog({ model: this.model, app: this });
			columnDialog.app = this;
			columnDialog.parent = this;
			
			columnDialog.render().$el.appendTo(this.parent.$el);
			this.app.$el.parent().addClass("sc-column-editor");
			this.app.resize();
		}
	});
	
	PS.Views.Scorecard2.ColumnDialog = Backbone.View.extend({
		events: {
			"closecolumndialog": "closeColumnDialog"
		},
		
		tagName: "div",
		
		className: "sc-column-dialog",
		
		initialize: function () {
			DDK.log("PS.Views.Scorecard2.ColumnDialog.initialize()");

			this.template = PS.templateCache.sc2ColumnDialog;
			
			this.optionViews = {};
			
			this.rowViews = {};
			
			this.app = this.options.app;

			this.$el.on("click", "[data-action]", function (e) {
				this.$el.trigger($(e.currentTarget).data("action"));
			}.bind(this));
		},
		
		render: function () {
			DDK.log("PS.Views.Scorecard2.ColumnDialog.render()");

			var sections = "header content footer".split(" "),
				rows = (this.app.model.val("is_grouped") ? "header group body footer" : "header body footer").split(" ");
				
			var data = this.app.app.$el.data("control");
			
			this.prefixSettings = function () {
				return {
					alignSearch: true,
					data: data.prefixes,
					initSelection: function (elem, callback) {
						var val = elem.val().toUpperCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching prefix based on the existing value
							// if no match, create a selection from the existing value
							// if no existing value, create an empty selection
							match = _.find(select2Data, { id: val }) || val && { id: val, text: _.string.titleize(val) } || { id: "", text: "" };
	
						callback(match);							
					}
				};
			};

			this.suffixSettings = function (prefix) {
				var prefixMatch = _.find(data.prefixes, { id: prefix }),
					$suffix = this.$suffix;
				return {
					alignSearch: true,
					allowClear: true,
					placeholder: "",
					data: (prefixMatch ? prefixMatch.suffixes : data.prefixes[0].suffixes),
					initSelection: function (elem, callback) {
						var val = elem.val().toUpperCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching suffix for this prefix based on the existing value
							// ** only for initialization ** create a selection from the existing value
							// if no existing value, find the default suffix for this prefix
							// if no default suffix, create an empty selection
							match = _.find(select2Data, { id: val }) || val && !this.isInitialized && { id: val, text: val } || _.find(select2Data, { id: prefixMatch.defaultSuffix }) || { id: "", text: "" };

						callback(match);
					}.bind(this),
					createSearchChoice: function (term) {
						// can't access the elem directly here because it's not
						// passed as an argument to the creatSearchChoice function
						var select2Settings = $suffix.data("select2").opts,
							select2Data = select2Settings.data,
							// check for a match in the id property by using the UpperCased term
							// check for a match in the text property by using the Titleized term
							match = _.find(select2Data, { id: term.toUpperCase() }) || _.find(select2Data, { text: _.string.titleize(term) }); 
							
						return match || { id: term, text: _.escape(term) };
					}
				};
			}.bind(this);
			
			this.formatSettings = function () {
				return {
					alignSearch: true,
					data: PS.Formatter.formats,
					initSelection: function (elem, callback) {
						var val = elem.val().toLowerCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching format based on the existing value
							// ** only for initialization ** create a selection from the existing value
							// if no existing value, create an empty selection
							match = _.find(select2Data, { id: val }) || (val && !this.isInitialized && { id: val, text: val }) || { id: "", text: "" };
	
						callback(match);	
					},
					dropdownCss: function () {
						return {
							"z-index": $.topZ()
						};
					}
				};
			};

			this.formatStyleSettings = function (format) {
					// find the matching format
					// or take the first one
				var formatObject = _.find(PS.Formatter.formats, { id: format }) || PS.Formatter.formats[0] || {},
					defaultformatStyleObject;
				
				if (!formatObject.styles.length) {
					return;
				}

				// find the matching format style object within this format
				// or take the first one
				defaultformatStyleObject = _.find(formatObject.styles, { id: this.$formatStyle.val().toLowerCase() }) || formatObject.styles[0];

				return {
					alignSearch: true,
					allowClear: true,
					placeholder: "",
					data: formatObject.styles,
					initSelection: function (elem, callback) {
						var val = elem.val().toLowerCase(),
							select2Settings = elem.data("select2").opts,
							select2Data = select2Settings.data,
							// look for a matching format based on the existing value
							// if no match, create a selection from the existing value
							// if no existing value, create an empty selection
							match = _.find(select2Data, { id: val }) || defaultformatStyleObject;

						callback(match);	
					},
					dropdownCss: function () {
						return {
							"z-index": $.topZ()
						};
					}
				};
			}.bind(this);
			
			this.prefixChange = function (e) {
				var prefixMatch = _.find(data.prefixes, { id: e.val || this.$prefix.val().toUpperCase() }) || data.prefixes[0],
					suffixes = prefixMatch.suffixes,
					suffixMatch = _.find(suffixes, { id: this.$suffix.val().toUpperCase() }) || _.find(suffixes, { id: prefixMatch.defaultSuffix });
				
				this.$suffix.select2("destroy");
				
				if (this.isInitialized) {
					this.$suffix.val(suffixMatch.id);				
				}
				this.$suffix.select2(this.suffixSettings(e.val || this.$prefix.val().toUpperCase()));
				this.$suffix.trigger("change");
			};
			
			this.suffixChange = function (e) {
				var $target = $(e.currentTarget),
					$format = $target.data("$format"),
					// find the matching prefix object
					// or take the first one
					prefixObject = _.find(data.prefixes, { id: this.$prefix.val().toUpperCase() }) || data.prefixes[0] || {},
					targetVal = $target.val(),
					// find the matching suffix object within this prefix
					// or take the default suffix object
					// or take the first one
					suffixObject = _.find(prefixObject.suffixes, { id: targetVal.toUpperCase() }) || _.find(prefixObject, { id: prefixObject.defaultSuffix }) || prefixObject.suffixes[0] || {},
					formatValue;
				
				if (!this.isInitialized) {
					formatValue = $format.val().toLowerCase();
				} else if (targetVal) {
					formatValue = PS.Formatter.typeMap[suffixObject.type] || PS.Formatter.defaultFormat;
				} else {
					formatValue = "";
				}
				
				// set format value 
				// to the existing value if not yet initailized
				// or to mapping from suffix type
				// or the default format
				$format
					.select2("val", formatValue)
					.trigger("change");
			};
			
			this.formatChange = function (e) {
				var $target = $(e.currentTarget),
					settings = this.formatStyleSettings(e.val || $target.val().toLowerCase() || ""),
					$formatStyle = $target.parent().next().find("input.style");
				
				$formatStyle.select2("destroy");
				
				if (settings) {
					$formatStyle.parent().show();

					// recreate formatStyle select2
					$formatStyle.select2(settings);
					$formatStyle.trigger("change");
				} else {
					$formatStyle.parent().hide();
					$formatStyle.val("");
				}
			};
				
			
			this.$el.html(this.template());
			this.$content = this.$el.find(".sc-column-dialog-content");
			
			// render prefix option view
			this.renderContent("prefix", ["prefix"]);
	
			// render row views
			_.each(rows, function (rowType) {
				var rowView;
				
				rowView = this.rowViews[rowType] = new PS.Views.Scorecard2.ColumnDialogRow({
					model: this.model,
					type: rowType
				});

				rowView.app = this.app;
				rowView.parent = this;
			
				this.$content.append(rowView.render().$el);
			}, this);

			// initialize Select2 dropdowns
			this.$prefix = this.$el.find("input.prefix");
			this.$suffix = this.$el.find("input.suffix");
			this.$format = this.$el.find("input.format");
			this.$formatStyle = this.$el.find("input.style");
			
			// prefix change event rebuilds the suffix select2
			// format change event rebuilds the formatStyle select2
			this.$format.select2(this.formatSettings());
			this.$prefix.select2(this.prefixSettings());

			// link suffixes with formats
			this.$suffix.each(function (index, elem) {
				var $elem = $(elem);
				$elem.data("$format", $elem.closest(".sc-column-dialog-option").find("input.format"));
			});
			
			this.$prefix.on("change", this.prefixChange.bind(this));
			this.$suffix.on("change", this.suffixChange.bind(this));
			this.$format.on("change", this.formatChange.bind(this));		
			
			this.isInitialized = false;
			this.$prefix.trigger("change");
			this.isInitialized = true;
			
/*
			// initialize Select2 dropdowns
			this.$prefix = this.$el.find("input.prefix");
			this.$suffix = this.$el.find("input.suffix");
			this.$format = this.$el.find("input.format");
			this.$formatStyle = this.$el.find("input.style");
			
			// prefix change event rebuilds the suffix select2
			// format change event rebuilds the formatStyle select2
			this.$format.select2(this.formatSettings());
			this.$prefix.select2(this.prefixSettings());
			
			// link suffixes with formats
			this.$suffix.each(function (index, elem) {
				var $elem = $(elem);
				$elem.data("$format", $elem.closest(".sc-column-dialog-option").find("input.format"));
			});
			
			this.$prefix.on("change", this.prefixChange.bind(this));
			this.$prefix.trigger("change");

			// bind these change events after the prefix change is triggered
			// to avoid overwriting an existing bodyContentFormat
			this.$suffix.on("change", this.suffixChange.bind(this));
			this.$format.on("change", this.formatChange.bind(this));
			this.$format.trigger("change");
*/			
			return this;
		},
		
		renderContent: function (id, options) {
			this.$contentTarget = $("<div class=\"sc-column-" + id + "\"></div>");
			this.model.each(this.renderOption, { id: options, includeEmpty: true }, this);

			this.$contentTarget.appendTo(this.$content);
		},
		
		renderOption: function (optionModel) {
			var optionView;
			
			optionView = this.optionViews[optionModel.id] = new PS.Views.Scorecard2.Option({
				model: optionModel,
				className: "sc-column-dialog-option ui-helper-clearfix",
				template: (optionModel.id === "header_style" ? "option_radio_labeled_aligned" : "option_labeled_aligned")
			});
			
			optionModel.app = this.app;

			// render column-global-settings toolbar
			var toolbarName = "column_settings";
			var toolbarSettings = {
				model: this.model,
				className: function () {
					return _.string.classify(toolbarName) + " toolbar-content";
				},
				advancedOptionId: [
					"attr",
					"class_name"
				],
				buttons: {
					toolbarId: toolbarName,
					optionId: "class_name"
				}
			};
			
			var toolbarView = new PS.Views.Scorecard2.Toolbar(toolbarSettings);

			this.optionViews[toolbarName] = toolbarView;
			this.$contentTarget.append(optionView.render().$el);
			optionView.$el.append("<button class=\"right column-settings\" title=\"Column Format\" data-toolbar=\"column-settings\"><span class=\"ddk-icon\">&#398;</span></button>");
			optionView.$el.append(toolbarView.render().$el)
		},
		
		closeColumnDialog: function (e) {
			$(".qtip:visible").qtip("hide");
			this.remove();
			this.parent.app.$el.parent().removeClass("sc-column-editor");
			this.parent.app.renderEditor();
		}

	});
	
	PS.Views.Scorecard2.ColumnDialogRow = Backbone.View.extend({
		tagName: "div",
		
		className: function () {
			return "sc-column-row sc-column-row-" + this.options.type
		},
		
		initialize: function () {
			DDK.log("PS.Views.Scorecard2.ColumnDialogRow.initialize()");

			this.template = PS.templateCache.sc2ColumnDialogRow;
			
			this.optionViews = {};
			
			this.sectionViews = {};

			this.$el.on("click", "[data-action]", function (e) {
				this.$el.trigger($(e.currentTarget).data("action"));
			}.bind(this));
			
			this.on("ps.option.change", function (changed) {
				DDK.log("ps.option.change (ColumnDialogRow)", changed);
				
				if (changed.id === "header_style" && changed.value) {
					if (changed.value === "custom") {
						this.$el.find(".sc-column-dialog-row-content-basic").hide();
						this.$el.find(".sc-column-dialog-row-content").show();
						
						// DISABLED BEHAVIOR - if moving to "custom", copy any title and subtitle values onto header content and footer
						/*
						if (this.model.val("title")) {
							this.model.val("header_content_value", this.model.val("title"));
						}
						if (this.model.val("subtitle")) {
							this.model.val("header_footer_value", this.model.val("subtitle"));					
						}
						*/
						this.model.clear({ id: ["title", "subtitle"] });

					} else if (changed.value === "basic") {
						this.$el.find(".sc-column-dialog-row-content-basic").show();
						this.$el.find(".sc-column-dialog-row-content").hide();

						// DISABLED BEHAVIOR -  if moving to "basic", copy any header content and footer values onto title and subtitle
						/*
						if (this.model.val("header_content_value")) {
							this.model.val("title", this.model.val("header_content_value"));
						}
						if (this.model.val("header_footer_value")) {
							this.model.val("subtitle", this.model.val("header_footer_value"));					
						}
						*/
						this.model.clear({ id: ["header_header_value", "header_content_value", "header_footer_value"] });
						this.$el.find(".sc-column-dialog-row-content").find("input.suffix").trigger("change");
					}
				}
			}.bind(this));
		},
		
		render: function () {
			DDK.log("PS.Views.Scorecard2.ColumnDialogRow.render()");
			
			var sections = "header content footer".split(" ");
			
			this.$el.html(this.template(_.extend({}, _.string, { type: this.options.type })));
			this.$content = this.$el.find(".sc-column-dialog-row-content");

			// render cell-settings toolbar
			var toolbarName = "column_settings";
			var toolbarSettings = {
				model: this.model,
				className: function () {
					return _.string.classify(toolbarName) + " toolbar-content";
				},
				advancedOptionId: [
					this.options.type + "_attr",
					this.options.type + "_class_name"
				],
				buttons: {
					toolbarId: toolbarName,
					optionId: this.options.type + "_class_name"
				}
			};
			
			var toolbarView = new PS.Views.Scorecard2.Toolbar(toolbarSettings);

			this.optionViews[toolbarName] = toolbarView;
			this.$el.find(".sc-column-dialog-row-header").append(toolbarView.render().$el);


			if (this.options.type === "header") {
				this.$settings = this.$el.find(".sc-column-dialog-row-settings");
				this.$basicContent = this.$el.find(".sc-column-dialog-row-content-basic");

				// render header_style option view
				this.renderOption(this.model.getOption("header_style"), this.$settings);

				// render title and subtitle option views
				this.renderOption(this.model.getOption("title"), this.$basicContent);
				this.renderOption(this.model.getOption("subtitle"), this.$basicContent);
				
				// set header mode state
				if (this.model.val("header_style") === "custom") {
					this.$el.find(".sc-column-dialog-row-content-basic").hide();
					this.$el.find(".sc-column-dialog-row-content").show();

					// if moving to "custom", copy any title and subtitle values onto header content and footer
					if (this.model.val("title")) {
						this.model.val("header_content_value", this.model.val("title"));
					}
					if (this.model.val("subtitle")) {
						this.model.val("header_footer_value", this.model.val("subtitle"));					
					}
					this.model.clear({ id: ["title", "subtitle"] });
				} else {
					// header_style === "basic"
					this.$el.find(".sc-column-dialog-row-content-basic").show();
					this.$el.find(".sc-column-dialog-row-content").hide();
					
					// if moving to "basic", copy any header content and footer values onto title and subtitle
					if (this.model.val("header_content_value")) {
						this.model.val("title", this.model.val("header_content_value"));
					}
					if (this.model.val("header_footer_value")) {
						this.model.val("subtitle", this.model.val("header_footer_value"));					
					}
					this.model.clear({ id: ["header_header_value", "header_content_value", "header_footer_value"] });
				}
			}

			// render section views
			_.each(sections, function (sectionType) {
				var sectionView;
				
				sectionView = this.sectionViews[sectionType] = new PS.Views.Scorecard2.ColumnDialogSection({
					model: this.model,
					type: sectionType,
					rowType: this.options.type
				});
				
				sectionView.app = this.app;
				sectionView.parent = this;
			
				this.$content.append(sectionView.render().$el);
			}, this);

			return this;
		},

		renderOption: function (optionModel, $target) {
			var optionView;
			
			optionView = this.optionViews[optionModel.id] = new PS.Views.Scorecard2.Option({
				model: optionModel,
				className: "sc-column-dialog-option ui-helper-clearfix",
				template: (optionModel.id === "header_style" ? "option_radio_labeled_aligned" : "option_labeled_aligned")
			});
			
			optionModel.app = this;
			
			$target.append(optionView.render().$el);
		}
	});

	PS.Views.Scorecard2.ColumnDialogSection = Backbone.View.extend({
		tagName: "div",
		
		className: function () {
			return "sc-column-section-" + this.options.type + " sc-column-dialog-option ui-helper-clearfix"
		},
		
		initialize: function () {
			DDK.log("PS.Views.Scorecard2.ColumnDialogSection.initialize()");

			this.template = PS.templateCache.sc2ColumnDialogSection;
			
			this.optionViews = {};

			this.$el.on("click", "[data-action]", function (e) {
				this.$el.trigger($(e.currentTarget).data("action"));
			}.bind(this));
		},
		
		render: function () {
			DDK.log("PS.Views.Scorecard2.ColumnDialogSection.render()");
			
			this.$el.html(this.template(_.extend({}, _.string, { type: this.options.type, rowType: this.options.rowType })));
			
			// render section option views
			this.model.getOptionGroup("scorecard_column_config_object_settings").each(this.renderOption, { id: [this.options.rowType, this.options.type, "value"].join("_"), includeEmpty: true }, this);

			// render section-settings toolbar
			var toolbarName = "column_settings";
			var toolbarSettings = {
				model: this.model,
				className: function () {
					return _.string.classify(toolbarName) + " toolbar-content";
				},
				optionId: [
					this.options.rowType + "_" + this.options.type + "_format",
					this.options.rowType + "_" + this.options.type + "_style"
				],
				advancedOptionId: [
					this.options.rowType + "_" + this.options.type + "_attr",
					this.options.rowType + "_" + this.options.type + "_class_name"
				],
				buttons: {
					toolbarId: toolbarName,
					optionId: this.options.rowType + "_" + this.options.type + "_class_name"
				}
			};
			
			var toolbarView = new PS.Views.Scorecard2.Toolbar(toolbarSettings);

			this.optionViews[toolbarName] = toolbarView;
			this.$el.append(toolbarView.render().$el);

			return this;
		},
		
		renderOption: function (optionModel) {
			var optionView;
			
			optionView = this.optionViews[optionModel.id] = new PS.Views.Scorecard2.Option({
				model: optionModel,
				tagName: "input", 
				className: function () {
					return _.string.classify(this.model.id) + " sizing suffix"
				},
				attributes: function () {
					return {
						"type": "text",
						"data-bind": "value:value"
					};
				},
				noTemplate: true
			});
			
			optionModel.app = this.app;
			
			this.$el.append(optionView.render().$el);
		}

	});

	PS.Views.Scorecard2.ConfigDialog = Backbone.View.extend({
		events: {
			"addcolumn": "addColumn",
			//"toggleeditor": "toggleEditor",
			//"opengroupfield": "openGroupField",
			"removecolumn": "removeColumn"
		},
		
		initialize: function () {
			DDK.log("PS.Views.Scorecard2.ConfigDialog.initialize()");
			
			this.template = PS.templateCache.sc2ConfigDialog;
			
			this.optionViews = {};
			this.columnViews = [];
			
			this.on("ps.option.change", function (changed) {
				DDK.log("ps.option.change", changed);
				
				if (changed.id === "is_sortable" && changed.value) {
					this.model.val("is_grouped", false);
				}

				if (changed.id === "is_grouped") {
					if (changed.value) {
						this.model.val("is_sortable", false);
					}
					
					this.$el.find(".grouping-key").closest("span")[(changed.value ? "show" : "hide")]();
				}
				
				if (this.$editor && (changed.id === "is_sortable" || changed.id === "is_grouped" || changed.id === "is_advanced_editor")) {	
					this.renderEditor();
				}
				
				if (this.$editor && changed.id === "is_advanced_editor") {
					this.$el.closest(".sc-dialog")[(changed.value ? "addClass" : "removeClass")]("sc-advanced-editor");
				}

			}.bind(this));
		},
		
		render: function () {
			var data = this.$el.data("control");
			this.$el.html(this.template());
			
			this.$editor = this.$el.find(".sc-editor");
			this.$settings = this.$el.find(".sc-settings");
			
			// render dialog options
			this.model.getOptionGroup("scorecard_config_dialog_settings").collections.options.each(function (optionModel) {
				var optionView = new PS.Views.Scorecard2.Option({ model: optionModel, tagName: function () {
					return (optionModel.get("displayType").indexOf("abbr") > -1 ? "span" : "label")
				}, className: function () {
					return (optionModel.get("displayType").indexOf("button") > -1 ? "right" : "left")
				}});
				this.optionViews[optionModel.id] = optionView;
				optionView.render();
				this.$settings.append(optionView.$el);
			}.bind(this));

			this.$groupKey = this.$el.find(".grouping-key").select2({
				alignSearch: true,
				data: data.fields,
				initSelection: function (elem, callback) {
					var val = elem.val().toUpperCase(),
						select2Settings = elem.data("select2").opts,
						select2Data = select2Settings.data,
						match = _.find(select2Data, { id: val }) || data.fields[0];
						
					callback(match);
				}
			});
		},

		renderEditor: _.throttle(function () {
			DDK.log("PS.Views.Scorecard2.ConfigDialog.renderEditor()");
			
			var isAdvancedEditor = this.model.val("is_advanced_editor"),
				isGrouped = this.model.val("is_grouped"),
				isSortable = this.model.val("is_sortable"),
				config;
				
			this.$el.parent().removeClass("sc-column-editor");
			
			// new config comes from a textarea that is a direct child of $editor
			// or from building a config object from the model and collection
			// or from the original config object
			//newConfig = _.string.parse(this.$editor.find("textarea").val() || "") || this.buildConfig() || config;
			
			if (isAdvancedEditor) {
				// render JSON editor
				
				config = this.model.getOptionGroup("scorecard_config_object_settings").toCamelizedObject({ includeEmpty: true });
				config.columns = [];
				
				this.collection.each(function (columnModel) {
					var column = columnModel.getOptionGroup("scorecard_column_config_object_settings").toCamelizedObject({ includeEmpty: true });
					
					// remove column "group" properties if not a grouped scorecard
					if (!isGrouped) {
						_.forOwn(column, function (value, key) {
							if (_.string.startsWith(key, "group")) {
								delete column[key];
							}
						});
					}

					// remove column "sort" properties if not a sortable scorecard
					if (!isSortable) {
						_.forOwn(column, function (value, key) {
							if (_.string.startsWith(key, "sort")) {
								delete column[key];
							}
						});
					}
					config.columns.push(column);
				});
				
				$("<textarea>" + JSON.stringify(config, null, "\t") + "</textarea>").appendTo(this.$editor.empty()).editor({
					optionGroupModel: [this.model, this.collection.first()]
				});
				this.resize();
				
				return;
			}

			// render sortable column list UI
			this.$columnList = $("<ul class=\"sc-columns\"></ul>");
			this.columnViews.length = 0;
			
			config = _.string.parseJSON(this.$editor.find("textarea").val());
			
			if (_.isPlainObject(config)) {
				this.reset(config);
			}

			this.collection.each(this.addColumnListItemView, this);
			
			// setup sortable columns
			this.$columnList.sortable({
				handle: ".sort-handle",
				placeholder: "sort-placeholder",
				axis: "y",
				containment: "parent",
				tolerance: "pointer",
				update: function (e, ui) {
					this.updateColumnOrdinals();
				}.bind(this)
			});
			
			this.$columnList.appendTo(this.$editor.empty());
			
			if (this.collection.length) {
				this.resize();
			} else {
				this.$el.trigger("addcolumn");
			}
		}, 100, { leading: false, trailing: true }),
		
		reset: function (config) {
			// clear top-level and column config
			this.model.getOptionGroup("scorecard_config_object_settings").clear();
			this.collection.reset();
				
			if (config) {
				// initialize top-level config options
				// no need to strip off the `columns` property because an OptionGroup model will simply ignore options that are not already setup
				this.model.val(config);

				// initialize column-level config options
				_.each(config.columns, this.addColumnModel, this);
			}
		},

		addColumnListItemView: function (columnModel) {
			var columnView = new PS.Views.Scorecard2.ColumnListItem({ model: columnModel });
			columnView.parent = this;
			columnView.app = this;
			columnModel.app = columnView;
			this.columnViews.push(columnView);
			this.$columnList.append(columnView.render().$el);
			
			return columnView;
		},
		
		addColumnModel: function (column, index) {
			var data = this.$el.data("control"),
				columnOptionsAPI = DDK.scorecard2.optionsAPI.columnConfig,
				columnModel;
			
			if (column == null) {
				column = {};
			}

			if (index == null) {
				index = this.collection.length;
			}

			columnModel = new PS.MC.Models.OptionGroup({ ordinal: index });

			// setup column options
			//columnModel.app = this.app;
			columnModel.parent = this;
			columnModel.setup(columnOptionsAPI);
			
			// unset the id attribute so it doesn't interfere with ordinal tracking
			columnModel.unset("id");
			
			// initialize column options
			columnModel.val(column);
			
			// set default value for prefix and bodyContentValue
			// this will trigger default value for format (based on the datatype for that field)
			if (!columnModel.val("prefix")) {
				columnModel.val("prefix", data.defaultPrefix);
			}
			if (!columnModel.val("bodyContentValue")) {
				columnModel.val("bodyContentValue", _.find(data.prefixes, { id: data.defaultPrefix }).defaultSuffix);
			}
			
			// set default value for header_style
			if (columnModel.val("headerHeaderValue") || columnModel.val("headerContentValue") || columnModel.val("headerFooterValue")) {
				columnModel.val("header_style", "custom");
			} else {
				columnModel.val("header_style", "basic");
			}

			// append ordinal to id
			//columnModel.set("id", columnModel.get("id") + "_" + index.toString())
			
			this.collection.add(columnModel);
			
			return columnModel;
		},
		
		addColumn: function () {
			this.addColumnListItemView(this.addColumnModel());
			this.resize();
		}, 

		removeColumn: function (e, data) {
			DDK.log("PS.Views.Scorecard2.ConfigDialog.removeColumn()");
			this.collection.remove(data.model);
			this.updateColumnOrdinals();
		},
		
		updateColumnOrdinals: function () {
			DDK.log("PS.Views.Scorecard2.ConfigDialog.updateColumnOrdinals()");
			var $columns = this.$editor.find("ul").children();
			$columns.each(function (index, elem) {
				var $elem = $(elem),
					cid = $elem.data("cid"),
					model = this.collection.get(cid);
							
				if (model) {
					model.set("ordinal", index);
				}
			}.bind(this));
					
			this.collection.sort();	
		},

		resize: function () {
			this.$el.data("ui-dialog")._trigger("resize");
		}
	});


	// Scorecard2 BuildColumns Handler
	DDK.eventHandler.sc2BuildColumns = function (e) {
		function dialogResize(e) {
			var $this = $(this),
				$editor = $this.find(".sc-editor"),
				editor = $editor.find("textarea").data("editor"),
				$settings = $this.find(".sc-settings"),
				editorHeight = $editor.closest(".ui-dialog-content").height() - $settings.outerHeight(true),
				$columns = $this.find("li"),
				$firstColumn,
				$inputs,
				$others,
				inputWidth,
				$columnDialog = $this.find(".sc-column-dialog"),
				$columnDialogContent = $columnDialog.find(".sc-column-dialog-content"),
				$columnDialogTitle = $columnDialog.find(".sc-column-dialog-title"),
				$columnDialogOptions = $columnDialog.find(".sc-column-dialog-option"),
				columnDialogOptionInputWidth;
			
			// set editor height
			$editor.height(editorHeight);
			if (editor) {
				editor.refresh();
			}
			
			// set column input.sizing widths
			if ($columns.length) {
				$firstColumn = $columns.first();
				$inputs = $firstColumn.children(".sizing:visible");
				$others = $firstColumn.children(":visible:not(.sizing)");
				inputWidth = $firstColumn.width() - 20;

				// set column input widths
				$others.each(function (index, elem) {
					inputWidth -= $(elem).outerWidth(true);
				});
				
				inputWidth = Math.floor(inputWidth / $inputs.length) - $inputs.first().outerWidth(true) + $inputs.first().width() - $inputs.length;
		
				$columns.each(function (index, elem) {	
					$(elem).children(".sizing").each(function (index, input) {
						$(input).width(inputWidth);
					});
				});
			}
			
			// set column dialog content height
			if ($columnDialog.length) {
				$columnDialogContent.height($columnDialog.height() - $columnDialogTitle.outerHeight(true) - 10);
			}
			
			// set column dialog option input widths
			if ($columnDialogOptions.length) {
				columnDialogOptionInputWidth = $columnDialogOptions.first().width() - $columnDialogOptions.first().children("span").outerWidth(true) - 56;
				$columnDialogOptions.children("input").width(columnDialogOptionInputWidth - 12);
				$columnDialogOptions.children("div.option-radio, div.select2-container").width(columnDialogOptionInputWidth);
			}
			
			// reposition qtips
			$(".qtip:visible").qtip("reposition", null, false);
		}	

		function dialogCancel(e) {
			$(this).dialog("close");
		}
		
		function dialogClose(e) {
			$(".qtip:visible").qtip("hide");		
		}
		
		function dialogDrag(e) {
			$(".qtip:visible").qtip("reposition", null, false);
		}

		function dialogOpen(e) {
			var $this = $(this),
				data = $this.data("control"),
				config = data.config,
				$buttons = $dialog.closest(".ui-dialog").find(".ui-dialog-buttonset button"),
				configModel,
				configView,
				columnsCollection;

			// setup dialog button positions
			$buttons
				.addClass(function (index) {
					return index ? "right" : "left add-column";
				})
				.eq(1).addClass("link").end()
				.eq(2).addClass("link").end();
			
			
			// create scorecard config model
			configModel = data.configModel = new PS.MC.Models.OptionGroup();
			
			// create scorecard columns collection
			columnsCollection = data.columnsCollection = new PS.Collections.Scorecard2.ConfigColumns();
			
			// create scorecard config view
			configView = data.configView = new PS.Views.Scorecard2.ConfigDialog({ el: $this.get(), model: configModel, collection: columnsCollection });

			// setup dialog options
			configModel.app = configView;
			configModel.parent = configView;
			configModel.setup(DDK.scorecard2.optionsAPI.config);

			configView.reset(config);

			// initialize dialog options
			// groupingKey is initialized before render so that the input will have the correct initial value
			// when .select2 is called
			configModel.val({
				groupingKey: data.gk && data.gk.toUpperCase() || data.fields[0].id
			});

			configView.render();
			
			// initialize dialog options
			// the is* options are initialized after render so that their ps.option.change events will update the editor
			configModel.val({
				isSortable: (!!data.gk ? false : _.string.toBoolean(data.sortable) || false),
				isGrouped: !!data.gk,
				isAdvancedEditor: false		
			});
		}

		function dialogApply(e) {
			var $this = $(this),
				data = $this.data().control,
				id = data.id,
				statePrefix = "s_" + id + "_",
				groupingKey = (data.configModel.val("isGrouped") ? data.configModel.val("groupingKey") : ""),
				sortable = data.configModel.val("isSortable").toString(),
				columnsCollection = data.columnsCollection,
				isAdvancedEditor = data.configModel.val("isAdvancedEditor"),
				config;
			
			if (isAdvancedEditor) {
				config = _.string.parseJSON($this.find(".sc-editor").find("textarea").val());
				if (!_.isPlainObject(config)) {
					alert("Invalid JSON");
					return;
				}
			} else {
				config = data.configModel.getOptionGroup("scorecard_config_object_settings").toCamelizedObject();
				config.columns = columnsCollection.map(function (columnModel) {
					return columnModel.getOptionGroup("scorecard_column_config_object_settings").toCamelizedObject();
				});
			}
			
			// set control keywords
			K({
				"soe": sortable,
				"gk": groupingKey,
				"con": DDK.escape.brackets(JSON.stringify(config))
			}, statePrefix);

			// reload scorecard
			DDK.reloadControl("scorecard2", id);
		}
		
		function dialogOK(e) {
			var $this = $(this);
			
			dialogApply.call(this, e);
			
			// close dialog
			$this.dialog("close");
		}

		function dialogAddColumn(e) {
			$.data(this, "control").configView.$el.trigger("addcolumn");
		}
		
		var $this = $(e.currentTarget),
			$control = $this.parentControl(),
			data = _.extend({}, $this.data(), $control.controlData()),
			$dialog = DDK.scorecard2.data[data.id].$dialog,
			config = data.config,
			columns = config && config.columns || [];
		
		if (!$dialog) {
			DDK.scorecard2.data[data.id].$dialog = $dialog = $("<div/>").dialog({
				autoOpen: false,
				title: "Build Scorecard",
				dialogClass: "ddk-dialog sc-dialog",
				width: 650,
				height: 400,
				minWidth: 500,
				minHeight: 300,
				open: dialogOpen,
				close: dialogClose,
				resize: dialogResize,
				drag: dialogDrag,
				dragStop: dialogDrag,
				buttons: [
					{ text: "Add Column", click: dialogAddColumn },
					{ text: "Apply", click: dialogApply },
					{ text: "Cancel", click: dialogCancel },
					{ text: "OK", click: dialogOK }
				]
			});
		}

		// pass the control data object along to the dialog
		$dialog.data("control", data);
		
		// show the dialog
		if ($dialog.dialog("isOpen")) {
			$dialog.dialog("moveToTop");
		} else {
			$dialog.dialog("open");
			$dialog.data("ui-dialog")._trigger("resize");
		}
		
	};
}