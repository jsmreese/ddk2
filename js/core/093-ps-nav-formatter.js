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
		name: settings.name,
		styles: []
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

// register method for adding styles to the format styles array
PS.NavFormatter.registerStyle = function(settings) {
	var format = _.find(PS.NavFormatter.formats, { name: settings.parentName }),
		styles = format.styles;
	
	// verify that the format function is registered
	if (!format) {
		DDK.error("Unable to register format style. `Cannot find '" + settings.parentName + "' in PS.Formatter.formats.");
		return;
	}
	
	// add style to the styles array
	styles.push(settings);
	
	// sort styles array
	styles.sort(function (a, b) {
		return a.sortOrder - b.sortOrder;
	});
	
	// add style defaults to the formatter function
	PS.NavFormatter.fn[format.id][settings.id] = settings.defaults || {};		
};

PS.NavFormatter.fn.data = [];

PS.NavFormatter.fn.getSettings = function () {
	//if prefix is a date, add date default
	var dateSettings;
	if(this.nav && this.nav.substr(0, 4) === "date"){
		dateSettings = this.date.defaults;
	}
	return _.extend(
		// start with an empty object
		{},
		
		// add the global default format settings
		this.defaults,
		
		// add the default format settings for this format
		this[this.nav].defaults,

		// add the default format settings from this format style
		this[this.nav][this.navStyle],
		
		dateSettings,
		
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
	"pageSize": 50
};
PS.NavFormatter.fn.date = {};
PS.NavFormatter.fn.date.defaults = {
	dateFormat: "",	//defualt format depends on date type, set on initDate function
	altFormat: "",	//defualt format depends on date type, set on initDate function
	dateTypeHidden: false,	//hides the date type
	dateTypeDisabled: false,	//disables the date type
	typeDefault: "",		//default value of the date type
	dateStart: "",		//default value of the date start field
	dateEnd: "",		//default value of the date end field
	typeOptions: [],	//an array of json formatted {"label": "option1", "data-tp-type": "-5"}. The data-tp-type is the difference in current date
	changeMonth: true,	//enables changing the month, overriden in specific types
	changeYear: true,	//enables changing the year, overriden in specific types
	showButtonPanel: true,
	beforeShow: function(input, inst) {
		inst.dpDiv.removeClass("hide-calendar hide-month");
	},
	onClose: function (dateText, inst) {
		var selectedDate = inst.selectedYear.toString(), selectedMomentObj,
			settings = inst.settings,
			$dateContainer = inst.input.parent(),
			$dateStart = $dateContainer.find("input.nav-date-start"),
			$dateEnd = $dateContainer.find("input.nav-date-end");
		if(!inst.dpDiv.hasClass("hide-month")){
			selectedDate += "-" + _.string.lpad(inst.selectedMonth + 1, 2, "0");
		}
		if(!inst.dpDiv.hasClass("hide-calendar")){
			selectedDate += "-" + _.string.lpad(inst.selectedDay, 2, "0");
		}
		else{
			selectedDate += "-01";
		}
		selectedMomentObj = new moment(selectedDate, "YYYY-MM-DD");
		//set minDate and maxDate
		if(inst.input.hasClass("nav-date-start")){
			$dateEnd = inst.input.parent().find("input.nav-date-end");
			if(!($dateEnd.is(":visible") && moment($dateEnd.val(), settings.momentDateFormat).diff(selectedMomentObj) > 0)){//$dateEnd.val() > selectedDate)){
				//set same date if dateEnd is not visible to make it the same as start when user selects range
		//		$dateEnd.datepicker("setDate", new Date(selectedDate)).trigger("change");
			}
			if(!inst.dpDiv.hasClass("hide-calendar")){
				$dateEnd.datepicker("option", "minDate", new Date(selectedDate)).trigger("change");
			}
			
		}
		else if(inst.input.hasClass("nav-date-end")){
			if(!($dateStart.is(":visible") && moment($dateStart.val(), settings.momentDateFormat).diff(selectedMomentObj) < 0)){//$dateStart.val() < selectedDate)){
				$dateStart.datepicker("setDate", new Date(selectedDate)).trigger("change");
			}
			if(!inst.dpDiv.hasClass("hide-calendar")){
				$dateStart.datepicker("option", "maxDate", new Date(selectedDate)).trigger("change");
			}
		}
	}
};
PS.NavFormatter.fn.functions = {
	ajaxSetup: function (settings) {
		return {
			url: "amengine.aspx?config.mn=DDK_Data_Request",
			type: "POST",
			dataType: 'json',
			data: function (term, page, context) {					
				return $.extend({
						"data.config": JSON.stringify($.extend(settings, {"page": page, "term": term}))
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
	},
	initSelection: function (settings, element, callback) {
		var dataToPass = {}, newData, ids, selectedData;
		if(settings.queryWidget){
			$.extend(true, dataToPass, K.toObject("p_"), {
				"config.mn": "DDK_Data_Request",
				"filterColumn": settings.filterColumn,
				"columnPrefix": settings.columnPrefix,
				"data.config": JSON.stringify($.extend(true, {}, settings, {"id": element.val()}))
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
	},
	format: function(item) {
		var newItem = "",
			originalItem = item.element;
		if (item.icon) { newItem += "<img style='vertical-align: middle; margin-right: 5px; padding-bottom: 3px' src='" + item.icon + "'>"}
		if (typeof item.id === "undefined") { newItem += "<strong>"; }
		newItem += item.text; 
		if (typeof item.id === "undefined") { newItem += "</strong>"; }
		return newItem;
	},
	setData: function(dataToPush, isSearch, navFormatter){
		var modelData = navFormatter.data || [], filteredModelData, duplicates = [], filterField, filteredData;
		filteredModelData = _.reject(modelData, function(item, index){
			filterField = typeof(item.id) === "undefined" ? "text" : "id";
			if(_.contains(_.pluck(dataToPush, filterField), item[filterField])){
				duplicates.push(item[filterField]);
				return true;
			}
			else{
				return false;
			}
		});
		//remove duplicates on data
		filteredData = _.reject(dataToPush, function(item, index){
			return _.contains(duplicates, typeof(item.id) === "undefined" ? item.text : item.id );
		});
		if(isSearch){
			navFormatter.data = modelData.concat(filteredData);
			return dataToPush;
		}
		else{
			navFormatter.data = filteredModelData.concat(dataToPush);
			return filteredData;
		}
	},
	updateCache: function(options, navFormatter){
		options = options || {};
		var _this = this,
			term = options.term,
			id = options.id,
			callback = options.callback,
			callbackData = options.callbackData,
			dataToPass = {}, 
			modelData = navFormatter.data || [], 
			newData = [];
		options.page = options.page || 1;
		if(options.queryWidget){
			$.extend(true, dataToPass, K.toObject("p_"), {
				"config.mn": "DDK_Data_Request",
				"data.config": JSON.stringify(options)
			});
			$.ajax({
				type: "POST",
				url: "amengine.aspx", 
				data: dataToPass,
				dataType: "JSON",
				async: callback ? true : false,
				success: function(data) {
					var dataset = data && data.datasets && data.datasets[0],
						records = dataset && dataset.rows,
						optionGroup = "",
						result,
						valueWrapString = options.valueWrapString || "";
					if(records && records.length){
						_.each(records, function(item, index){
							if (!id && !term && typeof item.optgroup !== "undefined" && optionGroup !== item.optgroup) {
								newData.push({ text: item.optgroup });
								optionGroup = item.optgroup;
							}
							result = { text: item[1], id: valueWrapString + item[0] + valueWrapString };
							if (item.opticon) { result.icon = item.opticon };
							newData.push(result);
						});
						newData = _this.setData(newData, (term || id), navFormatter);
					}
					if(typeof(callback) === "function"){
						if(callbackData){	//for searching
							callbackData.results = newData;
							callbackData.more = callbackData.more || records.length === options.pageSize;
							navFormatter.more = callbackData.more;
							callback(callbackData);
						}
						else{	//for initselection
							if(options.multiple){
								if(newData){
									callback(newData);
								}
							}
							else{
								if(newData[0]){
									callback(newData[0]);
								}
							}
						}
					}
				}
			});
		}
		return newData || [];
	},
	localDataSetup: function(settings, navFormatter){
		var _this = this;
		return {
			initSelection: function (item, callback) {
				var ids = item.val().split(","),
					options = navFormatter.data || [],
					selectedOptions = _.filter(options, function(item){ return _.contains(ids, item.id)});
				if(settings.cached){
					//clear page 
					settings.page = "";
					selectedOptions = _this.updateCache($.extend({}, settings, {id: item.val(), callback: callback}), _this);
				}
				else if(selectedOptions && selectedOptions.length){
					if(settings.multiple){
						callback(selectedOptions);
					}
					else{
						callback(selectedOptions[0]);
					}
				}
			},
			query: function(query){
				var data = {results: []},
					options = settings.data || navFormatter.data || [],
					modelPage = navFormatter.currentPage,
					modelPageSize = settings.pageSize,
					modelDataSize = options.length,
					currentPage,
					dataLoaded = false;
				if(query.term){
					//if not all data has been loaded search in server
		//			if(modelDataSize < _this.model.get("totalPage")){
					if(settings.cached){
						delay(function(){
							settings.page = "";
							options = _this.updateCache($.extend({}, settings, {term: query.term, callback: query.callback, callbackData: data}), _this);
						}, 300);
					}
					else {
						_.each(options, function(o) {
							if(o.id && (o.id.toString().toLowerCase().indexOf(query.term) > -1 || o.text.toLowerCase().indexOf(query.term) > -1)){
								data.results.push(o);
							}
						});
						query.callback(data);
					}
				}
				else{
					//clear search term
				//	settings.term = "";
					//calculate current page to use
					if(query.page <= modelPage){
						currentPage = modelPage;
						if(query.page > 1){
							currentPage++;
						}
						else{
							dataLoaded = true;
						}
					}
					else{
						currentPage = query.page;
					}
					//store max page in model to avoid data retrieval redundancy
					navFormatter.currentPage = currentPage;
					
					//check if cached mode and needs to add data
					if(settings.cached){
						if(currentPage === 1 && !options.length){
							options = _this.updateCache($.extend({}, settings, {callback: query.callback, callbackData: data}), _this);
						}
						else{
							//for next page if data has not been loaded
							if(currentPage > 1 && !dataLoaded){
								options = _this.updateCache($.extend({}, settings, {page: currentPage, callback: query.callback, callbackData: data}), navFormatter);
							}
							else{
								data.more = navFormatter.more || options.length === settings.pageSize;
								data.results = options;
								query.callback(data);
							}
						}
						//combined cached/stored data to the new data
						if(navFormatter.data && !navFormatter.data.length){
							navFormatter.data = options;
						}
					}
					else{
						data.results = options;
						query.callback(data);
					}
				}
			}
		};
	},
	createDateType: function(type, settings){
		var elem = "",
			dateTypes = _.find(PS.NavFormatter.formats, function(format){
				return format.id === type;
			}),
			optionList = {
				"DAY": {
					"optgroup": "Daily",
					"options": [
						{
							"label": "Today",
							"tp-start-diff": "0",
							"order": 10
						}, 
						{
							"label": "Yesterday",
							"tp-start-diff": "-1",
							"order": 20
						},
						{
							"label": "Day",
							"order": 30
						},
						{
							"label": "Day Range",
							"order": 40
						}
					]
				},
				"WEEK": {
					"optgroup": "Weekly",
					"options": [
						{
							"label": "This Week",
							"tp-start-diff": "0",
							"order": 10
						},
						{
							"label": "Last Week",
							"tp-start-diff": "-1w",
							"order": 20
						},
						{
							"label": "Week",
							"order": 30
						},
						{
							"label": "Week Range",
							"order": 40
						}
					]
				},
				"MONTH": {
					"optgroup": "Monthly",
					"options": [
						{
							"label": "This Month",
							"tp-start-diff": "0",
							"order": 10
						},
						{
							"label": "Last Month",
							"tp-start-diff": "-1m",
							"order": 20
						},
						{
							"label": "Month",
							"order": 30
						},
						{
							"label": "Month Range",
							"order": 40
						}
					]
				},
				"QUARTER": {
					"optgroup": "Quarterly",
					"options": [
						{
							"label": "This Quarter",
							"tp-start-diff": "0",
							"order": 10
						},
						{
							"label": "Last Quarter",
							"tp-start-diff": "-3m",
							"order": 20
						},
						{
							"label": "Quarter",
							"order": 30
						},
						{
							"label": "Quarter Range",
							"order": 40
						}
					]
				},
				"YEAR": {
					"optgroup": "Yearly",
					"options": [
						{
							"label": "This Year",
							"tp-start-diff": "0",
							"order": 10
						},
						{
							"label": "Last Year",
							"tp-start-diff": "-1y",
							"order": 20
						},
						{
							"label": "Year",
							"order": 30
						},
						{
							"label": "Year Range",
							"order": 40
						}
					]
				}
			},
			createOption = function(optionType, optionData){
				var optionHtml = "";
				_.each(optionData, function(option, index){
					var value = option.value || option.text || option.label;
					value = value.replace(/ /g, "").toUpperCase();
					optionHtml += "<option data-tp-type=\"" + optionType.toUpperCase() + "\" value=\"" + value + "\" ";
					//add other data attributes
					_.each(option, function(attrValue, attr){
						if(attrValue){
							optionHtml += "data-" + attr + "=\"" + attrValue + "\" ";
						}
					});
					optionHtml += ">";
					optionHtml += option.text || option.label;
					optionHtml += "</option>";
				});
				return optionHtml;
			};
		elem += "<select class=\"nav-date-type medium-2\">";
/*		if(optionList[type.toUpperCase()]){ 
			if(settings.typeOptions && settings.typeOptions.length){
				optionList[type.toUpperCase()].options = optionList[type.toUpperCase()].options.concat(settings.typeOptions);
			}
			optionList[type.toUpperCase()].options = _.sortBy(optionList[type.toUpperCase()].options, function(item){
				return item.order;
			});
			_.each(optionList[type.toUpperCase()].options, function(option, index){
				var value = option.value || option.label.replace(/ /g, "").toUpperCase();
				elem += "<option data-tp-type=\"" + type.toUpperCase() + "\" value=\"" + value + "\" ";
				//add other attributes except label and value
				_.each(option, function(attrValue, attr){
					elem += "data-" + attr + "=\"" + attrValue + "\" ";
				});
				elem += ">";
				elem += option.label;
				elem += "</option>";
			});
		}
*/		if(dateTypes && dateTypes.styles.length){
			elem += createOption(dateTypes.id, dateTypes.styles);
/*			_.each(dateTypes.styles, function(option, index){
				var value = option.value || option.text || option.label;
				value = value.replace(/ /g, "").toUpperCase();
				elem += "<option data-tp-type=\"" + type.toUpperCase() + "\" value=\"" + value + "\" ";
				//add other data attributes
				_.each(option, function(attrValue, attr){
					elem += "data-" + attr + "=\"" + attrValue + "\" ";
				});
				elem += ">";
				elem += option.text || option.label;
				elem += "</option>";
			});
*/		}
		else{
			dateTypes = _.filter(PS.NavFormatter.formats, function(format){
				return format.id === "dateday" || format.id === "dateweek" || format.id === "datemonth" ||
					format.id === "datequarter" || format.id === "dateyear";
			})
			_.each(dateTypes, function(item, index){
				elem += "<optgroup label=\"" + item.text + "\">";
				elem += createOption(item.id, item.styles);
				elem += "</optgroup>";
			});
/*			_.each(optionList, function(typeOptions, dateType){
				elem += "<optgroup label=\"" + typeOptions.optgroup + "\">";
					_.each(typeOptions.options, function(option, index){
						var value = option.value || option.label.replace(/ /g, "").toUpperCase();
						elem += "<option data-tp-type=\"" + dateType.toUpperCase() + "\" value=\"" + value + "\" ";
						//add other attributes except label and value
						_.each(option, function(attrValue, attr){
							if(attr !== "value" && attr !== "label"){
								elem += attr + "=\"" + attrValue + "\" ";
							}
						});
						elem += ">";
						elem += option.label;
						elem += "</option>";
					});
				elem += "</optgroup>";
			});
*/		}
		elem += "</select>";
		return $(elem);
	},
	initDate: _.delegator({
		"DATEYEAR": function($field, settings){
			var options = _.extend({}, settings, {
				dateFormat: settings.dateFormat || "yy",
				altFormat: settings.altFormat || "yy",
				changeMonth: false,
				stepMonths: 12,
				beforeShow: function(input, inst) {
					inst.dpDiv.addClass("hide-calendar hide-month");
					if (this.value) {
						return {
							defaultDate: new Date(this.value, 1, 1)
						};
					}
				},
				onClose: _.wrap(settings.onClose, function (func, dateText, inst) {
					if(func){
						func(dateText, inst);
					}
					this.value = inst.selectedYear;
					$(this).trigger("change");
				})
			});
			$field.datepicker(options);
		},
		"DATEQUARTER": function($field, settings){
			var options = _.extend({}, settings, {
				dateFormat: settings.dateFormat || "yy-mm",
				altFormat: settings.altFormat || "yy-mm",		
				beforeShow: function(input, inst) {
					var val;
					
					inst.dpDiv.addClass("hide-calendar").removeClass("hide-month");
					
					if (this.value) {
						val = this.value.split("-");
						return {
		//					defaultDate: new Date(val[0], val[1] - 1, 1)
							defaultDate: new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)
						};
					}
				},
				onClose: _.wrap(settings.onClose, function (func, dateText, inst) {
					if(func){
						func(dateText, inst);
					}
					$(this).datepicker("setDate", moment(inst.selectedYear + "-" + _.string.lpad(inst.selectedMonth + 1, 2, "0"), "YYYY-MM").toDate()); //new Date(inst.selectedYear + "-" + _.string.lpad(inst.selectedMonth + 1, 2, "0")));
					$(this).trigger("change");
				})
			});
			$field.datepicker(options).on("change", function(e){
				//calculate week to set in hidden input
				var $this = $(this),
					value = $this.val(),
					momentObj = new moment(value, settings.momentDateFormat || "YYYY-MM"), 
					$altField,
					firstMonth = Math.floor((momentObj.month())/3) * 3;
				momentObj.set("month", firstMonth);
				if(value){
					$this.datepicker("setDate", momentObj.toDate());
					
					$altField = $this.data("alt-field");
					if($altField && $altField.length){
						$altField.val(momentObj.year() + "-Q" + Math.ceil((momentObj.month()+1)/3));
					}
				}
				else{
					$altField.val("");
				}
			});
		},
		"DATEMONTH": function($field, settings){
			settings.dateFormat = settings.dateFormat || "yy-mm";
			settings.altFormat = settings.altFormat || "yy-mm";
			settings.momentDateFormat = settings.momentDateFormat || "YYYY-MM";
			
			var options = _.extend({}, settings, {
				dateFormat: settings.dateFormat,
				altFormat: settings.altFormat,
				beforeShow: function(input, inst) {
					
					inst.dpDiv.addClass("hide-calendar").removeClass("hide-month");
					
					if (this.value) {
						return {
							defaultDate: new Date(inst.selectedYear, inst.selectedMonth, 1)
						};
					}
				},
				onClose: _.wrap(settings.onClose, function (func, dateText, inst) {
					if(func){
						func(dateText, inst);
					}
				//	this.value = inst.selectedYear + "-" + _.string.lpad(inst.selectedMonth + 1, 2, "0");
					$(this).datepicker("setDate", (new moment(inst.selectedYear + "-" + _.string.lpad(inst.selectedMonth + 1, 2, "0"), "YYYY-MM")).toDate());
					$(this).trigger("change");
				})
			});
			$field.datepicker(options);
		},
		"DATEWEEK": function($field, settings){
			var options = _.extend({}, settings, {
				altFormat: settings.altFormat || 'yy-mm-dd',
				dateFormat: settings.dateFormat || 'yy-mm-dd',
				showWeek: true,
				firstDay: 1,
				beforeShow: function(input, inst) {
					var val;
	
					inst.dpDiv.removeClass("hide-calendar hide-month");
	
					 // for week highighting
					$(document).on("mousemove", ".ui-datepicker-calendar tbody tr", function(e){
						$(this).find("td a").addClass("ui-state-hover")
							.end().find(".ui-datepicker-week-col").addClass("ui-state-hover");
					}).on("mouseleave", ".ui-datepicker-calendar tbody tr", function(e){
						$(this).find("td a").removeClass("ui-state-hover")
							.end().find(".ui-datepicker-week-col").removeClass("ui-state-hover");      
					});
					if (this.value) {
						val = this.value.split("-W");
						return {
						//	defaultDate: new Date(val[0], 1, val[1] * 7)
							defaultDate: new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)
						};
					}
				},
				onClose: _.wrap(settings.onClose, function (func, dateText, inst) {
					if(func){
						func(dateText, inst);
					}
					$(this).trigger("change");
				})
			});
			$field.datepicker(options).on("change", function(e){
				//calculate week to set in hidden input
				var $this = $(this),
					value = $this.val(),
					$altField = $this.data("alt-field"),
					selectedDate = new moment(value, settings.momentDateFormat),
					dayOfWeek = selectedDate.isoWeekday();
				//timeout is for ie8 to prevent reopening the datepicker panel
				setTimeout(function(){
					if(value){
						selectedDate.set("date", selectedDate.date() - dayOfWeek + 1);
						$this.datepicker("setDate", selectedDate.toDate());
						if($altField && $altField.length){
							$altField.val(selectedDate.format("YYYY-[W]WW"));
						}
					}
					else{
						$altField.val("");
					}
					$this.blur();
				}, 0);
			});
		},
		"DATEDAY": function($field, settings){
			var options = _.extend({}, settings, {
				altFormat: settings.altFormat || 'yy-mm-dd',
				dateFormat: settings.dateFormat || 'yy-mm-dd'
			});
			$field.datepicker(options);
		}
	}, "DATEDAY"),
	"mapDateFormat": function(momentFormat){
		var newFormat = momentFormat.toLowerCase(),
			formatMap = {
				"mmmm": "MM",	//full months name
				"mmm": "M",	//3-letter months name
				"dddd": "oo",	//day of the year two digit
				"ddd": "o",	//day of the year single digit
				"yy": "y"	//2-digit year
			};
		_.each(formatMap, function(datepickerFormat, momentFormat){
			newFormat = newFormat.replace(new RegExp(momentFormat, "g"), datepickerFormat);
		});
		return newFormat;
	},
	"createNavDate": function(type){
		var _this = this,
			momentDateFormat,
			settings = this.getSettings(), $dateType, 
			$hiddenType = $("<input type=\"hidden\" class=\"nav-hidden-date-type\"/>"),
			$hiddenDateStart = $("<input type=\"hidden\" class=\"nav-hidden-date-start\"/>"),
			$hiddenDateEnd = $("<input type=\"hidden\" class=\"nav-hidden-date-end\"/>"),
			$dateStart = $("<input type=\"text\" class=\"nav-date-start\"/>"), 
			$dateEnd = $("<input type=\"text\" class=\"nav-date-end\"/>"),
			$dateLabel = $("<label class=\"nav-date-label\">to</label>"),
			momentDefaultFormat = {
				"DATEDAY": "YYYY-MM-DD", 
				"DATEWEEK": "YYYY-MM-DD",
				"DATEMONTH": "YYYY-MM",
				"DATEQUARTER": "YYYY-MM",
				"DATEYEAR": "YYYY"
			};
		//add custom type class on dateStart and dateEnd
		$dateStart.addClass("nav-date-" + type.toLowerCase());
		$dateEnd.addClass("nav-date-" + type.toLowerCase());
		$dateType = this.functions.createDateType(type, settings);
		this.$el.append($dateType, $dateStart, $dateLabel, $dateEnd, $hiddenType, $hiddenDateStart, $hiddenDateEnd);
		//add hidden inputs on data of correspoinding field
		$dateStart.data("alt-field", $hiddenDateStart);
		$dateEnd.data("alt-field", $hiddenDateEnd);
		//map moment's format to datepicker format
		if(settings.dateFormat){
			momentDateFormat = settings.dateFormat;
			settings.momentDateFormat = momentDateFormat;
			//get the corresponding date format from the moment format
			settings.dateFormat = _this.functions.mapDateFormat(settings.dateFormat);
		}
		//type change event
		$dateType.on("change", function(e){
			var $this = $(this),
				value = $this.val(),
				dateToday = new moment(),
				$selectedOption = $this.find("option:selected"),
				type = $selectedOption.data("tp-type"),
				optionData = $selectedOption.data(),
				startValue,
				endValue;
			;
			if($selectedOption.length){
				startValue = optionData.tpStartDiff;
				endValue = optionData.tpEndDiff || startValue;
				$dateStart.add($dateEnd).add($dateLabel).show();
				//destroy datepicker and reset onchange event 
				$dateStart.add($dateEnd).datepicker("destroy").off("change");
				//set default format if not specified
				if($hiddenType.data("tp-type") && type !== $hiddenType.data("tp-type")){
					settings.momentDateFormat = momentDefaultFormat[type];
					settings.dateFormat = _this.functions.mapDateFormat(settings.momentDateFormat);
					settings.altFormat = settings.dateFormat
				}
				else{
					settings.momentDateFormat = settings.momentDateFormat || momentDefaultFormat[type];
					settings.dateFormat = settings.dateFormat || _this.functions.mapDateFormat(settings.momentDateFormat);
					settings.altFormat = settings.altFormat || settings.dateFormat
				}
				settings.altField = _this.$el.find(".nav-hidden-date-start");
				_this.functions.initDate(type, $dateStart, settings);
				if($dateStart.val()){
					$dateStart.datepicker("setDate", moment($dateStart.val(), settings.momentDateFormat).toDate());
				}
				settings.altField = _this.$el.find(".nav-hidden-date-end");
				_this.functions.initDate(type, $dateEnd, settings);
				if($dateEnd.val()){
					$dateEnd.datepicker("setDate", moment($dateEnd.val(), settings.momentDateFormat).toDate());
				}
				//clear date values if date type has changed
				if($hiddenType.data("tp-type") && type !== $hiddenType.data("tp-type")){
					$dateStart.datepicker("setDate", "");
					$dateEnd.datepicker("setDate", "");	
				}
				
				//if date fields are blank and no user defined default value, set it to current date
				if(!$dateStart.val() && typeof(startValue) === "undefined"){
					startValue = "0";
				}
				//set value of dateStart and dateEnd
				if(typeof(startValue) !== "undefined"){
					$dateStart.datepicker("setDate", startValue.toString()).trigger("change");
				}
				//if date fields are blank set it to current date
				if(!$dateEnd.val() && typeof(endValue) === "undefined"){
					endValue = "0";
				}
				//set value of dateStart and dateEnd
				if(typeof(endValue) !== "undefined"){
					$dateEnd.datepicker("setDate", endValue.toString()).trigger("change");
				}
				if(typeof(optionData.showTpStart) !== "undefined" && !optionData.showTpStart){
					//hide date end and label
					$dateStart.hide();
				}
				if(!optionData.showTpEnd){
					//hide date end and label
					$dateLabel.add($dateEnd).hide();
				}
				else if(type === "DATEDAY" || type === "DATEWEEK"){	//if selection is a DAY and not a range set min and max dates
					$dateEnd.datepicker("option", "minDate", moment($dateStart.val(), settings.momentDateFormat).toDate()).trigger("change");
				}
				$hiddenType.data("tp-type", type).val(value);
			}
		});
		//set types value if user specified
		if(settings.typeDefault){
			$dateType.val(settings.typeDefault);
		}
		$dateType.trigger("change");
		//set value for datestart and dateend field
		if(settings.dateStart || settings.dateEnd){
			if(settings.dateStart){
				$dateStart.datepicker("setDate", moment(settings.dateStart, momentDateFormat).toDate()).trigger("change");
			}
			if(settings.dateEnd){
				$dateEnd.datepicker("setDate", moment(settings.dateEnd, momentDateFormat).toDate()).trigger("change");
			}
		}
		//disable date type if set by user
		if(settings.dateTypeDisabled){
			$dateType.attr("disabled", "disabled");
		}
		//hide data type if set by user
		if(settings.dateTypeHidden){
			$dateType.hide();
		}
		$($dateStart).add($dateEnd).on("keyup", function(e){
			setTimeout(_.bind(function(){
				var c = e.which ? e.which : e.keycode,
					$this = $(this),
					inst = $.datepicker._getInst(e.target),
					$hiddenField = $this.data("altField"),
					$dateYear = $("#ui-datepicker-div").find(".ui-datepicker-year:visible"),
					$dateMonth = $("#ui-datepicker-div").find(".ui-datepicker-month:visible"),
					dateMoment = new moment($this.val(), settings.momentDateFormat);
				if(dateMoment.isValid()){
					inst.drawMonth = dateMoment.month();
					inst.drawYear = dateMoment.year();
					inst.currentMonth = dateMoment.month();
					inst.currentYear = dateMoment.year();
					inst.selectedMonth = dateMoment.month();
					inst.selectedYear = dateMoment.year();
					$.datepicker._updateDatepicker(inst);
				}
			}, this), 200);
		});
		if(settings.targetKeyword){
			var keywords = settings.targetKeyword.split(",");
			
			this.$el.on("change", ".nav-date-type", function(e){
				var $dateDiv = $(this).parent();
				K(keywords[0], $(this).val());
				$dateDiv.find(".nav-date-start").trigger("change");
				$dateDiv.find(".nav-date-end").trigger("change");
			});
			this.$el.on("change", ".nav-date-start", function(e){
				K((keywords[1] || keywords[0]).trim(), $(this).val());
			});
			this.$el.on("change", ".nav-date-end", function(e){
				K((keywords[2] || keywords[0]).trim(), $(this).val());
			});
			//trigger date type change to set keywords default values
			this.$el.find(".nav-date-type").trigger("change");
		}
	}
};
PS.NavFormatter.fn.select2 = function () {
	var localThis = this, settings = this.getSettings(), $treeChooser, qtipOptions;
	//add tree chooser button
	if(!this.$el.is("select")){
			if(settings.queryWidget && !settings.cached){
//		if(settings.queryWidget){
			$.extend(settings, {
				ajax: this.functions.ajaxSetup(settings),
				initSelection : function(element, callback){
					this.functions.initSelection(settings, element, callback);
				}.bind(this)
			});
		}
			else{
			$.extend(settings, this.functions.localDataSetup(settings, this));
		}
			$.extend(settings, {
			formatSelection: this.functions.format,
			formatResult: this.functions.format
		});
	}
	this.$el.select2(settings);
	if(settings.targetKeyword){
		this.$el.on("change", function(e){
			K(settings.targetKeyword, $(this).val());
		});
	}
};


PS.NavFormatter.fn.dateday = function () {
	this.functions.createNavDate.call(this, "dateday");
};
PS.NavFormatter.fn.dateweek = function () {
	this.functions.createNavDate.call(this, "dateweek");
};
PS.NavFormatter.fn.datemonth = function () {
	this.functions.createNavDate.call(this, "datemonth");
};
PS.NavFormatter.fn.datequarter = function () {
	this.functions.createNavDate.call(this, "datequarter");
};
PS.NavFormatter.fn.dateyear = function () {
	this.functions.createNavDate.call(this, "dateyear");
};
PS.NavFormatter.fn.dateany = function () {
	this.functions.createNavDate.call(this, "dateany");
};

PS.NavFormatter.fn.checkbox = function () {
	var settings = this.getSettings();
	if(settings.targetKeyword){
		this.$el.on("change", function(e){
			var $this = $(this), value = $this.is(":checked");
			if($this.val() && $this.is(":checked")){
				value = $this.val()
			}
			K(settings.targetKeyword, value);
		});
	}
};

PS.NavFormatter.fn.radio = function () {
	var settings = this.getSettings();
	if(settings.targetKeyword){
		this.$el.on("change", function(e){
			var $this = $(this), value = $this.is(":checked");
			if($this.val() && $this.is(":checked")){
				value = $this.val()
			}
			K(settings.targetKeyword, value);
		});
	}
};
PS.NavFormatter.fn.input = function () {
	var settings = this.getSettings();
	if(settings.targetKeyword){
		this.$el.on("change", function(e){
			K(settings.targetKeyword, $(this).val());
		});
	}
};
// need to regiter nav formatter functions, too
PS.NavFormatter.register({
	id: "select2",
	text: "Dropdown",
	sortOrder: 200,
	name: "Select2"
});
PS.NavFormatter.register({
	id: "input",
	text: "Input",
	sortOrder: 300,
	name: "Input"
});
PS.NavFormatter.register({
	id: "checkbox",
	text: "Checkbox",
	sortOrder: 400,
	name: "Checkbox"
});
PS.NavFormatter.register({
	id: "radio",
	text: "Radio",
	sortOrder: 500,
	name: "Radio"
});