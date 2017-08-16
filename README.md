miniruler
=========

[![browser support](https://ci.testling.com/jacoborus/miniruler.png)
](https://ci.testling.com/jacoborus/miniruler)


[![Build Status](https://travis-ci.org/jacoborus/miniruler.svg?branch=master)](https://travis-ci.org/jacoborus/miniruler)

Manage roles in contexts asynchronously.

Installation
------------

```
npm install miniruler
```


Example
-------

```js
const Ruler = require('miniruler')
const ruler = new Ruler()

/* - action roles - */

ruler.createAction(
  'manageSettings',
  { roles: ['admin', 'user'] }
)

ruler.can( 'admin', 'manageSettings' )  // => true
ruler.can( 'author', 'manageSettings' )  // => false


/* - action levels - */

ruler.createAction(
  'manageSettings',
  { level: 0 }
)

ruler.can(0, 'manageSettings'), 'can: check level true')
ruler.can(2, 'manageSettings'), 'can: check level false')


/* - revoke - */

ruler.revoke('manageSettings', 'user')

ruler.can( 'user', 'manageSettings' )  // => false
ruler.can( 'admin', 'manageSettings' ) // => admin

// ...
```
index API
============


- [createAction](#createAction)
- [revoke](#revoke)
- [can](#can)

<a name="setActions"></a>
setActions( actions, callback )
------------------------------------------------------------

Add or update actions in context
**Parameters:**
- **actions** *Object*: action rules
- **callback** *Function*: Signature: error



<a name="revoke"></a>
revoke( role, action, callback )
------------------------------------------------------------

Revoke permission to a user over an action
**Parameters:**
- **role** *String*: role name
- **action** *String*: action name
- **callback** *Function*: Signature: error



<a name="can"></a>
can( user, action )
------------------------------------------------------------

Check if user can do an action in context
**Parameters:**
- **user** *String|Number*: user role or user level
- **action** *String*: action to perform
- **Return** *Boolean*: permission






Node.js tests
-------------

```sh
npm test
```

Browser tests
-------------

Run test/test.html in your browser


<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/miniruler/master/LICENSE)
