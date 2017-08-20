const ruler = require('..')
const test = require('tape')

const tests = require('./context-tests.js')

tests(ruler)

const subContext = ruler.createContext('sub')
const sub = ruler.getContext('sub')

test('createContext', t => {
  t.is(subContext, sub, 'get context')
  t.end()
})

tests(sub)
