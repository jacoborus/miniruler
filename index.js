// RELATED TO TYPE CHECKING
// Check if an object is an array
function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function areRolesStrings (roles) {
  return !roles.some(role => typeof role !== 'string')
}

function checkRolesType (roles) {
  if (typeof roles === 'undefined') return true
  if (!isArray(roles)) throw new Error('Wrong type for roles')
  if (!areRolesStrings(roles)) throw new Error('Some roles are not String type')
}

function checkLevelType (level) {
  if (level === 0 || typeof level === 'undefined' || level === null) return true
  if (typeof level !== 'number') throw new Error('Action level has to be a number, undefined or null')
}

function checkActionName (name) {
  if (!name || typeof name !== 'string' || name === '') {
    throw new Error('Actions require a String name')
  }
}

function checkRolesObj (roles) {
  if (!isObject(roles)) throw new Error('Roles has to be a object')
  if (Object.keys(roles).some(roleName => typeof roles[roleName] !== 'number')) {
    throw new Error('Invalid roles object')
  }
}

// RELATED TO CONTEXT

function setRoles (roles, context) {
  checkRolesObj(roles)
  Object.keys(roles).forEach(role => {
    context.roles.set(role, roles[role])
  })
}

function addRole (role, level, context) {
  if (typeof level !== 'number') throw new Error('Level has to be a number')
  if (!role) throw new Error('addRole requires a role')
  context.roles.set(role, level)
}

function removeRole (role, context) {
  context.roles.delete(role)
}

// RELATED TO ACTIONS

function createAction (name, {roles = [], level = null} = {roles: [], level: null}, context) {
  checkActionName(name)
  checkLevelType(level)
  checkRolesType(roles)
  const actions = context.actions
  if (actions.has(name)) throw new Error(`Action ${name} already exists`)
  const action = { roles: new Set(roles) }
  if (typeof level === 'undefined' || level === null) {
    action.noLevel = true
  } else {
    action.level = level
    action.noLevel = false
  }
  actions.set(name, action)
}

function allow (roleName, actionName, context) {
  if (!roleName) throw new Error('allow method requires a role')
  if (!actionName) throw new Error('allow method requires an action')
  const action = context.actions.get(actionName)
  if (!action) throw new Error('Action doesn\'t exists')
  action.roles.add(roleName)
}

function revoke (actionName, role, context) {
  const action = context.actions.get(actionName)
  if (!action) throw new Error('Action doesn\'t exists')
  action.roles.delete(role)
}

function setLevel (actionName, level, context) {
  checkLevelType(level)
  if (!actionName) throw new Error('setLevel requires a actionName')
  const action = context.actions.get(actionName)
  if (!action) throw new Error('action doesn\'t exists')
  if (typeof level === 'undefined' || level === null) {
    action.noLevel = true
    delete action.level
  } else {
    action.level = level
    action.noLevel = false
  }
}

// GENERAL

function can (roleName, actionName, context) {
  const action = context.actions.get(actionName)
  if (!action) throw new Error('Action doesn\'t exists')
  if (action.roles.has(roleName)) return true
  if (action.noLevel) return false
  const role = context.roles.get(roleName)
  if (typeof role === 'undefined') return false
  return role <= action.level
}

function createContext (name, parentContext) {
  if (!name) throw new Error('context require a name')
  const context = {
    actions: new Map(),
    roles: new Map(),
    contexts: new Map()
  }

  return {
    // createContext,
    setRoles: roles => setRoles(roles, context),
    addRole: (roleName, level) => addRole(roleName, level, context),
    removeRole: roleName => removeRole(roleName, context),
    // related to action
    createAction: (name, options) => createAction(name, options, context),
    setLevel: (actionName, level) => setLevel(actionName, level, context),
    allow: (roleName, actionName) => allow(roleName, actionName, context),
    revoke: (actionName, role) => revoke(actionName, role, context),
    // general
    can: (roleName, actionName) => can(roleName, actionName, context),
    createContext: name => {
      const subContext = createContext(name, context)
      context.contexts.set(name, subContext)
      return subContext
    },
    getContext: name => context.contexts.get(name)
  }
}

const mainContext = createContext('__')

module.exports = mainContext
