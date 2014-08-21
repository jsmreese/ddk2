(function () {
	_.mixin({
		favTreeToOptionGroup: function (obj, topId, parentGroup) {
			var groupId, group;
			
			if (!obj) { return; }
			
			// setup top-level optionGroup
			if (!topId) {
				topId = obj.name;
			}
			
			// category records don't have values
			// these could be toolbars or groupings

			// favorite records have values
			// these could be toolbar buttons

			// create group or subgroup
			groupId = _.toCase("lower", (obj.name === topId ? obj.name : obj.name.replace(new RegExp("^" + topId + "\\_"), "")));
			
			group = _.extend({}, obj, { id: groupId });
			
			// overlay group.value
			if (group.value) {
				_.overlayValue(group);
			}
			
			// link from parent to child group
			if (parentGroup) {
				parentGroup[groupId] = group;
			}
		
			// create child groups
			_.each(obj.children, function (child) {
				_.favTreeToOptionGroup(child, topId, group);
			});
			
			return group;
		}
	});
})();
