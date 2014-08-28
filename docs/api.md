index API
============


- [Context](#Context)
- [setLevels](#setLevels)
- [removeLevels](#removeLevels)
- [setActions](#setActions)
- [allow](#allow)
- [revoke](#revoke)
- [addContext](#addContext)
- [removeContext](#removeContext)
- [can](#can)

<a name="Context"></a>
Context( ctx )
------------------------------------------------------------

Context constructor
**Parameters:**
- **ctx** *Object*: [description]



<a name="setLevels"></a>
setLevels( levels, callback )
------------------------------------------------------------

Add or update levels to a context
**Parameters:**
- **levels** *Object*: Roles names and its levels
- **callback** *Function*: Signature: error



<a name="removeLevels"></a>
removeLevels( roles, callback )
------------------------------------------------------------

Remove one or multiple roles from context
**Parameters:**
- **roles** *String|Array*: role or list of roles to delete
- **callback** *Function*: Signature: error



<a name="setActions"></a>
setActions( actions, callback )
------------------------------------------------------------

Add or update actions in context
**Parameters:**
- **actions** *Object*: action rules
- **callback** *Function*: Signature: error



<a name="allow"></a>
allow( role, action, callback )
------------------------------------------------------------

Grant permission to a user over an action
**Parameters:**
- **role** *String|Array|Number*: role , list of roles or level
- **action** *String*: action keyname
- **callback** *Function*: Signature: error



<a name="revoke"></a>
revoke( role, action, callback )
------------------------------------------------------------

Revoke permission to a user over an action
**Parameters:**
- **role** *String*: role name
- **action** *String*: action name
- **callback** *Function*: Signature: error



<a name="addContext"></a>
addContext( name, ctx )
------------------------------------------------------------

Add a child context
**Parameters:**
- **name** *String*: keyname for context
- **ctx** *Object*: context properties



<a name="removeContext"></a>
removeContext( name )
------------------------------------------------------------

remove context from parent context
**Parameters:**
- **name** *String*: name of the context



<a name="can"></a>
can( user, action )
------------------------------------------------------------

Check if user can do an action in context
**Parameters:**
- **user** *String|Number*: user role or user level
- **action** *String*: action to perform
- **Return** *Boolean*: permission




