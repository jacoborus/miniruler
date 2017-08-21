miniruler
=========

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
const ruler = require('miniruler')

/* - action with level - */

ruler.setRoles({
  admin: 1,
  editor: 2,
  author: 3,
  guest: 4
})

ruler.createAction('manage settings', {
  level: 1
})

ruler.can('admin', 'manage settings')  // => true
ruler.can('editor', 'manage settings')  // => false
ruler.can('author', 'manage settings')  // => false


/* - action with extra roles - */

ruler.createAction('create post', {
  level: 2,
  include: ['author']
})

ruler.can('editor', 'create post') // true
ruler.can('author', 'create post') // true
ruler.can('guest', 'create post') // false

ruler.revoke('author', 'create post')
ruler.can('author', 'create post') // false
```
## Context API

- [setRoles](#setRoles)
- [addRole](#addRole)
- [removeRole](#removeRole)
- [createAction](#createAction)
- [setLevel](#setLevel)
- [allow](#allow)
- [revoke](#revoke)
- [can](#can)
- [createContext](#createContext)
- [getContext](#getContext)


<a name="setRoles"></a>
### setRoles(roles)

Add or update role level in context

**Parameters:**

- **roles** *Object*: roles list of roles (keynames) and their levels (values)
- **Return** *Object*: context methods

Example:

```js
context.setRoles({
  admin: 1,
  editor: 2,
  author: 3
})
```


<a name="addRole"></a>
### addRole(roleName, level)

Add a role with its level to the context

**Parameters:**

- **roleName** *String*
- **level** *Number*

Example:

```js
context.addRole('superadmin', 0)
```


<a name="removeRole"></a>
### removeRole(roleName)

Remove a role level from a context

**Parameters:**

- **roleName** *String*

Example:

```js
context.removeRole('superadmin')
```


<a name="createAction"></a>
### createAction(actionName, rules)

Create an action inside a context and assign rules

**Parameters:**

- **actionName** *String*
- **rules** *Object*: (optional) can contain `level` and allowed `roles`
  - **level** *Number*: minimum level of the roles allowed to perform the action
  - **include** *Array*: list of role names (strings) allowed to perform the action (even if their levels are not enough)

Example:

```js
context.createAction('create page', {
  level: 3,
  include: ['other']
})
```


<a name="setLevel"></a>
### setLevel(actionName, level)

Set minimum level of the roles allowed to perform an action

**Parameters:**

- **actionName** *String*
- **level** *Number*

Example:

```js
context.setLevel('create page', 2)
```



<a name="allow"></a>
### allow(roleName, actionName)

Allow a role to perform an action (even if the level of the role is under the action minimum level)

**Parameters:**

- **roleName** *String*
- **actionName** *String*

Example:

```js
context.allow('guest', 'create post')
```




<a name="revoke"></a>
### revoke(roleName, actionName)

Revoke permission of a role to perform a action (the role will still perform the action if its level is allowed)

**Parameters:**

- **roleName** *String*
- **actionName** *String*

Example:

```js
context.revoke('guest', 'create post')
```



<a name="can"></a>
### can(roleName, actionName)

Check if user can perform an action in context

**Parameters:**

- **roleName** *String*
- **actionName** *String*
- **Return** *Boolean*: permission

Example:

```js
context.createAction('delete')
context.addRole('editor', 'delete')
context.can('editor', delete) // false
```



<a name="createContext"></a>
### createContext(contextName)

Create a new context

**Parameters:**

- **contextName** *String*
- **Return** *Object*: new context

Example:

```js
const subContext = context.createContext('wiki')
```



<a name="getContext"></a>
### getContext(contextName)

Retrieve a child context of the actual context

**Parameters:**

- **contextName** *String*
- **Return** *Object*: context

Example:

```js
const subContext = context.getContext('wiki')
```



Node.js tests
-------------

```sh
npm test
```

<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/miniruler/master/LICENSE)
