// Wrapped the entire Navset control config dialog code
// in a check for Backbone.Epoxy
// because version 1.4.0 of the Metrics Catalog
// overwrites Backbone to version 0.9.2
// and blows away Backbone.Epoxy
if (Backbone.Epoxy) {

	// PS.Views.Navset2
	PS.extend("Views.Navset2"); 

	PS.Views.Navset2.Option = Backbone.Epoxy.View.extend({
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

	PS.Views.Navset2.Set = Backbone.View.extend({
		events: {
		},
		
		initialize: function () {
			DDK.log("PS.Views.Navset2.Set.initialize()");
			
			this.template = PS.templateCache.sc2ConfigDialog;
			
			this.optionViews = {};
			this.sectionViews = {};
			
			this.on("ps.option.change", function (changed) {
				DDK.log("ps.option.change", changed);
				
				if (this.$editor && changed.id === "is_advanced_editor") {	
					this.renderEditor();
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
			this.model.getOptionGroup("dialog").collections.options.each(function (optionModel) {
				var optionView = new PS.Views.Navset2.Option({ model: optionModel, tagName: function () {
					return (optionModel.get("displayType").indexOf("abbr") > -1 ? "span" : "label")
				}, className: function () {
					return (optionModel.get("displayType").indexOf("button") > -1 ? "right" : "left")
				}});
				this.optionViews[optionModel.id] = optionView;
				optionView.render();
				this.$settings.append(optionView.$el);
			}.bind(this));
		},

		renderEditor: _.throttle(function () {
			DDK.log("PS.Views.Navset2.Set.renderEditor()");
			
			var isAdvancedEditor = this.model.val("is_advanced_editor"),
				config = _.string.parseJSON(this.$editor.find("textarea").val()) || this.model.toCamelizedObject({ includeEmpty: true });
			
			// new config comes from a textarea that is a direct child of $editor
			// or from building a config object from the model and collection
			// or from the original config object
			
			if (isAdvancedEditor) {
				// render JSON editor
				
			//	config = this.model.toCamelizedObject({ includeEmpty: true });
				
				$("<textarea>" + JSON.stringify(config, null, "\t") + "</textarea>").appendTo(this.$editor.empty()).editor({
					optionGroupModel: [(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.navset), (new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.nav), (new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.elem)]
				});
				this.resize();
				
				return;
			}

		}, 100, { leading: false, trailing: true }),
		
		reset: function (config) {
			// clear set config
			this.model.clear();
				
			if (config) {
				// initialize set config
				this.model.val(config);

			}
		},
		resize: function () {
			this.$el.data("ui-dialog")._trigger("resize");
		}
	});


	// Scorecard2 BuildColumns Handler
	DDK.eventHandler.ns2BuildSet = function (e) {
		function dialogResize(e) {
			var $this = $(this),
				$editor = $this.find(".sc-editor"),
				editor = $editor.find("textarea").data("editor"),
				$settings = $this.find(".sc-settings"),
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
				setView = new PS.Views.Navset2.Set({ el: $this.get(), model: setModel });

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
			setModel.setup(PS.optionsAPI.navset);

			setView.reset(config);

			setView.render();
			
			// initialize dialog options
			// the is* options are initialized after render so that their ps.option.change events will update the editor
			setModel.val({
				isAdvancedEditor: true		
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
				config = _.string.parseJSON($this.find(".sc-editor").find("textarea").val());
				if (!_.isPlainObject(config)) {
					alert("Invalid JSON");
					return;
				}
			} else {
//				config = data.configModel.getOptionGroup("scorecard_config_object_settings").toCamelizedObject();
//				config.columns = columnsCollection.map(function (columnModel) {
//					return columnModel.getOptionGroup("scorecard_column_config_object_settings").toCamelizedObject();
//				});
			}
			
			// set control keywords
			K({
				"con": DDK.escape.brackets(JSON.stringify(config))
			}, statePrefix);

			// reload scorecard
			DDK.reloadControl("navset2", id);
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
			$dialog = DDK.navset2.data[data.id].$dialog,
			config = data.config,
			columns = config && config.columns || [];
		
		DDK.loadTools().done(function () {			
			if (!$dialog) {
				DDK.navset2.data[data.id].$dialog = $dialog = $("<div/>").dialog({
					autoOpen: false,
					title: "Build Navset",
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
		});
	};
}
