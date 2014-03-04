// define overlib() and nd() so that calls to these functions will produce
// friendly DDK errors rather than raw JavaScript errors
function overlib() {
	DDK.error("overlib is not enabled. To enable overlib, use the DDK Configuration Dashboard: amengine.aspx?config.mn=DDK2_Config");
}

function nd() {
	DDK.error("overlib is not enabled. To enable overlib, use the DDK Configuration Dashboard: amengine.aspx?config.mn=DDK2_Config");
}