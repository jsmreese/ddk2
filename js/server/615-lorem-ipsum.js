function loremIpsum(settings) {
	function random(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	var text, length, min, max;
	
	settings = _.extend({
		length: "medium"
	}, settings);
	
	switch (settings.length) {
		case "large":
			min = 0.8;
			max = 1;
			break;
		case "small":
			min = 0.05;
			max = 0.2;
			break;
		default:
			min = 0.4;
			max = 0.6;
	}
	
	text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".split(" ");
	length = random(min, max) * text.length + 1;
	
	return "<p class='lorem-ipsum'>" + text.slice(0, length).join(" ").replace(/(\.|,)$/, "") + ".</p>";
}