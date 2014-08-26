miniRuler
=========

[![browser support](https://ci.testling.com/jacoborus/miniruler.png)
](https://ci.testling.com/jacoborus/miniruler)


Manage roles in contexts asynchronously.

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

ruler.setLevels({
    'admin': 5, // role name and level
    'author': 4,
    'user': 3,
    'member': 1
});

ruler.setActions({ comment: {
    level: 2
}});

ruler.can( 1, 'comment' );  // => false
ruler.can( 'user', 'comment' );  // => true


/* - Contexts - */

ruler.addContext('wiki');

ruler.wiki.setLevels({
    // ...
});

// ...
```

API
---

Context:
- setActions
- removeActions
- setLevels
- removeLevels
- allow
- revoke
- addContext
- removeContext
- can


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
