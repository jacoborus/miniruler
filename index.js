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

function createContext (name, parentContext) {
  if (!name) throw new Error('context require a name')
  const actions = new Map()
  const roles = new Map()
  const contexts = new Map()

  return {
    /**
     * setRoles
     *
     * @param {object} roles list of roles (keynames) and their levels (values)
     * @param {object} context where the roles belong to
    */
    setRoles (roleObj) {
      checkRolesObj(roleObj)
      Object.keys(roleObj).forEach(role => {
        roles.set(role, roleObj[role])
      })
    },

    /**
     * addRole
     *
     * @param {string} roleName
     * @param {number} level
     */
    addRole (roleName, level) {
      if (typeof level !== 'number') throw new Error('Level has to be a number')
      if (!roleName) throw new Error('addRole requires a role')
      roles.set(roleName, level)
    },

    /**
     * removeRole
     *
     * @param {string} roleName
     */
    removeRole (roleName) {
      roles.delete(roleName)
    },

    /**
     * createAction
     *
     * @param {string} actionName
     * @param {array} include
     * @param {number} level
     */
    createAction (actionName, {include = [], level = null} = {include: [], level: null}) {
      checkActionName(actionName)
      checkLevelType(level)
      checkRolesType(include)
      if (actions.has(actionName)) throw new Error(`Action ${actionName} already exists`)
      const action = { roles: new Set(include) }
      if (typeof level === 'undefined' || level === null) {
        action.noLevel = true
      } else {
        action.level = level
        action.noLevel = false
      }
      actions.set(actionName, action)
    },

    /**
     * setLevel
     *
     * @param {string} actionName
     * @param {number} level
     */
    setLevel (actionName, level) {
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
    },

    /**
     * allow
     *
     * @param {string} roleName
     * @param {string} actionName
     */
    allow (roleName, actionName) {
      if (!roleName) throw new Error('allow method requires a role')
      if (!actionName) throw new Error('allow method requires an action')
      const action = actions.get(actionName)
      if (!action) throw new Error('Action doesn\'t exists')
      action.roles.add(roleName)
    },

    /**
     * revoke
     *
     * @param {string} actionName
     * @param {string} role
     */
    revoke (roleName, actionName) {
      const action = actions.get(actionName)
      if (!action) throw new Error('Action doesn\'t exists')
      action.roles.delete(roleName)
    },

    /**
     * can
     *
     * @param {string} roleName
     * @param {string} actionName
     * @returns {boolean}
     */
    can (roleName, actionName) {
      const action = actions.get(actionName)
      if (!action) throw new Error('Action doesn\'t exists')
      if (action.roles.has(roleName)) return true
      if (action.noLevel) return false
      const role = roles.get(roleName)
      if (typeof role === 'undefined') return false
      return role <= action.level
    },

    /**
     * createContext
     *
     * @param {string} contextName
     */
    createContext (contextName) {
      const subContext = createContext(contextName)
      contexts.set(contextName, subContext)
      return subContext
    },

    /**
     * getContext
     *
     * @param {string} name
     * @returns {object} context
     */
    getContext: name => contexts.get(name)
  }
}

module.exports = createContext('__')
