DDK.eval = _.compose(DDK.escape.brackets, DDK.evalScriptBlocks, evalKeywordValue, DDK.unescape.tildes, DDK.unescape.brackets);