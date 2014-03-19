// Wrapped the entire Scorecard control config dialog code
// in a check for Backbone.Epoxy
// because version 1.4.0 of the Metrics Catalog
// overwrites Backbone to version 0.9.2
// and blows away Backbone.Epoxy
if (Backbone.Epoxy) {

	// PS.Views.Bamset2
	PS.extend("Views.Bamset2"); 

	PS.Views.Bamset2.Option = Backbone.Epoxy.View.extend({
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

	PS.Views.Bamset2.Base = Backbone.View.extend({
		renderToolbar: function ($target, settings) {
			var view;

			settings = _.extend({}, {
				model: this.model,
				className: "config-toolbar-content column",
				optionId: this.optionId,
				type: this.options.type
			}, settings);
			
			view = new PS.Views.Bamset2.ConfigToolbar(settings);
			view.parent = this;
			view.app = this;

			this.optionViews.toolbar = view;
			$target.append(view.render().$el);
		},

		renderOption: function (model, $target, mode, className) {
			var view, settings;
			
			if (!model) {
				DDK.error("PS.Views.Bamset2.Base.renderOption(): model is undefined");
				return;
			}
			
			if (!$target) {
				DDK.error("PS.Views.Bamset2.Base.renderOption(): $target is undefined");
				return;			
			}
			
			switch (mode) {
				case "input":
					settings = {
						model: model,
						tagName: "input", 
						className: function () {
							return _.string.classify(this.model.id) + " config-option-input " + (className || "");
						},
						attributes: function () {
							return {
								"type": "text",
								"data-bind": "value:value"
							};
						},
						noTemplate: true
					};
					break;
				case "span":
					settings = {
						model: model,
						tagName: "span"
					};
					break;
				case "label":
					settings = {
						model: model,
						tagName: "label"
					};
					break;
				case "select":
					settings = {
						model: model,
						template: "option_select"
					};
					break;
				default:
					settings = {
						model: model,
						className: "bs-column-dialog-option ui-helper-clearfix",
						template: ((model.get("displayType") === "radio") ? "option_radio" : "option_labeled_aligned")
					};
			}
			
			view = this.optionViews[model.id] = new PS.Views.Bamset2.Option(settings);
			
			model.app = this;
			
			$target.append(view.render().$el);
		},
		
		resize: function () {
			this.options.data.$dialog.data("ui-dialog")._trigger("resize");
		},
		
		toggleToolbar: function (e) {
			var $target = $(e.currentTarget);
			
			$target.find("[data-action=\"toggletoolbar\"\]").eq(0).toggleClass("config-toolbar-open");
			$target.find(".config-toolbar").eq(0).toggle();
			e.stopPropagation();
		}
	});


	PS.Views.Bamset2.ConfigToolbar = PS.Views.Bamset2.Base.extend({
		tagName: "div",
		
		initialize: function () {
			if (this.options.type === "bam" || this.options.type === "element") {
				this.template = PS.templateCache.configChildToolbar;
			} else {
				this.template = PS.templateCache.configSectionToolbar;
			}
			
			this.optionViews = {};
		},

		render: function () {
			DDK.log("PS.Views.Bamset2.ConfigToolbar.render()");
			
			var buttons, $buttons;
			
			// apply template and bindings
			if (this.template) {
				this.$el.html(this.template(_.extend({}, _.string, this.options, this.model.toJSON())));
			}
			
			// render option views
			_.each(this.options.optionId, this.renderToolbarOption, this);
			
			// render buttons
			this.renderButtons("format", this.options.optionId.className, "column_settings");
			
			if (this.options.type === "bam" || this.options.type === "element") {
				this.renderButtons("grid", this.options.optionId.gridClassName, "grid_settings");
			} else {
				this.renderButtons("grid", this.options.optionId.gridClassName, "block_grid_settings");
			}
			
			return this;
		},
		
		updateButtons: function (type, optionValues) {
			this["$" + type + "Buttons"].each(function (index, elem) {
				var $elem = $(elem),
					$span = $elem.find("span"),
					data = $elem.data(),
					text = data.text,
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
				
				if (match && match.text) {
					$span.text(match.text);
					return;
				}
				
				$span.text(text);
			});
		},
		
		renderToolbarOption: function (optionId, optionKey) {
			var $target = this.$el.find(".config-toolbar-" + _.string.classify(optionKey));
			
			if ($target.length) {
				this.renderOption(this.model.getOption(optionId), $target, "input");
			}
		},
		
		renderButtons: function (type, optionId, toolbarId) {
			var $buttons,
				buttonModel = this.model.getOption(optionId),
				buttons = {
					model: buttonModel,
					value: buttonModel.get("value"),
					groups: PS.Toolbar.getOptionGroup(toolbarId).collections.optionGroups
					
				};
				
			buttons.values = (buttons.value ? buttons.value.split(" ") : []);
			
			buttonModel.on("change:value", function (model, value) {
				this.updateButtons(type, value);
			}.bind(this));

			$buttons = $("<div>" + buttons.groups.reduce(function (accumulator, buttonGroup) {
				var buttonOptions = buttonGroup.collections.options;
				
				var values = buttonOptions.reduce(function (accumulator, buttonOption) {
					var value = buttonOption.get("value");
					if (value) {
						accumulator.push({
							id: buttonOption.id,
							value: value,
							text: buttonOption.get("text")
						});
					}
					return accumulator;
				}, []);

				return accumulator + 
					"<span data-label=\"" + buttonGroup.get("label") + "\">" +
						"<button class=\"toolbar-buttonbar\" data-toolbar=\"" + buttonGroup.id + "\" data-text=\"" + buttonGroup.get("text") + "\" data-values=\"" + _.escape(JSON.stringify(values)) + "\">" +
							"<span>" + 
								buttonGroup.get("text") + 
							"</span>" +
						"</button>" +
						"<div class=\"" + buttonGroup.id + " toolbar-content ps-hidden\">" +
						buttonOptions.reduce(function (accumulator, buttonOption) {
							return accumulator + 
								"<span data-label=\"" + buttonOption.get("label") + "\">" +
									"<button value=\"" + buttonOption.get("value") + "\" data-is-grid=\"" + (buttonGroup.parent.id.indexOf("grid") > -1).toString() + "\" data-values=\"" + _.escape(JSON.stringify(_.pluck(values, "value"))) + "\">" + 
										buttonOption.get("text") + 
									"</button>" +
								"</span>";
						}, "") +
						"</div>" +
					"</span>";
			}, "") + "</div>").appendTo(this.$el.find(".config-toolbar-" + type + "-buttons"));

			// bind toolbar button events
			$buttons.find("button[value][data-values]").on("click", function (e) {
				var $target = $(e.currentTarget),
					data = $target.data(),
					value = e.currentTarget.value,
					values = data.values,
					option = buttons.model,
					optionValue = option.get("value"),
					optionValues = (typeof optionValue === "string" ? optionValue.split(" ") : []),
					newValue = _.compact(_.sortBy([value].concat(_.difference(optionValues, values))));
				
				// grid classes are output in reverse alphabetical order (small - medium - large)
				// this will break if xlarge is introduced
				option.set("value", (data.isGrid ? newValue.reverse() : newValue).join(" "));
			});
			
			// save reference to top-level toolbar buttons
			this["$" + type + "Buttons"] = $buttons.find("button[data-text][data-values]");
			
			this.updateButtons(type, buttons.value);
		}
	});


	PS.Views.Bamset2.Child = PS.Views.Bamset2.Base.extend({
		tagName: "li",
		className: function () {
			return this.options.type + " row config-child";
		},

		events: {
			"removeself": "removeSelf",
			"toggletoolbar": "toggleToolbar"
		},
		
		initialize: function () {
			DDK.log("PS.Views.Bamset2.Child.initialize()");
			
			this.template = PS.templateCache["configChild" + _.string.titleize(this.options.type)];

			this.optionViews = {};
			this.sectionViews = {};
			
			var sections = this.model.get("sections");
			if (sections) {
				this.sections = sections.split(" ");
			}
			
			this.prefix = this.model.get("prefix");
			
			this.optionId = {
				title: this.prefix + "_title",
				subtitle: this.prefix + "_subtitle",
				headerStyle: this.prefix + "_header_style",
				attr: this.prefix + "_attr",
				className: this.prefix + "_class_name",
				gridAttr: this.prefix + "_grid_attr",
				gridClassName: this.prefix + "_grid_class_name",
				prefix: this.prefix + "_prefix",
				value: this.prefix + "_value",
				format: this.prefix + "_format",
				showFooter: this.prefix + "_show_footer"
			};
			
			if (this.options.type === "element") {
				this.optionId.formatStyle = this.prefix + "_format_style";		
			}
			
			var data = this.options.data;
			
			this.$el.on("click", "[data-action]", function (e) {
				DDK.log("click [data-action] (Child)", $(e.currentTarget).data("action"));
				this.$el.trigger($(e.currentTarget).data("action"));
				e.stopPropagation();
			}.bind(this));

			this.on("ps.option.change", function (changed) {
				DDK.log("ps.option.change (Child)", this.cid, changed);

				if (changed && changed.id === "bam_prefix") {
					_.defer(this.prefixChange.bind(this), changed.value);
				}

				if (changed && changed.id === "elem_value") {
					_.defer(this.valueChange.bind(this), changed.value);
				}
				
				if (changed && changed.id === "elem_format") {
					_.defer(this.formatChange.bind(this), changed.value);
				}
				
				if (changed && changed.id === this.optionId.showFooter) {
					this.sectionViews.footer.$el.trigger(changed.value ? "showself" : "hideself");				
				}
			}.bind(this));
			
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

		},
		
		render: function () {
			DDK.log("PS.Views.Bamset2.Child.render()");

			this.$el.html(this.template(_.extend({}, _.string, this.options)));
			this.$header = this.$el.find(".config-child-header");
			this.$content = this.$el.find(".config-child-content");
			this.$footer = this.$el.find(".config-child-footer");
			this.$toolbar = this.$el.find(".config-child-toolbar");
			this.$prefixWrapper = this.$el.find(".config-child-prefix");
			this.$suffixWrapper = this.$el.find(".config-child-value");
			this.$formatWrapper = this.$el.find(".config-child-format");
			this.$showFooter = this.$el.find(".config-child-show-footer");

			// render config toolbar
			this.renderToolbar(this.$toolbar, this.options);

			// toolbar contains the formatStyle input
			this.$formatStyleWrapper = this.$el.find(".config-child-formatstyle");

/*			// render settings toolbar
			this.renderToolbar(this.options.type === "element" ? this.$el : this.$title, {
				toolbarName: "grid_settings",
				optionId: [
					this.optionId.gridAttr,
					this.optionId.gridClassName
				], 
				buttons: {
					toolbarId: "grid_settings",
					optionId: this.optionId.gridClassName
				}
			});
			this.renderToolbar(this.options.type === "element" ? this.$el : this.$title, this.options.type === "element" ? { 
				optionId: ["elem_format", "elem_format_style", "elem_attr", "elem_class_name"] 
			} : {});
*/			
			
			// render options
			
			if (this.options.type === "element") {
				// render format value
				this.renderOption(this.model.getOption(this.optionId.value), this.$suffixWrapper, "input");
				this.renderOption(this.model.getOption(this.optionId.format), this.$formatWrapper, "input");
				this.renderOption(this.model.getOption(this.optionId.formatStyle), this.$formatStyleWrapper, "input");
				
				this.$suffix = this.$el.find("input.elem-value");
				this.$format = this.$el.find("input.elem-format");
				this.$formatStyle = this.$el.find("input.elem-format-style");
				
				this.$suffix.select2(this.suffixSettings());
				this.$format.select2(this.formatSettings());
				
				this.formatChange(this.model.val(this.optionId.format));
			} else {
				// render prefix
				this.renderOption(this.model.getOption(this.optionId.prefix), this.$prefixWrapper, "input");
				this.renderOption(this.model.getOption(this.optionId.showFooter), this.$showFooter, "label");
				
				this.$prefix = this.$el.find("input.bam-prefix");
				this.$prefix.select2(this.prefixSettings());
				//this.$prefix.on("change", this.prefixChange.bind(this));
			}

			// render sections
			_.each(this.sections, this.renderSection, this);

			if (this.options.type !== "element") {
				// setup initial select2 dropdown state
				this.isInitialized = false;
				this.$prefix.trigger("change");
				this.isInitialized = true;
			}
			
			return this;
		},

		renderSection: function (type) {
			var section = new PS.Views.Bamset2.Section({ model: this.model, type: type, parentType: this.options.type, parentPrefix: this.options.type, data: this.options.data });
			section.app = this;
			section.parent = this;
			
			this.sectionViews[type] = section;
			this.$content.append(section.render().el);
		},

		removeSelf: function (e) {
			DDK.log("PS.Views.Bamset2.Child.removeSelf()");
			this.remove();
			this.parent.$el.trigger("removechild", { model: this.model });
		
			e.stopPropagation();
		},

		prefixChange: function (value) {	
			var data = this.options.data,
				prefixMatch = _.find(data.prefixes, { id: value }) || data.prefixes[0],
				suffixes = prefixMatch.suffixes,
				$suffixes = this.$el.find("input.elem-value");
				
			$suffixes.each(function (index, elem) {
				var $this = $(elem);
				
				suffixMatch = _.find(suffixes, { id: $this.val().toUpperCase() }) || _.find(suffixes, { id: prefixMatch.defaultSuffix });
			
				$this.select2("destroy");

				$this.val(suffixMatch.id);				

				$this.select2(this.suffixSettings(value));
				
				// artificially trigger a value model change event
				// on each element under this bam
				// so that format and formatStyle are udpated
				_.each(this.sectionViews, function (section) {
					_.each(section.childViews, function (child) {
						_.defer(function (child) {
							child.trigger("ps.option.change", { id: "elem_value", value: child.model.val("elem_value") });
						}, child);
						//child.trigger("ps.option.change", { id: "elem_value", value: child.model.val("elem_value") });
					});
				});
				
			}.bind(this));
		},
			
		valueChange: function (value) {
			var data = this.options.data,
				prefix = this.model.parent.parent.parent.val("bam_prefix").toUpperCase(),
				// find the matching prefix object
				// or take the first one
				prefixObject = _.find(data.prefixes, { id: prefix }) || data.prefixes[0] || {},
				// find the matching suffix object within this prefix
				// or take the default suffix object
				// or take the first one
				suffixObject = _.find(prefixObject.suffixes, { id: value.toUpperCase() }) || _.find(prefixObject, { id: prefixObject.defaultSuffix }) || prefixObject.suffixes[0] || {};
			
			// update Select2
			this.$suffix.trigger("change");
			
			this.model.val("elem_format", PS.Formatter.typeMap[suffixObject.type] || PS.Formatter.defaultFormat)		
		},
		
		formatChange: function (value) {
			var settings = this.formatStyleSettings(value);
			
			// update Select2
			this.$format.trigger("change");
		
			// recreate formatStyle Select2
			this.$formatStyle.select2("destroy");
			
			if (settings) {
				this.$formatStyle.parent().removeClass("config-dialog-hidden");

				// recreate formatStyle select2
				this.$formatStyle.select2(settings);
				this.$formatStyle.trigger("change");
			} else {
				this.$formatStyle.parent().addClass("config-dialog-hidden");
				this.$formatStyle.val("");
			}
		
		}
		
	});


	PS.Views.Bamset2.Section = PS.Views.Bamset2.Base.extend({
		tagName: "div",
		className: function () {
			return this.options.parentType + "-section " + this.options.parentType + "-section-" + this.options.type + (this.options.parentType === "bamset" ? " column" : "");
		},
		
		events: {
			"addchild": "addChild",
			"removechild": "removeChild",
			"toggletoolbar": "toggleToolbar",
			"showself": "showSelf",
			"hideself": "hideSelf"			
		},

		initialize: function () {
			DDK.log("PS.Views.Bamset2.Section.initialize()");
			
			this.template = PS.templateCache.configSection;
			
			this.optionViews = {};
			this.childViews = [];

			var parentPrefix = this.options.parentPrefix,
				type = this.options.type,
				childType = this.model.get("childType");

			this.optionId = {
				title: parentPrefix + "_title",
				subtitle: parentPrefix + "_subtitle",
				headerStyle: parentPrefix + "_header_style",
				child: parentPrefix + "_" + type + "_" + childType + "s",
				attr: parentPrefix + "_" + type + "_attr",
				className: parentPrefix + "_" + type + "_class_name",
				showSubtitle: parentPrefix + "_" + type + "_show_subtitle",
				gridAttr: parentPrefix + "_" + type + "_grid_attr",
				gridClassName: parentPrefix + "_" + type + "_grid_class_name"
			};
			
			if (childType) {
				this.childType = this.options.childType = childType;
				this.childName = this.model.get("childName") || childType;
				this.children = this.model.getOption(this.optionId.child).get("value");
				if (!(this.children instanceof PS.MC.Collections.OptionGroups)) {
					this.children = new PS.MC.Collections.OptionGroups();
					this.model.getOption(this.optionId.child).set("value", this.children);
					this.children.parent = this.model.getOption(this.optionId.child);
				}
			}


			this.$el.on("click", "[data-action]", function (e) {
				DDK.log("click [data-action] (Section)", $(e.currentTarget).data("action"));
				this.$el.trigger($(e.currentTarget).data("action"));
				e.stopPropagation();
			}.bind(this));
			
			this.on("ps.option.change", function (changed) {
				DDK.log("ps.option.change (Section)", changed);
				
				var children;
				
				if (this.options.type === "header" && changed.id === this.optionId.headerStyle && changed.value) {
					if (changed.value === "custom") {
						this.$showSubtitle.addClass("config-dialog-hidden");
						this.$contentBasic.hide();
						this.$footer.show();

						this.model.clear({ id: [this.optionId.title, this.optionId.subtitle] });
						
						// add a child if one does not already exist
						children = this.model.val(this.optionId.child);
						if (children && !children.length) {
							this.$el.trigger("addchild");
						}

					} else if (changed.value === "basic") {
						this.$showSubtitle.removeClass("config-dialog-hidden");
						this.$contentBasic.show();
						this.$footer.hide();

						// cleanup: option value, child views, childViews array
						this.model.clear({ id: [this.optionId.child] });
						_.each(this.childViews, function (view) {
							view.remove();
						});
						this.childViews = [];
					}					
				}
				
				if (this.options.type === "header" && changed.id === this.optionId.showSubtitle) {
					if (changed.value) {
						this.$subtitle.closest(".row").show();
					} else {
						this.$subtitle.closest(".row").hide();

						this.model.clear({ id: this.optionId.subtitle });
					}					
				}
			}.bind(this));

		},
		
		render: function () {
			DDK.log("PS.Views.Bamset2.Section.render()");
			
			this.$el.html(this.template(_.extend({}, _.string, this.options)));
			this.$header = this.$el.find(".config-section-header");
			this.$content = this.$el.find(".config-section-content");
			this.$contentBasic = this.$el.find(".config-section-content-basic");
			this.$title = this.$el.find(".config-section-title");
			this.$titleLabel = this.$el.find(".config-section-title-label");
			this.$headerStyle = this.$el.find(".config-section-header-style");
			this.$subtitle = this.$el.find(".config-section-subtitle");
			this.$subtitleLabel = this.$el.find(".config-section-subtitle-label");
			this.$footer = this.$el.find(".config-section-footer");
			this.$toolbar = this.$el.find(".config-section-toolbar");
			//this.$titleGroup = this.$title.add(this.$titleLabel).add(this.$subtitle).add(this.$subtitleLabel);
			this.$showSubtitle = this.$el.find(".config-section-show-subtitle");
			this.$databind = this.$el.find(".config-section-databind");
			//this.$addChild = this.$footer.find("[data-action=\"addchild\"]");

			// render config toolbar
			this.renderToolbar(this.$toolbar, this.options);


			// render settings toolbar
			//this.renderToolbar(this.$title, { toolbarName: "block_grid_settings", buttons: { toolbarId: "block_grid_settings", optionId: this.optionId.className } });
			//this.renderToolbar(this.$title);


			if (this.options.type === "header") {
				// render header_style and show_subtitle option view
				this.renderOption(this.model.getOption(this.optionId.headerStyle), this.$headerStyle);
				this.renderOption(this.model.getOption(this.optionId.showSubtitle), this.$showSubtitle, "label");

				// render title and subtitle option views
				this.renderOption(this.model.getOption(this.optionId.title), this.$title, "input");
				this.renderOption(this.model.getOption(this.optionId.subtitle), this.$subtitle, "input");
				
				// set header_style state
				if (!this.model.val(this.optionId.headerStyle)) {
					if (this.children && this.children.length) {
						this.model.val(this.optionId.headerStyle, "custom");
					} else {
						this.model.val(this.optionId.headerStyle, "basic");
					}
				}
				
				// set show_subtitle state
				this.model.val(this.optionId.showSubtitle, !!this.model.val(this.optionId.subtitle));
			}

			if (this.options.type === "body") {
				this.renderOption(this.model.getOption("set_databind"), this.$databind, "select");
			}
			
			// render child views
			this.children.each(this.renderChild, this);
			
			return this;
		},
		
		renderChild: function (model) {
			var view;
			
			view = new PS.Views.Bamset2.Child({ model: model, type: this.childType, data: this.options.data });
			view.parent = this;
			model.app = this;
			
			this.childViews.push(view);
		
			this.$content.append(view.render().$el);
			
			return view;
		},
		
		addChild: function (e) {
			DDK.log("PS.Views.Bamset2.Section.addChild()");
			
			var model = new PS.MC.Models.OptionGroup(),
				view;
				
			model.setup(PS.optionsAPI[this.childName]);
			model.parent = this.children;
			
			// set a unique id so it doesn't interfere with the collection
			model.id = model.id + "_" + _.uniqueId();

			// set default bam_prefix
			// or elem_value, elem_format, and elem_format_style
			if (this.childType === "bam") {
				model.val("bam_prefix", this.options.data.defaultPrefix);
			}
			
			if (this.childType === "element") {
				_.defer(function (model) {
					var data = this.options.data;
					
					model.val("elem_value", _.find(data.prefixes, { id: data.defaultPrefix }).defaultSuffix);
				}.bind(this), model);
			}
			
			this.children.add(model);

			view = this.renderChild(model);
			
			if (this.childType === "bam") {
				view.sectionViews.content.$el.trigger("addchild");
			}
			
			this.resize();
			
			e.stopPropagation();
		},

		removeChild: function (e, data) {
			DDK.log("PS.Views.Bamset2.Section.removeChild()");
			this.children.remove(data.model);
			
			e.stopPropagation();
		},
		
		showSelf: function (e) {
			DDK.log("PS.Views.Bamset2.Section.showSelf()");

			this.$el.show();
			
			if (!this.children.length) {
				this.$el.trigger("addchild");
			}
			
			e.stopPropagation();
		},
		
		hideSelf: function (e) {
			DDK.log("PS.Views.Bamset2.Section.hideSelf()");
			
			_.each(this.childViews, function (child) {
				child.remove();
			});
			
			this.children.reset();
			
			this.$el.hide();
			
			e.stopPropagation();
		}
	});


	PS.Views.Bamset2.Set = Backbone.View.extend({
		initialize: function () {
			DDK.log("PS.Views.Bamset2.Set.initialize()");
			
			this.template = PS.templateCache.configDialog;
			
			this.optionViews = {};
			this.sectionViews = {};
			
			this.sections = "header body footer".split(" ");
			
			this.on("ps.option.change", function (changed) {
				DDK.log("ps.option.change (Set)", this.cid, changed);
				
				if (this.$editor && changed.id === "is_advanced_editor") {	
					this.renderEditor();
					this.$el.closest(".bamset-dialog")[(changed.value ? "addClass" : "removeClass")]("is-advanced-editor");
				}
			}.bind(this));
			
		},
		
		render: function () {
			var data = this.$el.data("control");
			this.$el.html(this.template());
			
			this.$editor = this.$el.find(".config-editor");
			this.$settings = this.$el.find(".config-settings");
			
			// render dialog options
			this.model.getOptionGroup("dialog").collections.options.each(function (optionModel) {
				var optionView = new PS.Views.Bamset2.Option({ model: optionModel, tagName: function () {
					return (optionModel.get("displayType").indexOf("abbr") > -1 ? "span" : "label")
				}, className: function () {
					return (optionModel.get("displayType").indexOf("button") > -1 ? "right" : "left")
				}});
				this.optionViews[optionModel.id] = optionView;
				optionView.render();
				this.$settings.append(optionView.$el);
			}.bind(this));
						
			return this;
		},

		renderEditor: _.throttle(function () {
			DDK.log("PS.Views.Bamset2.Set.renderEditor()");
			
			var isAdvancedEditor = this.model.val("is_advanced_editor"),
				config = _.string.parseJSON(this.$editor.find("textarea").val()) || this.model.toCamelizedObject({ includeEmpty: true }),
				children;
			
			// new config comes from a textarea that is a direct child of $editor
			// or from building a config object from the model
			
			if (isAdvancedEditor) {
				// render JSON editor
				this.$textArea = $("<textarea>" + JSON.stringify(config, null, "\t") + "</textarea>").appendTo(this.$editor.empty()).editor({
					optionGroupModel: DDK.bamset2.configOptionGroupModels
				});
				this.resize();
				
				return;
			}

			// render set UI
			this.$editor.empty();

			if (_.isPlainObject(config)) {
				this.reset(config);
			}
			
			// add a bam to the set Body if one does not already exist
			children = this.model.val("setBodyBams");
			if (children && !children.length) {
				// defer event trigger to allow bam_prefix databinding
				_.defer(function (view) { view.$el.trigger("addchild"); }, this.sectionViews.body);
			}
			
			this.resize();
		}, 20, { leading: false, trailing: true }),
		
		renderSection: function (type) {
			var section = new PS.Views.Bamset2.Section({ model: this.model, type: type, parentType: "bamset", parentPrefix: "set", data: this.options.data });
			section.app = this;
			section.parent = this;
			
			this.sectionViews[type] = section;
			this.$editor.append(section.render().el);
		},
		
		reset: function (config) {
			// clear set config
			// clear the entire model so that all UI options are reset as well
			this.model.clear({ exportGroupId: "bamset" });
				
			if (config) {
				// initialize set config
				this.model.val(config);
			}
			
			if (this.$editor && !this.model.val("isAdvancedEditor")) {
				_.each(this.sections, this.renderSection, this);
			}

		},
		

		resize: function () {
			this.$el.data("ui-dialog")._trigger("resize");
		}
	});


	// Scorecard2 BuildColumns Handler
	DDK.eventHandler.bs2BuildSet = function (e) {
		function dialogResize(e) {
			var $this = $(this),
				$editor = $this.find(".config-editor"),
				$settings = $this.find(".config-settings"),
				editor = $editor.find("textarea").data("editor");
				editorHeight = $editor.closest(".ui-dialog-content").height() - $settings.outerHeight(true);
				
			// set editor height
			$editor.height(editorHeight);
			if (editor) {
				editor.refresh();
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
				setModel = new PS.MC.Models.OptionGroup(),
				setView = new PS.Views.Bamset2.Set({ el: $this.get(), model: setModel, data: _.extend(data, { $dialog: $this }) });

			// setup dialog button positions
			$buttons
				.addClass("right")
				.eq(0).addClass("link").end()
				.eq(1).addClass("link").end();
			
			// save references to set model and view
			data.setModel = setModel;
			data.setView = setView;
			
			// setup dialog options
			setModel.app = setView;
			setModel.parent = setView;
			setModel.setup(PS.optionsAPI.bamset);

			setView.reset(config);
			setView.render();

			// initialize dialog options
			// the is* options are initialized after render so that their ps.option.change events will update the editor
			setModel.val({
				isAdvancedEditor: false		
			});
		}

		function dialogApply(e) {
			var $this = $(this),
				data = $this.data().control,
				id = data.id,
				statePrefix = "s_" + id + "_",
				isAdvancedEditor = data.setModel.val("isAdvancedEditor"),
				config;
			
			if (isAdvancedEditor) {
				config = _.string.parseJSON($this.find(".config-editor").find("textarea").val());
				if (!_.isPlainObject(config)) {
					alert("Invalid JSON");
					return;
				}
			} else {
				config = data.setModel.toCamelizedObject();
			}
			
			// set control keywords
			K({
				"con": DDK.escape.brackets(JSON.stringify(config))
			}, statePrefix);

			// reload scorecard
			DDK.reloadControl("bamset2", id);
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
			$dialog = DDK.bamset2.data[data.id].$dialog,
			config = data.config,
			columns = config && config.columns || [],
			dialogWidth = Math.min($("body").width() - 100, 1000),
			dialogHeight = $("body").height() - 100;
		
		if (!$dialog) {
			DDK.bamset2.data[data.id].$dialog = $dialog = $("<div/>").dialog({
				autoOpen: false,
				title: "Build BAM Set",
				dialogClass: "config-dialog ddk-dialog bamset-dialog ddk-mq-small",
				width: dialogWidth,
				height: dialogHeight,
				minWidth: 730,
				maxWidth: 1000,
				minHeight: 300,
				open: dialogOpen,
				close: dialogClose,
				resize: dialogResize,
				drag: dialogDrag,
				dragStop: dialogDrag,
				buttons: [
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
