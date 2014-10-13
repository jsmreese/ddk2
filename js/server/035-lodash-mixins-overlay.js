(function () {
	_.mixin({
		overlay: function (obj, property) {
			var temp;

			if (!obj) { return null; }
			
			temp = _.clone(obj[property]);
			delete obj[property];
			
			return _.extend(obj, temp);
		}
	});

	_.mixin({
		overlayValue: function (obj) {
			return _.overlay(obj, "value");
		}
	});
})();