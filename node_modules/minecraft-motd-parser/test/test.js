var expect = require('chai').expect;
var parser = require('../index.js');

var strings = {
	regular: "Hey I'm a super normal string. I have some punctuation: § will not change.",
	colors: "§00 §11 §22 §33",
    heavy: "§nMinecraft Formatting \n"+
           "§r§00 §11 §22 §33 \n"+
           "§44 §55 §66 §77 \n"+
           "§88 §99 §aa §bb \n"+
           "§cc §dd §ee §ff \n"+
           "§r§0k §kMinecraft \n"+
           "§rl §lMinecraft \n"+
           "§rm §mMinecraft \n"+
           "§rn §nMinecraft \n"+
           "§ro §oMinecraft \n"+
           "§rr§§ §rMinecraft \n"
};

describe('motd-parser', function() {

  	describe('inputs', function () {

	    it('should always fail if not provided a string', function (done) {
	    	parser.parse({}, function (err, result) {
	    		done(!err);
	    	})
	    });

	    it('should never fail when provided a string', function (done) {
	    	parser.parse("Some string", done);
	    });


  	});

  	describe('outputs', function () {

	    it('should return an array', function (done) {
	    	parser.parse("", function (err, result) {
	    		if (err) throw err;

	    		expect(result).to.be.a("array");

	    		done();
	    	});
	    });

  	});


  	describe('conversions', function () {

	    it('should not modify normal strings', function (done) {
	    	parser.parse(strings.regular, function (err, result) {
	    		if (err) throw err;

	    		expect(result).to.deep.equal([{rules: {}, string: strings.regular}]);

	    		done();
	    	});
	    });

	    describe('MOTD tests: ', function () {

            it('converts simple color string', function (done) {
                parser.parse(strings.colors, function (err, result) {
                    if (err) throw err;
                    expect(result).to.deep.equal([
                        {rules: {color: "black"}, string: '0 '},
                        {rules: {color: "dark-blue"}, string: '1 '},
                        {rules: {color: "dark-green"}, string: '2 '},
                        {rules: {color: "dark-acqua"}, string: '3'},
                    ]);
                    done();
                });
            });

            it('converts a complex string with newlines and all rules', function (done) {
                parser.parse(strings.heavy, function (err, result) {
                    if (err) throw err;
                    expect(result).to.deep.equal([
                      { rules: { decoration: 'underline' }, string: 'Minecraft Formatting \n' },
                      { rules: {}, string: '' },
                      { rules: { color: 'black' }, string: '0 ' },
                      { rules: { color: 'dark-blue' }, string: '1 ' },
                      { rules: { color: 'dark-green' }, string: '2 ' },
                      { rules: { color: 'dark-acqua' }, string: '3 \n' },
                      { rules: { color: 'dark-red' }, string: '4 ' },
                      { rules: { color: 'dark-purple' }, string: '5 ' },
                      { rules: { color: 'gold' }, string: '6 ' },
                      { rules: { color: 'gray' }, string: '7 \n' },
                      { rules: { color: 'dark-gray' }, string: '8 ' },
                      { rules: { color: 'blue' }, string: '9 ' },
                      { rules: { color: 'green' }, string: 'a ' },
                      { rules: { color: 'acqua' }, string: 'b \n' },
                      { rules: { color: 'red' }, string: 'c ' },
                      { rules: { color: 'light-purple' }, string: 'd ' },
                      { rules: { color: 'yellow' }, string: 'e ' },
                      { rules: { color: 'white' }, string: 'f \n' },
                      { rules: {}, string: '' },
                      { rules: { color: 'black' }, string: 'k ' },
                      { rules: { color: 'black', special: 'magic' }, string: 'Minecraft \n' },
                      { rules: {}, string: 'l ' },
                      { rules: { weight: 'bold' }, string: 'Minecraft \n' },
                      { rules: {}, string: 'm ' },
                      { rules: { decoration: 'line-through' }, string: 'Minecraft \n' },
                      { rules: {}, string: 'n ' },
                      { rules: { decoration: 'underline' }, string: 'Minecraft \n' },
                      { rules: {}, string: 'o ' },
                      { rules: { style: 'italic' }, string: 'Minecraft \n' },
                      { rules: {}, string: 'r§§ ' },
                      { rules: {}, string: 'Minecraft \n' } ]);
                    done();
                });
            });

	    });

  	});

});
