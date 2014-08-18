'use strict';

var ruler;

/*!
 * Add or overwrite roles in context or resource
 * @param {[type]} roles [description]
 */
var setRoles = function (roles) {
	var i;
	for (i in roles) {
		if (!roles[i] && roles[i] !== 0) {
			roles[i] = 1;
		}
		this.roles[i] = roles[i];
	}
};

/*!
 * Add or overwrite actions in context or resource
 * @param {Object} actions actions and its rules
 */
var setActions = function (actions) {
	var i;
	if (typeof actions !== 'object') {
		throw new Error( 'Action rules must be a object' );
	}
	for (i in actions) {
		this.actions[i] = actions[i];
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
	this.roles = {};
	this.actions = {};
	ctx = ctx || {};
	setRoles.call( this, ctx.roles  || {});
	setActions.call( this, ctx.actions  || {});
	for (i in ctx.contexts || {}) {
		this.contexts[i]  = new Context( ctx.contexts[i] );
	}
};

/**
 * Add or overwrite a role
 * @param {String} name role keyname
 * @param {Number} level level role. Optional, 1 by default
 */
Context.prototype.setRole = function (name, level) {
	if (!name) {
		throw new Error( 'Role name is required to set a role' );
	}
	if (typeof name !== 'string') {
		throw new Error( 'Role name must be a string' );
	}
	if (typeof level !== 'undefined' && typeof level !== 'number') {
		throw new Error( 'Role level must be a number' );
	}
	level = level || 1;
	this.roles[name] = level;
};

/**
 * Add or update roles to a context
 * @param {Object} roles Roles names and its levels
 */
Context.prototype.setRoles = function (roles) {
	if (!roles || typeof roles !== 'object') {
		throw new Error( 'setRoles requires a object as param' );
	}
	setRoles.call( this, roles );
};

/**
 * Remove one or multiple roles from context
 * @param  {String|Array} roles list of roles to delete
 */
Context.prototype.removeRoles = function (roles) {
	var i;
	roles = roles || [];
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		delete this.roles[roles[i]];
	}
};

/**
 * Add or update action rules
 * @param {String} name   action keyname
 * @param {Object} rules action rules object, see [action rules](#action_rules)
 */
Context.prototype.setAction = function (name, rules) {
	if (typeof name !== 'string') {
		throw new Error( 'Action keyname must be a string' );
	}
	if (typeof rules !== 'object') {
		throw new Error( 'Action rules must be a object' );
	}
	var nums = ['level', 'parentLevel', 'mainLevel'],
		arrs = ['roles', 'parentRoles', 'mainRoles'],
		i;

	rules = rules || {};
	this.actions[name] = {};

	for (i in nums) {
		if (typeof rules[nums[i]] !== 'undefined') {
			if (typeof rules[nums[i]] !== 'number' && rules[nums[i]] !== null ) {
				throw new Error( nums[i] + ' must be an number or null');
			}
			if (rules[nums[i]] === null) {
				this.actions[name][nums[i]] = null;
			} else {
				this.actions[name][nums[i]] = rules[nums[i]];
			}
		} else {
			this.actions[name][nums[i]] = this.actions[name][nums[i]] || [];
		}
	}
	for (i in arrs) {
		if (typeof rules[arrs[i]] !== 'undefined') {
			if (typeof rules[arrs[i]] !== 'object') {
				throw new Error( arrs[i] + ' must be an array');
			}
			if (rules[arrs[i]] === null) {
				this.actions[name][arrs[i]] = [];
			} else {
				this.actions[name][arrs[i]] = rules[arrs[i]];
			}
		} else {
			this.actions[name][arrs[i]] = this.actions[name][arrs[i]] || [];
		}
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
		delete this.actions[actions[i]];
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

Context.prototype.removeContext = function (name) {
	delete this.resources[name];
};

ruler = new Context();

module.exports = ruler;
