const test = require('tape')
const ruler = require('..')

test('createAction: error checking', t => {
  // action name
  t.throws(() => { ruler.createAction() }, 'action name should be present')
  t.throws(() => { ruler.createAction(1) }, 'action name should be a string')
  t.throws(() => { ruler.createAction('') }, 'action name cannot be a empty string')
  // action roles
  t.throws(() => { ruler.createAction('e', {roles: 1}) }, 'action roles should be an array (num)')
  t.throws(() => { ruler.createAction('e', {roles: {}}) }, 'action roles should be an array (obj)')
  t.throws(() => { ruler.createAction('e', {roles: ''}) }, 'action roles should be an array (str)')
  t.throws(
    () => { ruler.createAction('e', {roles: [1]}) },
    'action roles should be an array of strings (arr with wrong types inside, numbers)'
  )
  t.throws(
    () => { ruler.createAction('e', {roles: [{}]}) },
    'action roles should be an array of strings (arr with wrong types inside, object)'
  )
  t.doesNotThrow(
    () => { ruler.createAction('r1', {roles: []}) }, 'action roles should be an array (arr)'
  )
  t.doesNotThrow(
    () => { ruler.createAction('r2', {roles: ['role1', 'role2']}) },
    'action roles should be an array of strings'
  )
  // action levels
  t.end()
})
