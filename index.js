'use strict';

var Action;

/*!
 * Add or overwrite roles in context or resource
 * @param {[type]} roles [description]
 */
var setLevels = function (roles) {
	var i;
	for (i in roles) {
		if (!roles[i] && roles[i] !== 0) {
			roles[i] = 1;
		}
		this._roles[i] = roles[i];
	}
};

/*!
 * Add or overwrite actions in context or resource
 * @param {Object} actions actions and its rules
 */
var setActions = function (actions) {
	if (typeof actions !== 'object') {
		throw new Error( 'ruler Context.setActions requires an action object' );
	}
	var i;
	for (i in actions) {
		if (!this._actions[i]) {
			this._actions[i] = new Action();
		}
		this._actions[i].set( actions[i] );
	}
};

var checkLevel = function (level, action) {
	if (level >= this._actions[action].level) {
		return true;
	}
	return false;
};

var checkRole = function (role, action) {
	var roles, a, l;

	if (this._actions[action]) {
		roles = this._actions[action].roles;
		for (a in roles) {
			if (roles[a] === role) {
				return true;
			}
		}
	}

	if (this._roles[role]) {
		l = checkLevel.call( this, this._roles[role], action );
		if (l) {
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

Action.prototype.allow = function (roles) {
	var i;
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		if (!this.hasRole( roles[i] )) {
			this.roles.push( roles[i] );
		}
	}
};

Action.prototype.revoke = function (roles) {
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
var Context = function (ctx, parent) {
	if (parent) {
		this.parent = parent;
	} else {
		this.key = 'main';
	}
	var i;
	this.contexts = {};
	this._roles = {};
	this._actions = {};
	ctx = ctx || {};
	setLevels.call( this, ctx.roles  || {});
	setActions.call( this, ctx._actions  || {});
	for (i in ctx.contexts || {}) {
		this[i]  = new Context( ctx.contexts[i] );
	}
};

/**
 * Add or update roles to a context
 * @param {Object} roles Roles names and its levels
 */
Context.prototype.setLevels = function (roles) {
	if (!roles || typeof roles !== 'object') {
		throw new Error( 'setLevels requires a object as param' );
	}
	setLevels.call( this, roles );
};

/**
 * Remove one or multiple roles from context
 * @param  {String|Array} roles list of roles to delete
 */
Context.prototype.removeLevels = function (roles) {
	var i;
	roles = roles || [];
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		delete this._roles[roles[i]];
	}
};


/**
 * Add or update actions in context
 * @param {Object} actions action rules
 */
Context.prototype.setActions = function (actions) {
	setActions.call( this, actions );
};

/*!
 * Remove actions from context or resource
 * @param  {String|Array} actions list of action names to remove
 */
Context.prototype.removeActions = function (actions) {
	var i;
	if (typeof actions === 'string') {
		actions = [actions];
	}
	for (i in actions) {
		if (this._actions[actions[i]]) {
			delete this._actions[actions[i]];
		}
	}
};


Context.prototype.allow = function (role, action) {
	if (!this._actions[action]) {
		this._actions[action] = new Action();
	}
	this._actions[action].allow( role );
};

Context.prototype.revoke = function (role, action) {
	if (this._actions[action]) {
		this._actions[action].revoke( role );
	}
};


/**
 * Add a child context
 * @param {String} name keyname for context
 * @param {Object} ctx  context properties
 */
Context.prototype.addContext = function (name, ctx) {
	if (this.contexts[name]) {
		throw Error;
	}
	if (typeof name !== 'string') {
		throw new Error( 'context.addContext method requires a String name' );
	}
	if (typeof ctx !== 'undefined' && typeof ctx !== 'object') {
		throw new Error( 'context.addContext method requires a Object ctx' );
	}
	this.contexts[name] = new Context( ctx, this );
};

/**
 * remove context from parent context
 * @param  {String} name name of the context
 */
Context.prototype.removeContext = function (name) {
	delete this.contexts[name];
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


module.exports = Context;
