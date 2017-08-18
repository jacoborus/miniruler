const actions = new Map()
const contextRoles = new Map()

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
  console.log(roles)
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

function setRoles (roles) {
  checkRolesObj(roles)
  Object.keys(roles).forEach(roleName => {
    contextRoles.set(roleName, roles[roleName])
  })
}

function addRole (roleName, level) {
  if (typeof level !== 'number') throw new Error('Level has to be a number')
  if (!roleName) throw new Error('addRole requires a roleName')
  contextRoles.set(roleName, level)
}

function removeRole (roleName) {
  contextRoles.delete(roleName)
}

// RELATED TO ACTIONS

function createAction (name, {roles = [], level = null}) {
  checkActionName(name)
  checkLevelType(level)
  checkRolesType(roles)
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

function revoke (actionName, role) {
  const action = actions.get(actionName)
  if (!action) throw new Error('Action doesn\'t exists')
  action.roles.delete(role)
}

function setLevel (actionName, level) {
  checkLevelType(level)
  if (!actionName) throw new Error('setLevel requires a actionName')
  const action = actions.get(actionName)
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

function can (roleName, actionName) {
  const action = actions.get(actionName)
  if (!action) throw new Error('Action doesn\'t exists')
  if (action.roles.has(roleName)) return true
  if (action.noLevel) return false
  const role = contextRoles.get(roleName)
  if (typeof role === 'undefined') return false
  return role <= action.level
}

module.exports = {
  // related to context
  setRoles,
  addRole,
  removeRole,
  // related to action
  createAction,
  // allow,
  revoke,
  setLevel,
  can
}
