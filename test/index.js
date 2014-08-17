'use strict';

var expect = require('chai').expect,
	ruler = require('..');

describe( 'Ruler constructor', function () {

	var context = new ruler.Context( 'uno' );
	it( 'add itself to ruler.contexts', function () {
		expect( ruler.contexts.uno ).to.exist;
		expect( ruler.contexts.uno ).to.be.a('object');
	});

	it( 'has correct structure', function () {
		expect( ruler.contexts.uno.roles ).to.exist;
		expect( ruler.contexts.uno.roles ).to.be.a('object');
		expect( ruler.contexts.uno.actions ).to.exist;
		expect( ruler.contexts.uno.actions ).to.be.a('object');
		expect( ruler.contexts.uno.resources ).to.exist;
		expect( ruler.contexts.uno.resources ).to.be.a('object');
	});
});