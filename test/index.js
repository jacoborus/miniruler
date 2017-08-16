const test = require('tape')
const r = require('..')

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
  t.throws(() => { r.createAction('e', {level: []}) }, 'action level should be an number (obj)')
  t.doesNotThrow(() => { r.createAction('rl1', {level: 0}) }, 'action level should be an number')
  t.doesNotThrow(() => { r.createAction('rl2', {level: 99}) }, 'action level should be an number')
  t.end()
})

test('can', t => {
  // with roles
  r.createAction('testRoles', {roles: ['admin', 'other']})
  t.ok(r.can('admin', 'testRoles'), 'can: check roles')
  t.ok(r.can('other', 'testRoles'), 'can: check roles')
  t.notOk(r.can('another', 'testRoles'), 'can: check roles')
  // with levels
  r.createAction('testLevel', {level: 2})
  t.ok(r.can(0, 'testLevel'), 'can: check level true')
  t.notOk(r.can(3, 'testLevel'), 'can: check level false')
  // type checking
  t.throws(() => r.can('asdfasdf', 'asdf'), 'check the action to exists')
  t.throws(() => r.can('asdfasdf', []), 'check the action type')
  t.end()
})

test('revoke', t => {
  r.createAction('forRevoke', {roles: ['uno']})
  t.ok(r.can('uno', 'forRevoke'), 'pretest revoke role permission')
  r.revoke('forRevoke', 'uno')
  t.notOk(r.can('uno', 'forRevoke'), 'revoke role permission')
  t.end()
})
