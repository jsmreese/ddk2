(function (undefined) {
	function isRootNode(item, index, array) {
		// return all root nodes that have no parentId
		// or that have a parentId that is not found as an item id in the array
		return !item.parentId || !_.find(array, function (obj) {
			// == comparison intended so that string and numeric ids will match
			return item.parentId == obj.id;
		});
	}
	
	function isChildNode(item) {
		// return all nodes that are children of the supplied parent item
		return item.parentId == this.id;
	}

	_.mixin({
		// _.collateTree(array)
		// Will organize a flat array of item objects into a nested structure of parent/child items.
		// Uses the `id` and `parentId` properties of each item object to generate an array of item `children`.
		// Will throw an error if a circular structure is found (if an item ever appears in the list of its own ancestors).
		// Items with `parentId` of `0`, `null`, or `undefined` will be treated root nodes.
		//
		// array: Required. The array of items to convert to a tree.
		//
		// parent: Optional. Used internally as the parent item for a sub-tree.
		collateTree: function (array, parent) {
			var items;
			
			// return an empty array if array argument is empty or null or undefined
			if (array == null || !array.length) { return result; }

			// find all root items
			// - those with a parentId that doesn't appear as an item id in the array (stops loop structures)
			// - or those that do not have a parentId
			// or find all matching child items
			// - those with a parentId matching the supplied parent object
			items = _.filter(array, parent ? isChildNode : isRootNode, parent);
			
			_.each(items, function (item, index) {
				item.parent = parent;
				
				// this check stops loop structures on root nodes with id of `0`, "", `null`, or `undefined`
				if (item.id) {
					item.children = _.collateTree(array, item);
					return;
				}
				
				item.children = [];
			});
			
			return items;
		}
	});	
})();