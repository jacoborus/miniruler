const test = require('tape')
const r = require('..')

// related to context
test('createAction', t => {
  // action name
  t.throws(() => { r.createAction() }, 'action name should be present')
  t.throws(() => { r.createAction(1) }, 'action name should be a string')
  t.throws(() => { r.createAction('') }, 'action name cannot be a empty string')
  // action roles
  t.throws(() => { r.createAction('e', {roles: 1}) }, 'action roles should be an array (num)')
  t.throws(() => { r.createAction('e', {roles: {}}) }, 'action roles should be an array (obj)')
  t.throws(() => { r.createAction('e', {roles: ''}) }, 'action roles should be an array (str)')
  t.throws(
    () => { r.createAction('e', {roles: [1]}) },
    'action roles should be an array of strings (arr with wrong types inside, numbers)'
  )
  t.throws(
    () => { r.createAction('e', {roles: [{}]}) },
    'action roles should be an array of strings (arr with wrong types inside, object)'
  )
  t.doesNotThrow(
    () => { r.createAction('rr1', {roles: []}) }, 'action roles should be an array (arr)'
  )
  t.doesNotThrow(
    () => { r.createAction('rr2', {roles: ['role1', 'role2']}) },
    'action roles should be an array of strings'
  )
  // action levels
  t.throws(() => { r.createAction('e', {level: 's'}) }, 'action level should be an number (str)')
  t.throws(() => { r.createAction('e', {level: {}}) }, 'action level should be an number (obj)')
  t.throws(() => { r.createAction('e', {level: []}) }, 'action level should be an number (arr)')
  t.doesNotThrow(() => { r.createAction('rl1', {level: 0}) }, 'action level should be an number')
  t.throws(() => { r.createAction('rl1', {level: 0}) }, 'action should be unique')
  t.doesNotThrow(() => { r.createAction('rl2', {level: 99}) }, 'action level should be an number')
  t.end()
})

test('setRoles', t => {
  t.throws(() => r.setRoles([]), 'roles for setRoles should be a object (arr)')
  t.throws(() => r.setRoles({user: 'hh'}), 'roles for setRoles should be a object with string - number')
  t.doesNotThrow(() => r.setRoles({admin: 0}), 'setRoles accept valid role objects')
  t.end()
})

test('addRole', t => {
  t.throws(() => r.addRole('user', 'ss'), 'role for addRole should be a pair of string- number (str)')
  t.throws(() => r.addRole(), 'addRole require a roleName')
  t.doesNotThrow(() => r.addRole('user', 3), 'addRole accept valid pair of string - number')
  t.end()
})

// related to action
test('setLevel', t => {
  // error checking
  t.throws(() => r.setLevel(), /setLevel requires a actionName/, 'setLevel requires a actionName')
  t.throws(() => r.setLevel('action that not exists'), /action doesn't exists/, 'action doesn\'t exists')
  // perform set level as undefined remove level
  r.createAction('for setLevel', {level: 1})
  t.throws(() => r.setLevel('for setLevel', {}),
    /Action level has to be a number, undefined or null/,
    'check level type'
  )
  r.setRoles({levelUser: 1})
  t.ok(r.can('levelUser', 'for setLevel'), 'pretest')
  r.setLevel('for setLevel')
  t.notOk(r.can('levelUser', 'for setLevel'), 'setLevel undefined remove the level')
  r.setLevel('for setLevel', 0)
  t.notOk(r.can('levelUser', 'for setLevel'), 'basic set level')
  t.end()
})

test('revoke', t => {
  r.createAction('forRevoke', {roles: ['uno']})
  t.ok(r.can('uno', 'forRevoke'), 'pretest revoke role permission')
  r.revoke('forRevoke', 'uno')
  t.notOk(r.can('uno', 'forRevoke'), 'revoke role permission')
  t.end()
})

// general
test('can', t => {
  // type checking
  t.throws(() => r.can('asdfasdf', 'asdf'), 'check the action to exists')
  t.throws(() => r.can('asdfasdf', []), 'check the action type')
  // with roles
  r.createAction('testRoles', {roles: ['admin', 'other']})
  t.ok(r.can('admin', 'testRoles'), 'can: check roles')
  t.ok(r.can('other', 'testRoles'), 'can: check roles')
  t.notOk(r.can('another', 'testRoles'), 'can: check roles')
  t.end()
})
