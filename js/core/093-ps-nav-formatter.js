PS.NavFormatter = function (el) {
		function exec() {
			var formatter = this.nav && this[this.nav],
				formattedValue;
				
			if (typeof formatter === "function") {
				formattedValue = formatter.call(this);
			}
				
			if (formattedValue != null) {
				this.$el.html(formattedValue);
			}
			
			this.$el.removeAttr("data-nav");
		}
		
		var $el = $(el);
	
		// there can be only one element
		if ($el.length > 1) { throw "PS.NavFormatter matched more than one element." }
		if (!$el.length) { throw "PS.NavFormatter did not match any elements." }
	
		// extend the formatter object
		// with all of the data attributes from 
		// this element and all parent elements
		_.extend(this, _.pick($el.dataStack(), function (value, key) {
			return _.string.startsWith(key, "nav");
		}));
		
		// setup element references
		this.$el = $el;
		this.el = $el.get(0);
		
		// create exec function reference
		this.exec = exec;
	};
	
	// create a jQuery-esque reference to the PS.NavFormatter prototype
	PS.NavFormatter.fn = PS.NavFormatter.prototype;
	
	// formats array to be used as a datasource for UI (structured for Select2)
	PS.NavFormatter.formats = [];
	
	// register method for adding formats to the formats array
	PS.NavFormatter.register = function (settings) {
		// verify that the format function exists
		if (typeof PS.NavFormatter.fn[settings.id] !== "function") {
			DDK.error("Unable to register formatter. `PS.NavFormatter.fn." + settings.id + "` is not a function.");
			return;
		}
		
		// add format to the formats array
		PS.NavFormatter.formats.push({
			id: settings.id,
			text: settings.text,
			sortOrder: settings.sortOrder,
			name: settings.name
		});
		
		// sort formats array
		PS.NavFormatter.formats.sort(function (a, b) {
			return a.sortOrder - b.sortOrder;
		});
		
		// add defaults to the formatter function
		PS.NavFormatter.fn[settings.id].defaults = settings.defaults || {};
		
		// set default format
		if (!PS.NavFormatter.defaultFormat || settings.isDefaultFormat) {
			PS.NavFormatter.defaultFormat = settings.id;
		}
	};
	
	PS.NavFormatter.fn.getSettings = function () {
		return _.extend(
			// start with an empty object
			{},
			
			// add the global default format settings
			this.defaults,
			
			// add the default format settings for this format
			this[this.nav].defaults,
			
			// override with any data-format attributes from the data stack
			// remove the 'format' prefix and camelize the remaining name
			_.reduce(_.pick(this, function (value, key) {
				return key !== "nav" && _.string.startsWith(key, "nav");
			}), function (accumulator, value, key) {
				accumulator[_.string.camelize(key.slice(3))] = value;
				return accumulator;
			}, {})
		);
	};
	
	PS.NavFormatter.fn.defaults = {
		// add default NavFormatter options here
	};
	
	// default nav formatter functions
	PS.NavFormatter.fn.select2 = function () {
		var localThis = this, settings = this.getSettings(), $treeChooser, qtipOptions;
		//add tree chooser button
/*		if(settings.treeChooser){
			$treeChooser = $("<button class=\"ddk-icon ps-tree-chooser\">&#484;</button>");
			this.$el.after($treeChooser);
			qtipOptions = {
				suppress: false,
				position: {
					my: "top center",
					at: "bottom center",
					adjust: {
						y: -4
					},
				},
				content: {
					text: "", // placeholder for generated content
					button: "close"
				},
				show: {
					effect: false,
					event: "click"
				},
				hide: {
					effect: false,
					event: "click"
				},
				style: {
					classes: "ui-tooltip-bootstrap ui-tooltip-rounded toolbar"
				},
				events: {
					show: function(){
						if($("#psc_tree_select2chooser_widget").children().length === 0){
							DDK.tree.reload("select2chooser", function(e){
								$("#select2chooser").css("max-height", "").find("li>a").on("click", function(e){
									localThis.$el.select2("val", 
								});
							});
						}
					}
				}
			};
			qtipOptions.content.text = "<div style=\"overflow: auto; width: 250px; height: 300px\">";
			qtipOptions.content.text += "<div id=\"psc_tree_select2chooser_widget\" style=\"height: 100%;\" data-options=\"__Nav_Framework_Tree_Options\"></div>";
			qtipOptions.content.text += "</div>";
			$treeChooser.button().qtip(qtipOptions);
		}
		//select elements cannot have remote data designed by select2
*/		if(!this.$el.is("select")){
			if(settings.queryWidget){
				$.extend(settings, {
					ajax: this.ajaxSetup(settings)
				});
			}
			$.extend(settings, {
				initSelection : function(element, callback){
					this.initSelection(settings, element, callback);
				}.bind(this),
				formatSelection: this.format,
				formatResult: this.format
			});
		}
		this.$el.select2(settings);
	};
	
	// need to regiter nav formatter functions, too
	PS.NavFormatter.register({
		id: "select2",
		text: "Dropdown",
		sortOrder: 200,
		name: "Select2"
	});
	PS.NavFormatter.fn.ajaxSetup = function (settings) {
		return {
			url: "amengine.aspx?config.mn=DDK_Data_Request",
			type: "POST",
			dataType: 'json',
			data: function (term, page, context) {
				var dataConfig = {
					"queryWidget": settings.queryWidget,
					"page": page,
					"pageSize": settings.pageSize
				};
				
				return $.extend({
						"data.config": JSON.stringify(dataConfig)
					}, K.toObject("p_")
				);
			}.bind(this),
			results: function (data, page) {
				var dataset = data && data.datasets && data.datasets[0],
					records = dataset && dataset.rows,
					results = [], result, valueIndex, labelIndex, groupIndex, iconIndex,
					valueField = settings.valueField,
					labelField = settings.labelField,
					groupField = settings.groupField,
					iconField = settings.iconField,
					optionGroup,
					valueWrapString = settings.valueWrapString || "",
					getColumnIndex = function(field, isSuffix){
						var column;
						if(field){
							column = _.find(dataset.columns, function(item, index){
								if(isSuffix){
									return item.metricAttr.toLowerCase() === field.toLowerCase();
								}
								else{
									return item.name.toLowerCase() === field.toLowerCase();
								}
							});
							return (column && column.index) || -1;
						}
					};
				//if value and label field is specified, use it
				valueIndex = getColumnIndex(valueField) || getColumnIndex("name", true);
				labelIndex = getColumnIndex(labelField) || getColumnIndex("label", true);
				groupIndex = getColumnIndex(groupField);
				iconIndex = getColumnIndex(iconField);
				if (records && records.length) {
					_.each(records, function (record) {
						if (groupIndex > -1 && optionGroup !== record[groupIndex]) {
							results.push({ text: record[groupIndex] });
							optionGroup = record[groupIndex];
						}
						result = {
							// convention:
							// 'id' is always the first field
							// 'text' is always the second field
							id: valueWrapString + record[valueIndex > -1 && valueIndex || 0] + valueWrapString,
							text: record[labelIndex > -1 && labelIndex || 1]
						};
						if(iconIndex && record[iconIndex]){
							result.icon = record[iconIndex];
						}
						results.push(result);
					});
				}
				
				return { results: results, more: results.length === settings.pageSize };
			},
			quietMillis: 300
		};
	};
	PS.NavFormatter.fn.initSelection = function (settings, element, callback) {
		var dataToPass = {}, newData, ids, selectedData;
		if(settings.queryWidget){
			K(settings.queryKeywords); // read data-keywords and do a keyword update
			$.extend(true, dataToPass, K.toObject("p_"), {
				"config.mn": "DDK_Data_Request",
				"filterTerm": element.val(),
				"filterColumn": settings.filterColumn,
				"columnPrefix": settings.columnPrefix,
				"data.config": JSON.stringify({
					"queryWidget": settings.queryWidget, // query widget
				})
			});
			$.post("amengine.aspx", dataToPass, 
				function(data) {
					var dataset = data && data.datasets && data.datasets[0],
						records = dataset && dataset.rows,
						results = [],
						valueWrapString = settings.valueWrapString || "";
					if(records && records.length){
						newData = _.map(records, function(record, key){
							return {"id": record[0], "text": record[1]};
						});
						if(settings.multiple){
							callback(newData);
						}
						else{
							callback(newData[0]);
						}
					}
				}, "json");
		}
		else{
			ids = element.val().split(",");
			selectedData = _.filter(settings.data, function(item){ return _.contains(ids, item.id)});
			if(settings.multiple){
				callback(selectedData);
			}
			else{
				callback(selectedData[0]);
			}
		}
	};
	PS.NavFormatter.fn.format = function(item) {
		var newItem = "",
			originalItem = item.element;
		if (item.icon) { newItem += "<img style='vertical-align: middle; margin-right: 5px; padding-bottom: 3px' src='" + item.icon + "'>"}
		if (typeof item.id === "undefined") { newItem += "<strong>"; }
		newItem += item.text; 
		if (typeof item.id === "undefined") { newItem += "</strong>"; }
		return newItem;
	};
	PS.NavFormatter.fn.date = function () {
		var settings = this.getSettings();
		this.$el.datepicker(settings);
	};