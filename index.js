'use strict';

var deepExtend = require('deep-extend');

var contexts = {};

var setRoles = function (roles) {
	var i;
	for (i in roles) {
		if (!roles[i] && roles[i] !== 0) {
			roles[i] = 1;
		}
		this.roles[i] = roles[i];
	}
};

var removeRoles = function (roles) {
	var i;
	if (typeof roles === 'string') {
		roles = [roles];
	}
	for (i in roles) {
		delete this.roles[roles[i]];
	}
};

var setActions = function (actions) {
	var i;
	for (i in actions) {
		this.actions[i] = actions[i];
	}
};

var removeActions = function (actions) {
	var i;
	if (typeof actions === 'string') {
		actions = [actions];
	}
	for (i in actions) {
		delete this.actions[actions[i]];
	}
};


var Resource = function (obj) {
	this.roles = {};
	this.actions = {};
	setRoles.call( this, obj.roles );
	setActions.call( this, obj.actions );
};

Resource.prototype.setRoles = function (roles) {
	setRoles.call( this, roles );
};

Resource.prototype.removeRoles = function (roles) {
	removeRoles.call( this, roles );
};

Resource.prototype.setActions = function (actions) {
	setActions.call( this, actions );
};

Resource.prototype.removeActions = function (actions) {
	removeActions.call( this, actions );
};

Resource.prototype.check = function (action, rol) {
	// body...
};

/**
 * Context constructor
 * @param {Object} ctx [description]
 */
var Context = function (name, ctx) {
	var i;
	this.resources = {};
	this.roles = {};
	this.actions = {};
	ctx = ctx || {};
	setRoles.call( this, ctx.roles  || {});
	setActions.call( this, ctx.actions  || {});
	for (i in ctx.resources || {}) {
		this.resources[i]  = new Resource( ctx.resources[i] );
	}
	contexts[name] = this;
};

Context.prototype.setRoles = function (roles) {
	setRoles.call( this, roles );
};

Context.prototype.removeRoles = function (roles) {
	removeRoles.call( this, roles );
};

Context.prototype.setActions = function (actions) {
	setActions.call( this, actions );
};

Context.prototype.removeActions = function (actions) {
	removeActions.call( this, actions );
};

Context.prototype.setResource = function (name, obj) {
	this.resources[name] = !this.resources[name] ? new Resource( obj ) : deepExtend( this.resources[name], obj );
};

Context.prototype.removeResource = function (name) {
	delete this.resources[name];
};

Context.prototype.check = function (resource, action, role) {
	// body...
};


module.exports = {
	Context: Context,
	contexts: contexts
};
