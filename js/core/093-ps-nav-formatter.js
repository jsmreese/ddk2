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
	// if the format function does not exist
	// register it anyway, as the datecustom function will be used
	if (typeof PS.NavFormatter.fn[settings.id] !== "function") {
		PS.NavFormatter.fn[settings.id] = function () {
			PS.NavFormatter.fn.datecustom.call(this);
		};
		DDK.log("`PS.NavFormatter.fn." + settings.id + "` is not a function. `" + settings.id + "` will redirect to `datecustom`.");
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
	var customSettings, dimensions;
	dimensions = "mcat metric org loc contact fcat fav event_cat event offering_cat offering extdim".split(" ");
	if(this.nav && this.nav.substr(0, 4) === "date"){
		customSettings = this.date.defaults;
	}
	else if(dimensions.indexOf(this.nav) > -1){
		customSettings = this.dimquery.defaults;
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
		
		customSettings,
		
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
PS.NavFormatter.fn.dimquery = {};
PS.NavFormatter.fn.dimquery.defaults = {
	queryWidget: "SCIDIM_Query",
	allowClear: "true",
	placeholder: "All",
	valueField: "name",
	labelField: "label",
	emptyKeywordValue: "ANY",
	searchKeyword: "p_dimq_search",
	initKeyword: "p_dimq_list"
};
PS.NavFormatter.fn.date = {};
PS.NavFormatter.fn.date.defaults = {
	dateFormat: "",	//defualt format depends on date type, set on initDate function
	altFormat: "",	//defualt format depends on date type, set on initDate function
	hideDateType: false,	//hides the date type
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
	//temp disable			$dateEnd.datepicker("option", "minDate", moment(selectedDate).toDate()).trigger("change");
			}
			
		}
		else if(inst.input.hasClass("nav-date-end")){
			if(!($dateStart.is(":visible") && moment($dateStart.val(), settings.momentDateFormat).diff(selectedMomentObj) < 0)){//$dateStart.val() < selectedDate)){
				$dateStart.datepicker("setDate", moment(selectedDate).toDate()).trigger("change");
			}
			if(!inst.dpDiv.hasClass("hide-calendar")){
	//temp disable			$dateStart.datepicker("option", "maxDate", moment(selectedDate).toDate()).trigger("change");
			}
		}
	}
};
PS.NavFormatter.fn.functions = {
	getColumnIndex: function(columns, field, isSuffix){
		var column;
		if(field){
			column = _.find(columns, function(item, index){
				if(isSuffix){
					return item.metricAttr.toLowerCase() === field.toLowerCase();
				}
				else{
					return item.name.toLowerCase() === field.toLowerCase();
				}
			});
			return (column && column.index) || -1;
		}
	},
	ajaxSetup: function (settings) {
		var navFormatter = this;
		return {
			url: "amengine.aspx?config.mn=DDK_Data_Request",
			type: "POST",
			dataType: 'json',
			data: function (term, page, context) {
				var dataToPass = {};
				//map term to search keyword
				if(term && settings.searchKeyword){
					dataToPass[settings.searchKeyword] = term;
				}
				return $.extend({
						"data.config": JSON.stringify($.extend(settings, {"page": page, "term": term}))
					}, dataToPass, K.toObject("p_")
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
				valueIndex = navFormatter.getColumnIndex(dataset.columns, valueField) || navFormatter.getColumnIndex(dataset.columns, "name", true);
				labelIndex = navFormatter.getColumnIndex(dataset.columns, labelField) || navFormatter.getColumnIndex(dataset.columns, "label", true);
				groupIndex = navFormatter.getColumnIndex(dataset.columns, groupField);
				iconIndex = navFormatter.getColumnIndex(dataset.columns, iconField);
				if (records && records.length) {
					_.each(records, function (record) {
						if (groupIndex > -1 && optionGroup !== record[groupIndex]) {
							results.push({ text: record[groupIndex] });
							optionGroup = record[groupIndex];
						}
						result = {
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
		var dataToPass = {}, ids, selectedData = [], labelArr, valArr, navFormatter = this, text, wrappedValue;
		text = settings.label || K(settings.targetKeyword + "_label");
		//if label is specified, display label and skip server retrieval
		if(text){
			//remove settings.label to allow succeeding set of value to go to the database
			settings.label = undefined;
			if(settings.multiple && text.indexOf(",") > -1){
				labelArr = text.split(",");
				valArr = (settings.value || K(settings.targetKeyword)).split(",");
				_.each(labelArr, function(item, index){
					if(valArr[index]){
						selectedData.push({id: _.string.trim(valArr[index]), text: _.string.trim(item)});
					}
				});
				callback(selectedData);
			}
			else{
				callback({id: _.string.trim(settings.value || K(settings.targetKeyword)), text: _.string.trim(text)});
			}
		}
		else{
			if(settings.queryWidget || settings.queryModule){
				//map initKeyword to the value
				if(element.val() && settings.initKeyword){
					dataToPass[settings.initKeyword] = element.val();
				}
				//add single quote wrap if options id does not have one since in SCIDIM_Query it requires all NaN to be wrapped in single quote
				if(element.val() && isNaN(element.val()) && element.val().indexOf("'") < 0 && settings.queryWidget === "SCIDIM_Query"){
					wrappedValue = "'" + element.val() + "'";
				}
				$.extend(true, dataToPass, K.toObject("p_"), {
					"config.mn": "DDK_Data_Request",
					"filterColumn": settings.filterColumn,
					"columnPrefix": settings.columnPrefix,
					"data.config": JSON.stringify($.extend(true, {}, settings, {"id": wrappedValue || element.val()}))
				});
				$.post("amengine.aspx", dataToPass, 
					function(data) {
						var dataset = data && data.datasets && data.datasets[0],
							records = dataset && dataset.rows,
							results = [],
							valueWrapString = settings.valueWrapString || "",
							valueIndex, labelIndex;
						if(records && records.length){
							//if value and label field is specified, use it
							valueIndex = navFormatter.getColumnIndex(dataset.columns, settings.valueField) || navFormatter.getColumnIndex(dataset.columns, "name", true);
							labelIndex = navFormatter.getColumnIndex(dataset.columns, settings.labelField) || navFormatter.getColumnIndex(dataset.columns, "label", true);
							selectedData = _.map(records, function(record, key){
								return {"id": record[valueIndex], "text": record[labelIndex]};
							});
						}
						if(settings.multiple){
							if(selectedData && selectedData.length === 0){
								//if there's no corresponding label display the value instead.
								selectedData.push({id: data.config.id, text: data.config.id});
							}
							callback(selectedData);
						}
						else{
							if(!selectedData[0]){
								//if there's no corresponding label display the value instead.
								selectedData.push({id: data.config.id, text: data.config.id});
							}
							callback(selectedData[0]);
						}
						return;
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
		var _this = this, wrappedValue,
			term = options.term,
			id = options.id,
			callback = options.callback,
			callbackData = options.callbackData,
			dataToPass = {}, 
			modelData = navFormatter.data || [], 
			newData = [],
			valueField = options.valueField,
			labelField = options.labelField,
			groupField = options.groupField,
			iconField = options.iconField,
			arrayValue;
		options.page = options.page || 1;
		if(options.queryWidget || options.queryModule){
			//map initKeyword to the value
			if(id && options.initKeyword){
				dataToPass[options.initKeyword] = id;
			}
			//add single quote wrap if options id does not have one since in SCIDIM_Query it requires all NaN to be wrapped in single quote
			if(options.id && isNaN(options.id) && options.id.indexOf("'") < 0 && options.queryWidget === "SCIDIM_Query"){
				wrappedValue = "'" + options.id + "'";
			}
			//check if the value is in the cached data
			if(options.id && navFormatter.data && navFormatter.data.length){
				arrayValue = [];
				if(options.id.indexOf(",") > -1){
					_.each(options.id.split(","), function(value, index){
						arrayValue.push(_.string.trim(value));
					});
				}
				else{
					arrayValue.push(wrappedValue || options.id);
				}
				newData = _.filter(navFormatter.data, function(data, index){
					return arrayValue.indexOf(data.id) > -1;
				});
				if(newData && newData.length){
					if(newData.length > 1){
						callback(newData);
					}
					else{
						callback(newData[0]);
					}
					return newData;
				}
			}
			//check if the value has a corresponding label passed by the user
			if(options.targetKeyword && K(options.targetKeyword) && K(options.targetKeyword + "_label")){
				newData.push({
					id: options.valueWrapString + K(options.targetKeyword) + options.valueWrapString,
					text: K(options.targetKeyword + "_label")
				});
				if(newData && newData.length){
					if(newData.length > 1){
						callback(newData);
					}
					else{
						callback(newData[0]);
					}
					return newData;
				}
			}
			$.extend(true, dataToPass, K.toObject("p_"), {
				"config.mn": "DDK_Data_Request",
				"data.config": JSON.stringify($.extend(true, {}, options, {"id": wrappedValue || options.id}))
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
					newData = [];
					if(records && records.length){
						//if value and label field is specified, use it
						valueIndex = _this.getColumnIndex(dataset.columns, valueField) || _this.getColumnIndex(dataset.columns, "name", true);
						labelIndex = _this.getColumnIndex(dataset.columns, labelField) || _this.getColumnIndex(dataset.columns, "label", true);
						groupIndex = _this.getColumnIndex(dataset.columns, groupField);
						iconIndex = _this.getColumnIndex(dataset.columns, iconField);
						_.each(records, function(record, index){
							if (!id && !term && groupIndex > -1 && optionGroup !== record[groupIndex]) {
								newData.push({ text: record[groupIndex] });
								optionGroup = record[groupIndex];
							}
							result = { 
								id: valueWrapString + record[valueIndex > -1 && valueIndex || 0] + valueWrapString,
								text: record[labelIndex > -1 && labelIndex || 1]
							};
							if (iconIndex && record[iconIndex]) { 
								result.icon = record[iconIndex]; 
							}
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
								if(newData && newData.length === 0){
								//	callback(newData);
									//if there's no corresponding label display the value instead.
									newData.push({id: data.config.id, text: data.config.id});
								}
								callback(newData);
							}
							else{
								if(!newData[0]){
								//	callback(newData[0]);
									//if there's no corresponding label display the value instead.
									newData.push({id: data.config.id, text: data.config.id});
								}
								callback(newData[0]);
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
					options = settings.data || [],
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
							options = _this.updateCache($.extend({}, settings, {callback: query.callback, callbackData: data}), navFormatter);
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
			dateTypes,
			createOption = function(optionData){
				var optionHtml = "";
				_.each(optionData, function(option, index){
					var value = option.value;
					
					if(value){
						value = value.toUpperCase();
						optionHtml += "<option value=\"" + value + "\" ";
						//add other data attributes
						_.each(option, function(attrValue, attr){
							if(attrValue){
								optionHtml += "data-" + attr + "=\"" + attrValue + "\" ";
							}
						});
						optionHtml += ">";
						optionHtml += option.text || option.label;
						optionHtml += "</option>";
					}
				});
				return optionHtml;
			};
		elem += "<select class=\"nav-date-type medium-2\">";
		//if type is a date custom expect a dateCustomType target
		if(type === "datecustom"){
			if(settings.dateCustomType && typeof(settings.dateCustomType) === "string"){
				type = settings.dateCustomType;
			}
			else if(settings.dateCustomType instanceof Array){
				dateTypes = {"styles": settings.dateCustomType};
			}
		}
		dateTypes = dateTypes ? dateTypes : _.findWhere(PS.NavFormatter.formats, {id: type});
		if(dateTypes && dateTypes.styles.length){
			elem += createOption(dateTypes.styles);
		}
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
		}
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
			momentDateFormat, keywords, keywordValues,
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
				typeVal = value ? value.split("_")[0] : "",	//parse value to get type <TYPE>_<KEY>, type should be a CMQ tp_type DAY,WEEK,MONTH,QUARTER,YEAR
				hiddenTypeVal = $hiddenType.val().split("_")[0],	//hidden type is used to check if the date format should be changed like from day to month
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
				if(optionData.dateFormat){
					settings.momentDateFormat = optionData.dateFormat
					settings.dateFormat = _this.functions.mapDateFormat(optionData.dateFormat);
					settings.altFormat = optionData.altFormat || settings.dateFormat;
				}
				else if(hiddenTypeVal && typeVal !== hiddenTypeVal){
					settings.momentDateFormat = momentDefaultFormat["DATE" + typeVal];
					settings.dateFormat = _this.functions.mapDateFormat(settings.momentDateFormat);
					settings.altFormat = settings.dateFormat
				}
				else{
					settings.momentDateFormat = settings.momentDateFormat || momentDefaultFormat["DATE" + typeVal];
					settings.dateFormat = settings.dateFormat || _this.functions.mapDateFormat(settings.momentDateFormat);
					settings.altFormat = settings.altFormat || settings.dateFormat
				}
				settings.altField = _this.$el.find(".nav-hidden-date-start");
				_this.functions.initDate("DATE" + typeVal, $dateStart, settings);
				if($dateStart.val()){
					$dateStart.datepicker("setDate", moment($dateStart.val(), settings.momentDateFormat).toDate());
				}
				settings.altField = _this.$el.find(".nav-hidden-date-end");
				_this.functions.initDate("DATE" + typeVal, $dateEnd, settings);
				if($dateEnd.val()){
					$dateEnd.datepicker("setDate", moment($dateEnd.val(), settings.momentDateFormat).toDate());
				}
				//clear date values if date type has changed
				if(hiddenTypeVal && typeVal !== hiddenTypeVal){
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
				else if(typeVal === "DAY" || typeVal === "WEEK"){	//if selection is a DAY and not a range set min and max dates
	//temp disable				$dateEnd.datepicker("option", "minDate", moment($dateStart.val(), settings.momentDateFormat).toDate()).trigger("change");
				}
				$hiddenType.val(value);
			}
			else{
				DDK.error("Date Type change: No valid date type selected");
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
		//hide data type if set by user, dateTypeHidden is an old option deprecated
		if(settings.hideDateType || settings.dateTypeHidden){
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
			var keywords = settings.targetKeyword.split(/,| /);
			
			this.$el.on("change", ".nav-date-type", function(e){
				var $this = $(this),
					$dateDiv = $this.parent();
				//arguments[1] is a flag if true do not update keyword which means triggered manually in the ddk keywordupdate handler
				if($this.is(":visible") && !arguments[1]){	
					K(keywords[0], $this.val());
				}
				$dateDiv.find(".nav-date-start").trigger("change");
				$dateDiv.find(".nav-date-end").trigger("change");
			});
			this.$el.on("change", ".nav-date-start", function(e){
				//if type dropdown is hidden use first target keyword
				//arguments[1] is a flag if true do not update keyword which means triggered manually in the ddk keywordupdate handler
				if(!arguments[1]){
					if(_this.$el.find(".nav-date-type:visible").length){
						K(_.string.trim(keywords[1]), $(this).val());
					}
					else{
						K(_.string.trim(keywords[0]), $(this).val());
					}
				}
			});
			this.$el.on("change", ".nav-date-end", function(e){
				//if type dropdown is hidden use third target keyword
				//arguments[1] is a flag if true do not update keyword which means triggered manually in the ddk keywordupdate handler
				if(!arguments[1]){
					if(_this.$el.find(".nav-date-type:visible").length){
						K(_.string.trim(keywords[2]), $(this).val());
					}
					else{
						K(_.string.trim(keywords[1]), $(this).val());
					}
				}
			});
			//store keyword values to be set after the type change
			keywordValues = {};
			_.each(keywords, function(item, index){
				keywordValues[item] = K(item);
			});
			//trigger date type change to set keywords default values
			if($dateType.is(":visible") && keywords[0]  && keywordValues[keywords[0]]){
				$dateType.val(keywordValues[keywords[0]]);
			}
			$dateType.trigger("change");
			if(keywords[2] && keywordValues[keywords[2]]){
				$dateEnd.val(keywordValues[keywords[2]]).trigger("change");
			}
			if(keywords[1] && keywordValues[keywords[1]]){
				if($dateType.is(":visible")){
					$dateStart.val(keywordValues[keywords[1]]).trigger("change");
				}
				else{
					$dateEnd.val(keywordValues[keywords[1]]).trigger("change");
				}
			}
			if(keywords[0] && keywordValues[keywords[0]]){
				if($dateType.is(":hidden")){
					$dateStart.val(keywordValues[keywords[0]]).trigger("change");
				}
			}
		}
	}
};
PS.NavFormatter.fn.mcat = function () {
	var keywords, filterKeywordMap, settings;
	filterKeywordMap = {
		"metric": "p_mcat",
		"contact": "p_org",
		"loc": "p_org",
		"fav": "p_fcat",
		"event": "p_event_cat",
		"offering": "p_offering_cat"
	};
	keywords = this.$el.data("navKeywords");
	//the default dimensions settings is retrieved in this.getSettings()
	settings = _.reduce(_.extend({}, DDK.navset2.defaultSelect2Options, this.getSettings(), {
		"filterKeyword": filterKeywordMap[this.nav] || "",
		"type": this.nav,
		"targetKeyword": "p_" + this.nav,
		"valueField": this.nav + (this.nav === "extdim" ? "_value" : "_name"),
		"labelField": this.nav + (this.nav === "extdim" ? "_value" : "_label"),
		"keywords": "&p_dimq_type=" + (this.nav === "metric" ? "m" : this.nav) + (keywords || "")
	}), function(memo, value, key){memo[_.string.camelize("nav_"+key)] = value; return memo;}, {});
	if(this.nav === "extdim"){
		if(settings.navExtdim){
			if(isNaN(settings.navExtdim) && settings.navExtdim.indexOf("'") < 0){
				settings.navExtdim = "'" + settings.navExtdim + "'";
			}
			settings.navKeywords = "&p_extdim_list=" + settings.navExtdim + settings.navKeywords;
		}
	}
	else{
		settings.navKeywords = "&p_dimq_hierarchy_level=99" + settings.navKeywords;
	}
	this.$el.data(settings);
	if(settings.navTargetKeyword){	//need to set target keyword attribute since it is needed on keywordupdate handler to set the value
		this.$el.attr("data-nav-target-keyword", settings.navTargetKeyword);
	}
	this.$el.attr("data-nav", "select2").data("nav", "select2");
	this.nav = "select2";
	DDK.navFormat(this.$el);
};
PS.NavFormatter.fn.metric = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.org = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.contact = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.loc = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.fcat = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.fav = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.event_cat = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.event = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.offering_cat = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.offering = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.extdim = PS.NavFormatter.fn.mcat;
PS.NavFormatter.fn.select2 = function () {
	var localThis = this, 
		settings = $.extend(true, {}, DDK.navset2.defaultSelect2Options, this.getSettings()), 
		$treeChooser, 
		qtipOptions;
	//add tree chooser button
	if(!this.$el.is("select")){
		if((settings.queryWidget || settings.queryModule) && !settings.cached){
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
	if(settings.targetKeyword){
		this.$el.on("change", function(e){
			var $this, val, selected, keywordLabel;
			$this = $(this);
			val = $this.val();
			
			if (settings.emptyKeywordValue && !val) {
				K(settings.targetKeyword, settings.emptyKeywordValue);
				return;
			}
			K(settings.targetKeyword, $this.val());
			//update shadow keyword label
			selected = $this.parent().find(".select2-choice span");
			if(selected && selected.length){	//for single
				keywordLabel = selected.text();
			}
			else{	//for multiple
				keywordLabel = "";
				$this.parent().find(".select2-search-choice").each(function(){
					keywordLabel += $(this).find("div").text() + ",";
				});
				if(keywordLabel){
					//remove last comma
					keywordLabel = keywordLabel.substr(0, keywordLabel.length-1);
				}
			}
			if(keywordLabel){
				K(settings.targetKeyword + "_label", keywordLabel);
			}
		});
		//just update keyword instead of changing because change event is for the actual changing of option
		if(this.$el.val()){
			K(settings.targetKeyword, this.$el.val());
		}
		else {
			//set keyword value if it has a value and if there is no value in the input
			if(K(settings.targetKeyword) &&  K(settings.targetKeyword) != settings.emptyKeywordValue){
				this.$el.val(K(settings.targetKeyword));
			}
			else if(settings.emptyKeywordValue){	
				K(settings.targetKeyword, settings.emptyKeywordValue);
			}
		}
	}
	this.$el.select2(settings);
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
PS.NavFormatter.fn.datecustom = function () {
	this.functions.createNavDate.call(this, "datecustom");
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
/*
$(document).ready(function(){
	//collect initial values for select2 to make a single batch request
	PS.NavFormatter.select2InitValues = [];
	$("input[data-nav=select2]").each(function(){
		var $this, settings, targetKeyword, defaultValue;
		$this = $(this);
		settings = _.reduce(_.pick($this.data(), function (value, key) {
			return key !== "nav" && _.string.startsWith(key, "nav");
		}), function (accumulator, value, key) {
			accumulator[_.string.camelize(key.slice(3))] = value;
			return accumulator;
		}, {});
		defaultValue = $this.val() || K(settings.targetKeyword);
		if(!defaultValue){
			return;
		}
		PS.NavFormatter.select2InitValues.push(_.extend({}, settings, {"id": defaultValue}));
		$this.attr("hasDefaultValue", "").val("");	//temporarily set an attr flag to be used later when setting the value
		//temporarily empty targetKeyword
		K(settings.targetKeyword, "");
	});
	if(PS.NavFormatter.select2InitValues && PS.NavFormatter.select2InitValues.length){
		$.post("amengine.aspx", $.extend(true, {}, K.toObject("p_"), {
				"config.mn": "DDK_Data_Request",
				"data.config": JSON.stringify(PS.NavFormatter.select2InitValues).replace(/\[/g, "\\[").replace(/\]/g, "\\]")
			}), 
			function(data) {
				var dataset, records, results, valueWrapString, valueIndex, labelIndex;
				//loop through the nav controls with default value. the hasDefaultValue flag was set by code above
				$("input[hasDefaultValue]").each(function(index, item){
					var $this, settings, selectedData;
					$this = $(this);
					settings = _.reduce(_.pick($this.data(), function (value, key) {
						return key !== "nav" && _.string.startsWith(key, "nav");
					}), function (accumulator, value, key) {
						accumulator[_.string.camelize(key.slice(3))] = value;
						return accumulator;
					}, {});
					dataset = data && data.datasets && data.datasets[index];
					records = dataset && dataset.rows;
					valueWrapString = settings.navValueWrapString || "";
					$this.removeAttr("hasDefaultValue");
					if(records && records.length){
						//if value and label field is specified, use it
						valueIndex = PS.NavFormatter.fn.functions.getColumnIndex(dataset.columns, settings.valueField) || PS.NavFormatter.fn.functions.getColumnIndex(dataset.columns, "name", true);
						labelIndex = PS.NavFormatter.fn.functions.getColumnIndex(dataset.columns, settings.labelField) || PS.NavFormatter.fn.functions.getColumnIndex(dataset.columns, "label", true);
						selectedData = _.map(records, function(record, key){
							return {"id": record[valueIndex], "text": record[labelIndex]};
						});
						if(settings.multiple){
							if(selectedData && selectedData.length === 0){
								//if there's no corresponding label display the value instead.
								selectedData.push({id: data.config.id, text: data.config.id});
							}
							$this.select2("data", selectedData);
						}
						else{
							if(!selectedData[0]){
								//if there's no corresponding label display the value instead.
								selectedData.push({id: data.config.id, text: data.config.id});
							}
							$this.select2("data", selectedData[0]);
							//set keyword value
							if(settings.targetKeyword){
								K(settings.targetKeyword, selectedData[0].id)
							}
						}
					}
				});
				return;
			}, "json");
	}
});*/