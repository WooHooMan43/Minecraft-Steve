MOTD parser
======================================================

```javascript
var parser = require('minecraft-motd-parser');
var motd = "§00 §11 §22 §33";

parser.parse(motd, function (err, result) {
    /* result
     *  [{rules: {color: "black"}, string: '0 '},
     *   {rules: {color: "dark-blue"}, string: '1 '},
     *   {rules: {color: "dark-green"}, string: '2 '},
     *   {rules: {color: "dark-acqua"}, string: '3'}]
     */
});
