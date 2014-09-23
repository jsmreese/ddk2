// attach window resize handler
$(window).on("resize", _.debounce(function () { $(document).findControls().resizeControls(); }, 250));

// do not close off-canvas menu when clicking on a select2 input
$(".left-off-canvas-menu").on("click", ".select2-choice", function (e) { 
	e.stopPropagation();
});