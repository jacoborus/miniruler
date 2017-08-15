const test = require('tape')
const r = require('..')

test('createAction: error checking', t => {
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
    () => { r.createAction('r1', {roles: []}) }, 'action roles should be an array (arr)'
  )
  t.doesNotThrow(
    () => { r.createAction('r2', {roles: ['role1', 'role2']}) },
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
