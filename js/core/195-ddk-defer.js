DDK.info("DDK Core Script Loaded");DDK.pluginsLoad = jQuery.Deferred().done(function () { DDK.info("DDK Plugins Script Loaded"); });DDK.addonsLoad = jQuery.Deferred();DDK.resourcesLoad = jQuery.Deferred().done(function () { DDK.info("DDK Content Loaded"); });DDK.loadScript = function () {	return $.loadScript.apply(null, arguments);};DDK.curriedDefer = _.curry(function (name, func) {	_.defer(function () { DDK[name + "Load"].done(func); });});DDK.deferPlugins = DDK.curriedDefer("plugins");DDK.deferAddons = DDK.curriedDefer("addons");DDK.allLoad = $.when(DDK.pluginsLoad, DDK.addonsLoad, DDK.resourcesLoad);DDK.defer = function (func) {	DDK.allLoad.done(func);};