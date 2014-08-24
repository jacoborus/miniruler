miniRuler
=========

Manage roles in contexts.

**In early development**


Example
-------

```js
var Ruler = require( 'miniruler' ),
    ruler = new Ruler();

/* - basic roles - */

ruler.setActions({
    manageSettings: {
        roles: ['admin']
    },
    post: {
        roles: ['author', 'user']
    }
});

ruler.can( 'admin', 'manageSettings' );  // => true
ruler.can( 'author', 'manageSettings' );  // => false


/* - work with levels - */

ruler.setRoles({
    'admin': 5, // role name and level
    'author': 4,
    'user': 3,
    'member': 1
});

ruler.setAction( 'comment', {
    level: 2
});

ruler.can( 1, 'comment' );  // => false
ruler.can( 'user', 'comment' );  // => true


/* - Contexts - */

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
