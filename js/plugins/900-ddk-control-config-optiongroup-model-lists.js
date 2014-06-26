// DDK 2.2.0b2
// wrapping in a check for OptionGroup.setup
// to avoid breaking the Metric Input forms, which use a custom
// implementation of PS.MC.Models.OptionGroup
if (PS.MC.Models.OptionGroup && PS.MC.Models.OptionGroup.setup) {
	DDK.bamset2.configOptionGroupModels = [
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.bamset),
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.bam),
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.formatElement)
	];

	DDK.scorecard2.configOptionGroupModels = [
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.scorecard),
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.scorecardColumn)
	];

	DDK.navset2.configOptionGroupModels = [
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.navset),
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.nav),
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.navElem),
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.navElemConfig)
	];

	DDK.list.configOptionGroupModels = [
		(new PS.MC.Models.OptionGroup()).setup(PS.optionsAPI.list)
	];
}