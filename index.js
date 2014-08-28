'use strict';

(function() {

var Action;

// Check if an object is an array
var isArray = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object Array]';
};

/*!
 * check if levels object has correct structure
 * @param  {Object} obj roles and its levels
 * @return {Boolean}     true if it's right
 */
var levelsStruc = function (obj) {
	var i;
	if (typeof obj !== 'object' || isArray( obj )) {
		return false;
	}
	for (i in obj) {
		if (typeof obj[i] !== 'number') {
			return false;
		}
	}
	return true;
};

/*!
 * Add or overwrite levels in context or resource
 * @param {[type]} levels [description]
 */
var setLevels = function (levels, cb) {
	if (!levels) {
		return cb();
	}
	if (!levelsStruc( levels )) {
		return cb( 'Bad levels object structure' );
	}
	var i;
	for (i in levels) {
		if (!levels[i] && levels[i] !== 0) {
			levels[i] = 1;
		}
		this._levels[i] = levels[i];
	}
	cb();
};

/*!
 * check if actions object has correct structure
 * @param  {Object} obj actions and its roles and levels
 * @return {Boolean}     true if it's right
 */
var actionsStruc = function (obj) {
	var i, el;
	if (typeof obj !== 'object' || isArray( obj )) {
		return false;
	}
	var arrs = ['roles', 'mainRoles', 'parentRoles'];
	var nums = ['level', 'mainLevel', 'parentLevel'];

	for (i in arrs) {
		el = obj[arrs[i]];
		if (el && !isArray( el )) {
			console.log(el);
			return false;
		}
	}
	for (i in nums) {
		el = obj[nums[i]];
		if (el && typeof el !== 'number') {
			return false;
		}
	}
	return true;
};

/*!
 * Add or overwrite actions in context or resource
 * @param {Object} actions actions and its rules
 */
var setActions = function (actions, callback) {
	var cb = callback || function () {},
		i;
	if (!actions) {
		return cb();
	}
	if (!actionsStruc( actions )) {
		return cb( 'Bad actions object structure' );
	}
	if (typeof actions !== 'object') {
		return cb( new Error( 'ruler Context.setActions requires an action object' ));
	}
	for (i in actions) {
		this._actions[i] = this._actions[i] || new Action();
		this._actions[i].set( actions[i] );
	}
	cb();
};

/*!
 * Check if level is enough to perforn an action
 * @param  {Number} level
 * @param  {Onject} action action keyname
 * @return {Boolean}        true if level is enough
 */
var checkLevel = function (level, action) {
	return level >= this._actions[action].level;
};

/*!
 * check if a role can perform an action
 * @param  {String} role   role keyname
 * @param  {String} action action keyname
 * @return {Boolean}        true if role has permission
 */
var checkRole = function (role, action) {
	var roles, a;

	if (this._actions[action]) {
		roles = this._actions[action].roles;
		for (a in roles) {
			if (roles[a] === role) {
				return true;
			}
		}
	}

	if (this._levels[role]) {
		if (checkLevel.call( this, this._levels[role], action )) {
			return true;
		}
	}
	return false;
};


Action = function () {
	this.roles = [];
	this.level = Infinity;
	this.parentRoles = [];
	this.parentLevel = Infinity;
	this.mainRoles = [];
	this.mainLevel = Infinity;
};

Action.prototype.hasRole = function (role, ctx) {
	var i, roles;

	if (!ctx) {
		roles = this.roles;
	} else if (ctx === 'main') {
		roles = this.mainRoles;
	} else if (ctx === 'parent') {
		roles = this.parentRoles;
	}

	for (i in roles) {
		if (role === roles[i]) {
			return true;
		}
	}
	return false;
};

Action.prototype.allow = function (roles, cb) {
	var i;
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		if (!this.hasRole( roles[i] )) {
			this.roles.push( roles[i] );
		}
	}
	cb();
};

Action.prototype.revoke = function (roles, cb) {
	var i, r;
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		r = this.roles.indexOf( roles[i] );
		if (r > -1) {
		    this.roles.splice( r, 1 );
		}
	}
	cb();
};

Action.prototype.set = function (rules) {
	var i;
	for (i in rules) {
		this[i] = rules[i];
	}
};



/**
 * Context constructor
 * @param {Object} ctx [description]
 */
