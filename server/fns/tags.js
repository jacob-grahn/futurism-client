module.exports = {

    /**
     *
     * @param {string} str
     * @returns {string[]}
     */
    parseTags: function(str) {
        var arr = str.split(',');
        var tags = _.map(arr, function(tag) {
            tag = sanitize(tag).trim();
            if(factions.abilityLookup[tag]) {
                return null;
            }
            if(factions.abilityNameLookup[tag]) {
                return null;
            }
            if(factions.factionLookup[tag]) {
                return null;
            }
            if(tag.indexOf('user:') === 0) {
                return null;
            }
            return tag;
        });
    }
};