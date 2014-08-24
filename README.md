miniRuler
=========

Manage roles in contexts.

**In early development**


Example
-------

```js
var ruler = require( 'miniruler' );

ruler.setRoles({
	'admin': 5, // role name and level
	'author': 4,
	'user': 3,
	'member': 1
});

ruler.setActions({
	manageSettings: {
		roles: ['admin']
	},
	post: {
		roles: ['author', 'user']
	},
	comment: {
		level: 0
	}
});

ruler.addContext('wiki');

var wikiCtx = ruler.contexts.wiki;

wikiCtx.addRoles({
	// ...
});

// ...
```

API
---

- setRole
- setRoles
- removeRoles
- setAction
- setActions
- removeActions
- addContext
- removeContext
- can


<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/miniruler/master/LICENSE)
