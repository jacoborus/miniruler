// Check if an object is an array
function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
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
  if (level === 0 || typeof level === 'undefined') return true
  if (typeof level !== 'number') throw new Error('Action level has to be a number')
}

function checkActionName (name) {
  if (!name || typeof name !== 'string' || name === '') {
    throw new Error('Actions require a String name')
  }
}

function createAction (name, {roles = [], level} = {}) {
  checkActionName(name)
  checkLevelType(level)
  checkRolesType(roles)
  if (actions.has(name)) throw new Error(`Action ${name} already exists`)
  const action = { roles: new Set(roles) }
  if (typeof level === 'undefined') action.noLevel = true
  else action.level = level
  actions.set(name, action)
}

function can (user, actionName) {
  const action = actions.get(actionName)
  if (!action) throw new Error('Action doesn\'t exists')
  if (typeof user === 'string') return action.roles.has(user)
  else if (typeof user === 'number') {
    if (action.noLevel) return false
    else return action.level >= user
  } else {
    throw new Error(`wrong role checking ${actionName}`)
  }
}

const actions = new Map()

module.exports = {
  createAction,
  can
}
