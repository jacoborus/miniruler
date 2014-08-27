'use strict';
var expect;

if (typeof chai === 'undefined') {
	expect = require('chai').expect;
	var miniruler = require('..');
} else {
	 expect = chai.expect;
}

var ruler = new miniruler();

describe( 'miniruler', function () {

	it( 'has correct structure', function () {
		expect( ruler._levels ).to.exist;
		expect( ruler._levels ).to.be.a('object');
		expect( ruler._actions ).to.exist;
		expect( ruler._actions ).to.be.a('object');
		expect( ruler.contexts ).to.exist;
		expect( ruler.contexts ).to.be.a('object');
	});
});

describe( 'setLevels', function () {

	it( 'launch callback automatically when no levels', function (done) {
		ruler.setLevels( null, function () {
			done();
		});
	});

	it( 'callback error when bad type', function () {
		ruler.setLevels( 2, function (err) {
			expect( err ).to.exist;
		});
	});

	it( 'set roles from object', function () {
		var roles = {
			admin: 5,
			autor: 3,
			member: 1
		};
		ruler.setLevels( roles );
		expect( ruler._levels.admin ).to.equal(5);
	});
});


describe( 'removeLevels', function () {

	it( 'automatically launch callback when no levels object', function (done) {
		ruler.setLevels( null, function () {
			done();
		});
	});

	it( 'throw errors througth callback', function () {
		ruler.setLevels( 1, function (err) {
			expect( err ).to.exist
		});
	});

	it( 'detect bad levels object', function () {
		ruler.setLevels({ uno: 'uno' }, function (err) {
			expect( err ).to.exist
		});
	});

	it( 'remove a single role', function () {
		ruler.setLevels({ testsinglerole: 3 });
		ruler.removeLevels( 'testsinglerole' );
		expect( ruler._levels.testsinglerole ).to.not.exist;
	});

	it( 'remove multiple roles', function () {
		ruler.setLevels({ multirol1: 3 });
		ruler.setLevels({ multirol2: 3 });
		ruler.removeLevels([ 'multirol1', 'multirol2' ]);
		expect( ruler._levels.multirol1 ).to.not.exist;
		expect( ruler._levels.multirol2 ).to.not.exist;
	});
});


var rules = {
	level: 2,
	roles: ['editor', 'member'],
	parentLevel: 4,
	parentRoles: ['owner'],
	mainLevel: 10,
	mainRoles: ['superadmin']
};

describe( 'setActions', function () {

	it( 'automatically launch callback when no actions object', function (done) {
		ruler.setActions( null, function () {
			done();
		});
	});

	it( 'requires a object with rules', function () {
		ruler.setActions( 1, function (err) {
			expect( err ).to.exist;
		});
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
		ruler.setActions({ tres: rules });
		expect( ruler._actions.tres.level ).to.equal(2);
		expect( ruler._actions.tres.roles[0] ).to.equal('editor');
		expect( ruler._actions.tres.parentLevel ).to.equal(4);
		expect( ruler._actions.tres.parentRoles[0] ).to.equal('owner');
		expect( ruler._actions.tres.mainLevel ).to.equal(10);
		expect( ruler._actions.tres.mainRoles[0] ).to.equal('superadmin');
	});

	it( 'overwrite rules', function () {
		ruler.setActions({
			tres: {
				level: 3,
				roles: ['admin'],
				parentLevel: 3,
				parentRoles: ['admin'],
				mainLevel: 9,
				mainRoles: ['admin']
			}
		});
		expect( ruler._actions.tres.level ).to.equal(3);
		expect( ruler._actions.tres.roles[0] ).to.equal('admin');
		expect( ruler._actions.tres.parentLevel ).to.equal(3);
		expect( ruler._actions.tres.parentRoles[0] ).to.equal('admin');
		expect( ruler._actions.tres.mainLevel ).to.equal(9);
		expect( ruler._actions.tres.mainRoles[0] ).to.equal('admin');
	});
});

describe( 'removeActions', function () {

	it( 'automatically launch callback when no actions object', function (done) {
		ruler.removeActions( null, function () {
			done();
		});
	});

	it( 'requires a string or array with rules', function () {
		ruler.removeActions( 1, function (err) {
			expect( err ).to.exist;
		});
		ruler.removeActions( {}, function (err) {
			expect( err ).to.exist;
		});
	});

	it( 'remove a single action from context', function () {
		ruler.setActions({ seven: rules });
		ruler.removeActions( 'seven' );
		expect( ruler._actions.seven ).to.not.exist;
	});

	it( 'remove a multiple actions from context', function () {
		ruler.setActions({ ocho: rules });
		ruler.setActions({ nueve: rules });
		ruler.removeActions(['ocho', 'nueve']);
		expect( ruler._actions.ocho ).to.not.exist;
		expect( ruler._actions.nueve ).to.not.exist;
	});
});

describe( 'addContext', function () {

	it( 'requires a string keyname for the context', function () {
		expect( function () {
			ruler.addContext( 23 );
		}).to.throw( 'context.addContext method requires a String name' );
	});

	it( 'requires context to be a object', function () {
		expect( function () {
			ruler.addContext( 'subcontext', 2 );
		}).to.throw( 'context.addContext method requires a Object ctx' );
	});

	it( 'link parent context to subcontext', function () {
		ruler.addContext( 'subcontext', {} );
		expect( ruler.contexts.subcontext.parent.key ).to.equal( 'main' );
	});
});

describe( 'removeContext', function () {

	it( 'remove child context from context', function () {
		ruler.addContext( 'childCtx' );
		ruler.removeContext( 'childCtx' );
		expect( ruler.contexts.childCtx ).to.not.exist;
	});
});


var r2 = new miniruler();

r2.setLevels({
    'super': 6, // role name and level
    'admin': 5, // role name and level
    'author': 4,
    'user': 3,
    'member': 1
});

r2.setActions({
    manageSettings: {
        roles: ['admin']
    },
    post: {
        roles: ['author', 'user'],
    },
    sendEmails: {
    	level: 4
    },
    readEmails: {
    	level: 6
    },
    comment: {
        level: 0
    }
});


describe( 'can', function () {

	it( 'return permission for role', function () {
		expect( r2.can( 'admin', 'manageSettings' )).to.equal( true );
		expect( r2.can( 'author', 'manageSettings' )).to.equal( false );
		expect( r2.can( 'admin', 'post' )).to.equal( false );
		expect( r2.can( 'other', 'post' )).to.equal( false );
	});

	it( 'return permission for direct level', function () {
		expect( r2.can( 1, 'sendEmails' )).to.equal( false );
		expect( r2.can( 4, 'sendEmails' )).to.equal( true );
	});

	it( 'return permission for level througth role level', function () {
		expect( r2.can( 'super', 'readEmails' )).to.equal( true );
		expect( r2.can( 'user', 'sendEmails' )).to.equal( false );
	});
});


var r3 = new miniruler();

describe( 'allow', function () {

	it( 'give permission to a role to perform an action', function () {
		r3.allow( 'user', 'post' );
		expect( r3.can( 'user', 'post' )).to.equal( true );
	});
});