var Context = function (ctx, parent, cb) {
	cb = cb || function () {};
	if (parent) {
		this.parent = parent;
	} else {
		this.key = 'main';
	}
	var self = this;
	this.contexts = {};
	this._levels = {};
	this._actions = {};
	ctx = ctx || {};
	setLevels.call( this, ctx._levels  || {}, function (errLev) {
		setActions.call( this, ctx._actions  || {}, function (errAct) {
			var i;
			if (errLev || errAct) {
				return cb( errLev || errAct );
			}
			for (i in ctx.contexts || {}) {
				self[i]  = new Context( ctx.contexts[i], self, cb );
			}
		});
	});
};


/**
 * Add or update levels to a context
 * @param {Object} levels Roles names and its levels
 * @param {Function} callback Signature: error
 */
Context.prototype.setLevels = function (levels, callback) {
	var cb = callback || function () {};
	setLevels.call( this, levels, cb );
};


/**
 * Remove one or multiple roles from context
 * @param  {String|Array} roles role or list of roles to delete
 * @param {Function} callback Signature: error
 */
Context.prototype.removeLevels = function (roles, callback) {
	var cb = callback || function () {},
		i;
	roles = roles || [];
	if (!roles || (typeof roles !== 'string' && !isArray( roles ))) {
		return cb( 'Context.removeLevels requires a string or array' );
	}
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		delete this._levels[roles[i]];
	}
	cb();
};


/**
 * Add or update actions in context
 * @param {Object} actions action rules
 * @param {Function} callback Signature: error
 */
Context.prototype.setActions = function (actions, callback) {
	setActions.call( this, actions, callback );
};


/*!
 * Remove actions from context or resource
 * @param  {String|Array} actions list of action names to remove
 * @param {Function} callback Signature: error
 */
Context.prototype.removeActions = function (actions, callback) {
	var cb = callback || function () {},
		i;
	if (!actions) {
		return cb();
	}
	if (typeof actions !== 'string' && !isArray( actions )) {
		return cb( 'Context.removeLevels requires a string or array' );
	}
	if (typeof actions === 'string') {
		actions = [actions];
	}
	for (i in actions) {
		if (this._actions[actions[i]]) {
			delete this._actions[actions[i]];
		}
	}
	cb();
};


/**
 * Grant permission to a user over an action
 * @param  {String|Array|Number} role   role , list of roles or level
 * @param  {String} action action keyname
 * @param {Function} callback Signature: error
 */
Context.prototype.allow = function (roles, action, callback) {
	var cb = callback || function () {};
	if (!roles) {
		return cb();
	}
	if (typeof roles === 'number') {
		if (!this._actions[action]) {
			this._actions[action] = new Action();
		}
		this._actions[action].level = roles;
		return cb();
	}
	if (typeof roles === 'string') {
		roles = [roles];
	} else if (!isArray( roles )) {
		return cb( 'bad roles argument' );
	}
	if (!this._actions[action]) {
		this._actions[action] = new Action();
	}
	this._actions[action].allow( roles, cb );
};


/**
 * Revoke permission to a user over an action
 * @param  {String} role   role name
 * @param  {String} action action name
 * @param {Function} callback Signature: error
 */
Context.prototype.revoke = function (roles, action, callback) {
	var cb = callback || function () {};
	if (!roles) {
		return cb();
	}
	if (this._actions[action]) {
		return this._actions[action].revoke( roles, cb );
	}
	cb();
};


/**
 * Add a child context
 * @param {String} name keyname for context
 * @param {Object} ctx  context properties
 */
Context.prototype.addContext = function (name, ctx, callback) {
	if (this.contexts[name]) {
		throw Error;
	}
	if (typeof name !== 'string') {
		throw new Error( 'context.addContext method requires a String name' );
	}
	if (typeof ctx !== 'undefined' && typeof ctx !== 'object') {
		throw new Error( 'context.addContext method requires a Object ctx' );
	}
	this.contexts[name] = new Context( ctx, this, callback );
};


/**
 * remove context from parent context
 * @param  {String} name name of the context
 */
Context.prototype.removeContext = function (name, callback) {
	var cb = callback || function () {};
	if (this.contexts[name]) {
		delete this.contexts[name];
	}
	cb();
};


/**
 * Check if user can do an action in context
 * @param  {String|Number} user   user role or user level
 * @param  {String} action action to perform
 * @return {Boolean}        permission
 */
Context.prototype.can = function (user, action) {

	if (typeof user === 'string') {
		 return checkRole.call( this, user, action );
	} else if (typeof user === 'number') {
		return checkLevel.call( this, user, action );
	} else {
		throw new Error( 'user must be a number or string' );
	}
};

	// node.js
	if((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
		module.exports = Context;
	// browser
	} else if(typeof window !== 'undefined') {
		window.miniruler = Context;
	}
})();