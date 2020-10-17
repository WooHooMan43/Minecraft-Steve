var _ = require('lodash');
var rules = {
    color: {
	    '§0': 'black',
	    '§1': 'dark-blue',
	    '§2': 'dark-green',
	    '§3': 'dark-acqua',
	    '§4': 'dark-red',
	    '§5': 'dark-purple',
	    '§6': 'gold',
	    '§7': 'gray',
	    '§8': 'dark-gray',
	    '§9': 'blue',
	    '§a': 'green',
	    '§b': 'acqua',
	    '§c': 'red',
	    '§d': 'light-purple',
	    '§e': 'yellow',
	    '§f': 'white',
	},
    weight: {
    	'§l': 'bold',
    },
    special: {
    	'§k': 'magic',
    },
    decoration: {
    	'§m': 'line-through',
    	'§n': 'underline',
    },
    style: {
    	'§o': 'italic',
    }
};

module.exports = {

	parse: function (string, callback) {

		// Checks
		if (typeof string !== 'string') {
			return callback('Invalid MOTD provided: Must be a string');
		}

		var res = [];
        var cursor = -1;

        function addString (cursor, string) {
            if (cursor === -1) {
                cursor++;
            }
            if (res[cursor]) {
                res[cursor].string += string;
            } else {
                res[cursor] = {rules: {}, string: string};
            }
        }

		// Loop through the string
		// If we encounter a rule, we start a new object collecting
		// all applying rules and the string
		// Rules within an array replace each other
		// §r will remove all rules and create a blank object

		for (var i = 0; i < string.length; i++) {
            if (string[i] === '§') {
                var testString = string[i] + string[i + 1];
                if (testString === '§r') {
                    res[++cursor] = {rules: {}, string: ''};
                    // Rule matched, move 1 one more
                    i++;
                } else {
                    var ruleMatch = matchRule(testString);
                    if (ruleMatch) {
                        var newRules = res[cursor] ? _.clone(res[cursor].rules) : {};
                        newRules[ruleMatch.type] = ruleMatch.rule;
                        res[++cursor] = {rules: newRules, string: ''};
                        // Rule matched, move 1 one more
                        i++;
                    } else {
                        // We're using no known § rule, just append it as string
                        addString(cursor, string[i]);
                    }
                }
            } else {
                addString(cursor, string[i]);
            }
		};

		callback(null, res);

	}

};

function matchRule (string) {
	for (var type in rules) {
        if (rules[type][string]) {
            return {type: type, rule: rules[type][string]};
        }
    }
    return null;
}
