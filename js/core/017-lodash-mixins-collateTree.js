(function (undefined) {
	function isRootNode(id, parentId, item, index, array) {
		// return all root nodes that have no parentId
		// or that have a parentId that is not found as an item id in the array
		return !item[parentId] || !_.find(array, function (obj) {
			// == comparison intended so that string and numeric ids will match
			return item[parentId] == obj[id];
		});
	}
	
	function isChildNode(id, parentId, item) {
		// return all nodes that are children of the supplied parent item
		return item[parentId] == this[id];
	}
	
	function isUnique(id, array) {
		return array.length === _.unique(array, id).length;
	}
	
	function findId(ids, record) {
		var match;
		
		_.each(ids, function (id) {
			var camelCaseId, snakeCaseId;
			
			if (record.hasOwnProperty(id)) {
				match = id;
				return false;
			}
			
			camelCaseId = _.toCase("camel", id);
			if (record.hasOwnProperty(camelCaseId)) {
				match = camelCaseId;
				return false;
			}
			
			snakeCaseId = _.toCase("snake", id);
			if (record.hasOwnProperty(snakeCaseId)) {
				match = snakeCaseId;
				return false;
			}
		});
	
		return match;
	}
	
	function collate(config, array, parent) {
		var items;

		// find all root items
		// - those with a parentId that doesn't appear as an item id in the array (stops loop structures)
		// - or those that do not have a parentId
		// or find all matching child items
		// - those with a parentId matching the supplied parent object
		items = _.filter(array, parent ? config.isChildNode : config.isRootNode, parent);
		
		_.each(items, function (item, index) {	
			// this check stops loop structures on root nodes with id of `0`, "", `null`, or `undefined`
			if (item[config.id]) {
				item.children = collate(config, array, item);
				return;
			}
			
			item.children = [];
		});
		
		return items;	
	}		
	
	_.mixin({
		// _.collateTree(array, settings)
		// Will organize a flat array of item objects into a nested structure of parent/child items.
		// Uses configurable id and parent id properties of each item object to generate an array of item children.
		// Will throw an error if a circular structure is found (if an item ever appears in the list of its own ancestors),
		// or if there are multiple instances of the same id.
		// Items with parent id of `0`, `null`, or `undefined` will be treated as root nodes.
		//
		// array: Required. The array of items to convert to a tree.
		// settings: Optional. Settings object configuring functions options
		// - id: string. Default 'tree_id id'. Property name to be used for each record's id.
		// - parentId: string. Default 'tree_parent_id parent_id'. Property name to be used for each record's parent id.
		//    Both id and parentId may be a space-separated list of multiple property names to check.
		//    camelCased and snake_cased versions of each id and parent id property name will be checked.
		collateTree: function (array, settings) {
			var config = {};
			
			// return an empty array if array argument is empty or null or undefined
			if (array == null || !array.length) { return []; }

			// find id and parent id
			settings = _.extend({}, {
				id: "tree_id id",
				parentId: "tree_parent_id parent_id"
			}, settings);
			
			config.id = findId(settings.id.split(" "), array[0]);
			config.parentId = findId(settings.parentId.split(" "), array[0]);

			// throw error if there is no id or parent id propery
			if (!config.id) { throw "collateTree: cannot find id. settings.id: " + settings.id; }
			if (!config.parentId) { throw "collateTree: cannot find parentId. settings.parentId: " + settings.parentId; }
			
			// setup config object
			config.isChildNode = _.partial(isChildNode, config.id, config.parentId);
			config.isRootNode = _.partial(isRootNode, config.id, config.parentId);
			config.isUnique = _.partial(isUnique, config.id);
			
			// throw error if there are duplicate id values
			if (!config.isUnique(array)) { throw "collateTree: array ids are not unique. id: " + config.id; }
			
			return collate(config, array);
		}
	});	
})();