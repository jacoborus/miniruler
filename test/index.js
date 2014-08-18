'use strict';

var expect = require('chai').expect,
	ruler = require('..');

describe( 'miniruler', function () {

	it( 'has correct structure', function () {
		expect( ruler.roles ).to.exist;
		expect( ruler.roles ).to.be.a('object');
		expect( ruler.actions ).to.exist;
		expect( ruler.actions ).to.be.a('object');
		expect( ruler.contexts ).to.exist;
		expect( ruler.contexts ).to.be.a('object');
	});
});


describe( 'setRole', function () {

	it( 'requires a string as keyname', function () {
		expect( function () {
			ruler.setRole( );
		}).to.throw( 'Role name is required to set a role' );

		expect( function () {
			ruler.setRole( 1 );
		}).to.throw( Error );
	});

	it( 'requires a number as level', function () {
		expect( function () {
			ruler.setRole( 1 );
		}).to.throw( Error );
	});

	ruler.setRole( 'uno' );

	it( 'set role with its name in its context.roles', function () {
		expect( ruler.roles.uno ).to.exist;
	});

	it( 'add 1 as default level', function () {
		expect( ruler.roles.uno ).to.equal(1);
	});

	it( 'add role with its level', function () {
		ruler.setRole( 'dos', 2 );
		expect( ruler.roles.dos ).to.equal(2);
	});
});


describe( 'setRoles', function () {

	it( 'requires a object as param', function () {
		expect( function () {
			ruler.setRoles( );
		}).to.throw( 'setRoles requires a object as param' );

		expect( function () {
			ruler.setRoles( 2 );
		}).to.throw( 'setRoles requires a object as param' );
	});

	it( 'set roles from object', function () {
		var roles = {
			admin: 5,
			autor: 3,
			member: 1
		};
		ruler.setRoles( roles );
		expect( ruler.roles.admin ).to.equal(5);
	});
});


describe( 'removeRoles', function () {

	it( 'remove a single role', function () {
		ruler.setRole( 'testsinglerole', 3 );
		ruler.removeRoles( 'testsinglerole' );
		expect( ruler.roles.testsinglerole ).to.not.exist;
	});

	it( 'remove multiple roles', function () {
		ruler.setRole( 'multirol1', 3 );
		ruler.setRole( 'multirol2', 3 );
		ruler.removeRoles([ 'multirol1', 'multirol2' ]);
		expect( ruler.roles.multirol1 ).to.not.exist;
		expect( ruler.roles.multirol2 ).to.not.exist;
	});
});

describe( 'setAction', function () {

	it( 'requires a string name param', function () {
		expect( function () {
			ruler.setAction( 1 );
		}).to.throw( 'Action keyname must be a string' );
	});

	it( 'requires an object as rules param', function () {
		expect( function () {
			ruler.setAction( 'tres' );
		}).to.throw( 'Action rules must be a object' );
	});

	it( 'add rules to a new action', function () {
		var rules = {
			level: 2,
			roles: ['editor', 'member'],
			parentLevel: 4,
			parentRoles: ['owner'],
			mainLevel: 10,
			mainRoles: ['superadmin']
		};
		ruler.setAction( 'tres', rules );
		expect( ruler.actions.tres.level ).to.equal(2);
		expect( ruler.actions.tres.roles[0] ).to.equal('editor');
		expect( ruler.actions.tres.parentLevel ).to.equal(4);
		expect( ruler.actions.tres.parentRoles[0] ).to.equal('owner');
		expect( ruler.actions.tres.mainLevel ).to.equal(10);
		expect( ruler.actions.tres.mainRoles[0] ).to.equal('superadmin');
	});

	it( 'remove rule when field is null', function () {
		var rules = {
			level: 2,
			roles: ['editor', 'member'],
			parentLevel: 4,
			parentRoles: ['owner'],
			mainLevel: 10,
			mainRoles: ['superadmin']
		};
		ruler.setAction( 'cuatro', rules );
		var otherRules = {
			level: null,
			roles: null,
			parentLevel: null,
			parentRoles: null,
			mainLevel: null,
			mainRoles: null
		};
		ruler.setAction( 'cuatro', otherRules );
		expect( ruler.actions.cuatro.level ).to.equal( null );
		expect( ruler.actions.cuatro.roles[0] ).to.not.exist;
		expect( ruler.actions.cuatro.parentLevel ).to.equal( null );
		expect( ruler.actions.cuatro.parentRoles[0] ).to.not.exist;
		expect( ruler.actions.cuatro.mainLevel ).to.equal( null );
		expect( ruler.actions.cuatro.mainRoles[0] ).to.not.exist;
	});
});


describe( 'setActions', function () {

	it( 'requires a object with rules', function () {
		expect( function () {
			ruler.setActions( 1 );
		}).to.throw( 'Action rules must be a object' );
	});

	it( 'launch setAction for every action', function () {
		var rules = {
			level: 2,
			roles: ['editor', 'member'],
			parentLevel: 4,
			parentRoles: ['owner'],
			mainLevel: 10,
			mainRoles: ['superadmin']
		};
		ruler.setActions({
			'cinco': rules,
			'seis': rules
		});
		expect( ruler.actions.cinco.level ).to.equal(2);
		expect( ruler.actions.seis.level ).to.equal(2);
	});
});