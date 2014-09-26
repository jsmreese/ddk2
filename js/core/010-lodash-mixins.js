(function(root) {
	var _ = root._;
	
	_.mixin({
		// _.delegator(cases, defaultCaseKey [, thisArg])
		// Returns a function object that acts as a delegator for a method look-up object.
		// Use as a configurable replacement for switch statements.
		//
		// cases: Required. Object containing method functions.
		// defaultCaseKey: Required. Name of key containing default method function.
		//		Default case is used when no case key is provided,
		//		or when provided case key is not found in cases object.
		// thisArg: Optional. "this" argument to be used as context for case method function evaluation.
		//
		// Returned delegator function uses its first argument as the case key.
		// All other arguments passed to the delegator function
		// are passed directly through to the delegate method.
		//
		// Inspired by and substantially copied from https://github.com/rwldrn/idiomatic.js/
		delegator: function(cases, defaultCaseKey, thisArg) {
			var delegator;

			// create delegator function
			delegator = function() {
				var args, caseKey, delegate;
				
				// transform arguments list into an array
				args = [].slice.call(arguments);
				
				// shift the case key from the arguments
				caseKey = args.shift();
				
				// assign default delegate
				delegate = cases[defaultCaseKey];
				
				// derive delegate method based on caseKey
				if (caseKey && cases[caseKey]) {
					delegate = cases[caseKey];
				}
				
				// thisArg is undefined if not supplied
				return delegate.apply(thisArg, args);
			};
			
			// add delegator methods
			// getter/setter methods to access delegator initialization parameters
			delegator.cases = function(obj) {
				if (!obj) {	return cases; } 
				cases = obj;
			};
			delegator.defaultCaseKey = function(key) {
				if (!key) {	return defaultCaseKey; } 
				defaultCaseKey = key;			
			};
			delegator.thisArg = function(obj) {
				if (!obj) {	return thisArg; } 
				thisArg = obj;			
			};
			
			// utility methods
			delegator.extendCases = function(obj) {
				_.extend(cases, obj);
			};
			delegator.hasCase = function(key) {
				return _.isFunction(cases[key]);
			};
			
			return delegator;
		},
		
		// _.collate(array, propertyName)
		// Will organize a flat array of items into an array of grouped arrays of items 
		// while maintaining the original array order.
		//
		// array: Required. The array of items to collate.
		// propertyName: Required. The propertyName on which to collate each item.
		//		propertyName argument may be a string, a number, a function,
		//		or an array of strings, numbers, and/or functions.
		//		If propertyName is a function, items will be grouped on the function return value.
		//		propertyName functions will be called with two arguemnts: item, index.
		collate: function (array, propertyName) {
			var keys = [].concat(propertyName),
				key = keys.shift(),
				result = [],
				group,
				lastValue;
			
			// return the array argument if key argument is null or undefined
			if (key == null) { return array; }
			
			// return an empty array if array argument is empty or null or undefined
			if (array == null || !array.length) { return result; }
			
			_.each(array, function (item, index) {
				// if item[key] does not match the last value, 
				// or if this is the first item, reset the group array
				if (!(index && (_.isFunction(key) ? key(item, index) : item[key]) === lastValue)) {
					// if this is not the first item, save the current group
					// and call collate on it if there are additional keys
					if (index) { result.push(keys.length ? _.collate(group, keys) : group); }
					group = [];
				}

				// push the current item onto the current group
				group.push(item);
				
				// set the cached lastValue to the current item
				lastValue = (_.isFunction(key) ? key(item, index) : item[key]);
			});
			
			// save the final group
			// call collate on it if there are additional keys
			result.push(keys.length ? _.collate(group, keys) : group);
			
			return result;
		},

		// _.guid()
		// Will return a rfc4122 version 4 compliant guid string.
		// Taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		guid: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},
		
		prune: function (object) {
			_.forOwn(object, function (value, key) {
				if (value === "" || (_.isPlainObject(value) && _.isEmpty(value))) {
					delete object[key];
				}
			});
			
			return object;
		},
		
		isRealNumber: function (num) {
			var n = +num;
			
			if (num == null || num === "") { return false; }
			
			return !isNaN(n) && isFinite(n);
		},
		
		isPositiveInteger: function (num) {
			var n = +num;

			if (num == null) { return false; }

			return !isNaN(n) && (Math.floor(n) === n) && n > 0;
		},
		
		// _.zipNestedObject(collection)
		//
		// Acts as the native _.zipObject on key/value pair arrays
		// except will execute the zipObject operation
		// on any arrays of sub key/value pair arrays found in the zipped object.
		// Function is called recursively until all sub key/value pair arrays are evaluated.
		//
		// _.zipNestedObject([["a", 1], ["b", [[["c", 3], ["d", 4]], [["e", 5], ["f", 6]]]]]);
		// --> { a: 1, b: [{ c: 3, d: 4 }, { e: 5, f: 6 }] }
		//
		// _.zipNestedObject([["a", 1], ["b", 2], ["c", [["d", 4]]]]);
		// --> { a: 1, b: 2, c: { d: 4 } }
		zipNestedObject: function (collection) {
			var result = _.zipObject(collection),
				iterator = function (value, key, obj) {
					// determine if `value` is a pairs array
					// or an array of pairs arrays
					if (_.isArray(value) && value.length) {
						if (_.isPairsArray(value)) {
							obj[key] = _.zipNestedObject(value);
						} else {
							_.each(value, function (value, key, obj) {
								obj[key] = _.zipNestedObject(value);
							});							
						}
					}
				};
			
			_.each(result, iterator);		
			
			return result;
		},
		
		isPairsArray: function (collection) {
			return _.isArray(collection) && _.all(collection, function (value, key) {
				return _.isArray(value) && value.length === 2 && typeof value[0] === "string";
			});
		},

		// _.hasData(array, key|index)
		// acts on datasets - arrays of record arrays or record objects
		// returns true if any of the record array/object values have data at the supplied index
		hasData: function (arr, key) {
			return _.any(arr, function (record) {
				var data = record[key];
				return data != null && data !== "";
			});
		},
		
		// _.hasNumericData(array, key|index)
		// acts on datasets - arrays of record arrays or record objects
		// returns true if the record array/object values have numeric data at the supplied index
		// numeric data is anything that can be coerced to a number, including an empty string and `null`
		// will run a hasData check to be sure that the field is not completely empty
		hasNumericData: function (arr, key) {
			return _.hasData(arr, key) && _.all(arr, function (record) {
				var data = +record[key];
				return data === 0 || data;
			});
		},
		
		// Dataset methods
		// methods for interacting with dataset objects returned by the Data Request Framework
		
		// toRecordObjects
		// converts a dataset containing record arrays into a dataset containing record objects
		// will modify the original dataset object, and will also return a reference to the dataset object
		toRecordObjects: function (dataset, settings) {
			var columns, rows, prefixLength;
			
			settings = _.defaults(settings || {}, {
				toCase: "lower",
				prefix: ""
			});
			
			columns = _.sortBy(dataset.columns, "index");
			rows = dataset.rows;
			prefixLength = settings.prefix.length;
				
			dataset.rows = _.map(rows, function (row) {
				return _.transform(columns, function (accumulator, column) {
					var name;
					
					name = column.name;
					
					if (prefixLength && _.string.startsWith(name, settings.prefix)) {
						name = name.slice(prefixLength);
					}
					
					accumulator[_.toCase(settings.toCase, name)] = row[column.index];
				}, {});
			});
			
			return dataset;
		},
		
		// toRecordArrays
		// converts a dataset containing record objects into a dataset containing record arrays
		// will modify the original dataset object, and will also return a reference to the dataset object
		toRecordArrays: function (dataset) {
			var columns = _.sortBy(dataset.columns, "index"),
				rows = dataset.rows;
				
			dataset.rows = _.map(rows, function (row) {
				row = _.toCase("lower", row);
				return _.transform(columns, function (accumulator, column) {
					accumulator.push(row[_.toCase("lower", column.name)]);
				}, []);
			});
			
			return dataset;
		}
	});
	
	_.mixin({
		createCaseConverter: _.curry(function (func, obj) {
			if (obj == null) {
				return "";
			}
			
			if (typeof obj === "string") {
				return func(obj);
			}
			
			return _.transform(obj, function (accumulator, value, key) {
				accumulator[func(key)] = value;
			}, {});
		}),
		
		// toUpperCase
		// will test that the toUpperCase method exists
		// then call it
		toUpperCase: function (str) {
			if (!str.toUpperCase) {
				return "";
			}
			
			return str.toUpperCase();
		},
		
		// toLowerCase
		// will test that the toLowerCase method exists
		// then call it
		toLowerCase: function (str) {
			if (!str.toLowerCase) {
				return "";
			}
			
			return str.toLowerCase();
		}
	});
})(this);
