// TODO: ADD FILTERS TO DATABASE "ENTITY CLASSES"
// TODO: PREVENT MULTIPLE ATTEMPTS
// REMEMBER DEEP COPY: deepCopy = Object.assign({}, obj);

var config = require('./config.js');

////////////////////////////////////////////////////////////////////////////////
var express    = require('express');
var app        = express();

var helmet = require('helmet');
var bodyParser = require('body-parser');
var mongo      = require('mongodb').MongoClient;
var fs         = require('fs');


var onerva = {};
onerva.util   = require('./onerva.server.v2.util.js');
onerva.error  = require('./onerva.server.v2.error.js');
onerva.auth   = require('./onerva.server.v2.auth.js');
onerva.group  = require('./onerva.server.v2.group.js');
onerva.user   = require('./onerva.server.v2.user.js');
onerva.chat   = require('./onerva.server.v2.chat.js');

////////////////////////////////////////////////////////////////////////////////
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'))
//app.use('/static', express.static('public'))


////////////////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
    console.log(promise);
});

////////////////////////////////////////////////////////////////////////////////
app.get('/', function(req, res) {
    res.send('should not see this, but public/index.html');
});


////////////////////////////////////////////////////////////////////////////////
// LOGIN
////////////////////////////////////////////////////////////////////////////////
app.post('/api/auth', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    var login = req.body;

    console.log(req.body);
    
    if ( login.email )
	login.email = login.email.toLowerCase();
    
    Promise.resolve(context)
	   .then(onerva.auth.authenticateSenderWithLogin(login.email, login.password, login.pin))
	   .then(function(context) {
	       var auth_hash = onerva.auth.calculateAuthHash(context.sender.uid, login.password, login.pin);
	       var auth_token = {
		   alias:     context.sender.alias,
		   uid:       context.sender.uid,
		   auth_hash: auth_hash
	       };
	       console.log(auth_token);
	       //console.log(onerva.auth.calculatePinHash(auth_hash, login.pin));
	       res.json(auth_token);
	   })
	   .catch(function(error) {
	       console.log(error);
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// FOR LOGIN WITH TOKEN
////////////////////////////////////////////////////////////////////////////////
app.get('/api/groups/:gid/users.alias', function(req, res) {
    //const db = res.app.locals.db;
    var context = {
	db:    req.app.locals.db,
    };

    var gid    = req.params.gid;
    var target = 'gid-' + gid;
    
    
    Promise.resolve(context)
    	   .then(onerva.group.fetchGroup(gid))
	   .then(function(context) {
	       var uid_list = [];
	       for(let i = 0; i < context.group.users.length; ++i)
		   uid_list.push( context.group.users[i].uid );

	       //console.log(uid_list);
	       return context.db.collection('users').find({ uid: { $in: uid_list } })
			     .toArray()
			     .then(function(array) {
				 //console.log(array);
				 let aliases = [];
				 array.map(function(item) {
				     aliases.push(item.alias);
				 });
				 res.json({ gid:   context.group.gid,
					    alias: context.group.alias,
					    users: aliases });
				 context.aliases = aliases;
				 return context;
			     });
	       
	       
	       //console.log(context);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
    
});


////////////////////////////////////////////////////////////////////////////////
// USER
////////////////////////////////////////////////////////////////////////////////
// CREATE USER
////////////////////////////////////////////////////////////////////////////////
app.post('/api/users', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'user creator';
    var uid1 = onerva.util.generateOnervaID();
    var uid2 = onerva.util.generateOnervaID();
    var uid3 = onerva.util.generateOnervaID();
    var user = req.body.user; // check this

    user.uid = uid1;

    // Check input 
    if ( ( ! user       ) ||
	 ( ! user.alias ) ||
	 ( ! user.email ) ) {
	res.json({ error: 'Invalid user data', context: { 'user': user }});
	return;
    }

    user.email = user.email.toLowerCase();
    
    // Create random password, if does not exists
    if ( ! user.password ) {
	user.password = onerva.util.generateOnervaID();
	user.password = user.password.substring(0,4*4+3);
	// DEBUG
	//console.log('Password ' + user.password);
    }
    // Create random PIN, if does not exists
    if ( ! user.pin ) {
	user.pin = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
	// DEBUG
	//console.log('PIN ' + user.pin);
    }
    
    // utility function for retrying UID
    function retryNextUID(uid) {
	return function(error) {  //  if exists, retry with another uid
	    if ( error.message.startsWith('UID exists') ) {
		console.log(error.message + ' trying new UID: ' + uid);
		user.uid = uid;
		return onerva.user.isNewUID(uid)(error.context)
	    }
	    else
		throw error;
	};
    }

    // for permissions
    var start_timestamp = onerva.util.getTimestamp(0, -1.0);
    var end_timestamp = onerva.util.getTimestamp(0, 100*365*24*60*60);

    var emailType = 'first';

    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
	   .then(onerva.auth.fetchPermissions(role, '*'))
	   .then(onerva.auth.hasPermissionNow())
	   .then(onerva.user.isNewUID(uid1))
	   .catch(retryNextUID(uid2))
	   .catch(retryNextUID(uid3))
	   .then(function(context) {
	       // Use username, uid, password and pin to calculate hashes
	       user.pass_hash = onerva.auth.calculatePassHash(user.email, user.password, user.pin);
	       user.auth_hash = onerva.auth.calculateAuthHash(user.uid, user.password, user.pin);
	       user.pin_hash  = onerva.auth.calculatePinHash(user.auth_hash, user.pin);

	       console.log(user);
	       context.user = user;
	       
	       return context;
	   })
	   .then(onerva.user.insertUser(user))
	   .then(function(context) {
	       // Add permissions for sender and new user
	       // to write and read new user
	       
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'user writer',
		   target: 'uid-' + context.user.uid,
		   start_timestamp: start_timestamp, 
		   end_timestamp:   end_timestamp,
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'user reader',
		   target: 'uid-' + context.user.uid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let permission = {
		   owner:  'uid-' + context.user.uid,
		   role:   'user writer',
		   target: 'uid-' + context.user.uid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let permission = {
		   owner:  'uid-' + context.user.uid,
		   role:   'user reader',
		   target: 'uid-' + context.user.uid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
    /* DOESNT WORK BECAUSE NO GROUP PERMISSIONS ARE SET YET
    // FETCH USER'S PERMISSIONS HERE, SENDER = USER, ROLE = *, TARGET = *
	.then(function(context) {
	    context.sender.uid = context.user.uid;
	    context.sender.gids = [];
	    return context;
	})
	.then(onerva.auth.fetchPermissions('*','*'))
    */
	   .then(onerva.user.sendLoginEmail(emailType))
	   .then(function(context) {
	       // Remove sensitive info before sending response
	       let user = context.user;
	       delete user.password;
	       delete user.pin;
	       delete user.pass_hash;
	       delete user.pin_hash;
	       delete user.auth_hash;
	       console.log(user);
	       res.json(user);
	   })
	   .catch(function(error) {
	       console.log(error);
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// WRITE USER
////////////////////////////////////////////////////////////////////////////////
app.post('/api/users/:uid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'user writer';
    var uid    = req.params.uid;
    var target = 'uid-' + uid;
    var user   = req.body.user;

    console.log(user);
    
    // Check input 
    if ( ( ! user ) ||
	 ( ! user.alias ) ) {
	res.json({ error: 'Invalid user data', context: { 'user': user }});
	return;
    }
    if ( user.uid != uid ) {
	res.json({ error: 'User IDs do not match', context: { 'user': user }});
	return;
    }

    var emailType = 'none';   
    if ( user && ( user.email || user.password || user.pin ) ) {
	sendMail = 'update';
	if ( ( ! user.alias ) ||
	     ( ! user.email ) ||
	     ( ! user.password ) ||
	     ( ! user.pin ) ) {
	    res.json({ error: 'Invalid user data when setting email, password and PIN', context: { 'user': user }});
	    return;
	}
	
	user.email = user.email.toLowerCase();
    }

    // Don't allow direct changes
    user.uid = uid;
    if ( user.pass_hash ) delete user.pass_hash;
    if ( user.auth_hash ) delete user.auth_hash;
    if ( user.pin_hash  ) delete user.pin_hash;

    
    // Replace password and pin by hashes
    if ( user.password && user.pin ) {
	user.pass_hash = onerva.auth.calculatePassHash(user.email, user.password, user.pin);
	user.auth_hash = onerva.auth.calculateAuthHash(user.uid, user.password, user.pin);
	user.pin_hash = onerva.auth.calculatePinHash(user.auth_hash, user.pin);
    }
    
    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.user.fetchUser(uid))
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
	.then(onerva.user.updateUser(user))
    /* DOESNT WORK BECAUSE NO GROUP PERMISSIONS ARE SET YET
        // FETCH USER'S PERMISSIONS HERE, SENDER = USER, ROLE = *, TARGET = *
	.then(function(context) {
	    context.sender.uid = context.user.uid;
	    context.sender.gids = [];
	    return context;
	})
	.then(onerva.auth.fetchPermissions('*','*'))
    */
    	   .then(onerva.user.sendLoginEmail(emailType))
	   .then(function(context) {
	       console.log(context);
	       // remove sensitive info before sending
	       let user = context.user;
	       delete user.password;
	       delete user.pin;
	       delete user.pass_hash;
	       delete user.pin_hash;
	       delete user.auth_hash;
	       
	       res.json(user);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// READ USER
////////////////////////////////////////////////////////////////////////////////
app.get('/api/users/:uid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'user reader';
    var uid    = req.params.uid;
    var target = 'uid-' + uid;
    
    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.user.fetchUser(uid))
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
	   .then(function(context) {
	       res.json(context.user);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// CHAT
////////////////////////////////////////////////////////////////////////////////
// CREATE CHAT
////////////////////////////////////////////////////////////////////////////////
app.post('/api/chats', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'chat creator';
    var cid1 = onerva.util.generateOnervaID();
    var cid2 = onerva.util.generateOnervaID();
    var cid3 = onerva.util.generateOnervaID();
    var chat = req.body.chat; // check this

    chat.cid = cid1;
    
    // Check input 
    if ( ( ! chat       ) ||
	 ( ! chat.alias ) ||
	 ( ! chat.actions ) ) {
	res.json({ error: 'Invalid chat data', context: { 'chat': chat }});
	return;
    }

    
    // utility function for retrying CID
    function retryNextCID(cid) {
	return function(error) {  //  if exists, retry with another cid
	    if ( error.message.startsWith('CID exists') ) {
		console.log(error.message + ' trying new CID: ' + cid);
		chat.cid = cid;
		return onerva.chat.isNewCID(cid)(error.context)
	    }
	    else
		throw error;
	};
    }

    // for permissions
    var start_timestamp = onerva.util.getTimestamp(0, -1.0);
    var end_timestamp = onerva.util.getTimestamp(0, 100*365*24*60*60);


    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
	   .then(onerva.auth.fetchPermissions(role, '*'))
	   .then(onerva.auth.hasPermissionNow())
	   .then(onerva.chat.isNewCID(cid1))
	   .catch(retryNextCID(cid2))
	   .catch(retryNextCID(cid3))
	   .then(function(context) {
	       context.chat = chat;
	       return context;
	   })
	   .then(onerva.chat.insertChat(chat))
	   .then(function(context) {
	       // Add permissions for sender
	       // to write and read new chat	       
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'chat writer',
		   target: 'cid-' + context.chat.cid,
		   start_timestamp: start_timestamp, 
		   end_timestamp:   end_timestamp,
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'chat reader',
		   target: 'cid-' + context.chat.cid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'entry creator',
		   target: 'cid-' + context.chat.cid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'entry reader',
		   target: 'cid-' + context.chat.cid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       // Remove sensitive info before sending response
	       let chat = context.chat;	       
	       res.json(chat);
	   })
	   .catch(function(error) {
	       console.log(error);
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// WRITE CHAT
////////////////////////////////////////////////////////////////////////////////
app.post('/api/chats/:cid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'chat writer';
    var cid    = req.params.cid;
    var target = 'cid-' + cid;
    var chat   = req.body.chat;

    // Check input 
    if ( ( ! chat ) ||
	 ( ! chat.alias ) ||
	 ( ! chat.actions ) ) {
	res.json({ error: 'Invalid chat data', context: { 'chat': chat }});
	return;
    }
    if ( chat.cid != cid ) {
	res.json({ error: 'Chat IDs do not match', context: { 'chat': chat }});
	return;
    }

    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.chat.fetchChat(cid))
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
	   .then(onerva.chat.updateChat(chat))
    // remember that update chat should not update description, it's a special entry
	   .then(function(context) {
	       let chat = context.chat;
	       res.json(chat);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// READ CHAT
////////////////////////////////////////////////////////////////////////////////
app.get('/api/chats/:cid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'chat reader';
    var cid    = req.params.cid;
    var target = 'cid-' + cid;
    
    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.chat.fetchChat(cid))
	   .then(onerva.auth.fetchPermissions(role, target))
    // .then(onerva.auth.hasPermissionNow())
    // .then(onerva.chat.fetchPermittedDescription(cid))
    // .then(onerva.chat.fetchPermittedActions(cid))
	   .then(function(context) {
	       res.json(context.chat);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// CREATE ENTRY
////////////////////////////////////////////////////////////////////////////////
app.post('/api/chats/:cid/entries', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'entry creator';
    var cid    = req.params.cid;
    var target = 'cid-' + cid;
    var entry   = req.body.entry;


    //console.log(entry);
    
    // Check input
    // { "timestamp", "chat" : { "alias", "cid"}, "user" : { "alias", "uid" }, type: "message/visit/description/sensor", "mood", "ability", "actions": [], "message", 
    if ( ( ! entry ) ||
	 ( ! entry.timestamp  ) ||
 	 ( ! entry.user       ) ||
	 ( ! entry.user.alias ) ||
	 ( ! entry.user.uid   ) ||
	 ( ! entry.chat       ) ||
	 ( ! entry.chat.alias ) ||
	 ( ! entry.chat.cid   ) ||
 	 ( ! entry.type       ) ) {
	res.json({ error: 'Invalid entry data', context: { entry: entry }});
	return;
    }
    if ( entry.chat.cid != cid ) {
	res.json({ error: 'Chat IDs do not match', context: { 'chat': chat }});
	return;
    }

    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.chat.fetchChat(cid))
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
	   .then(onerva.chat.insertEntry(entry))
	   .then(function(context) {
	       let entry = context.entry;
	       //console.log(entry);
	       res.json(entry);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});

////////////////////////////////////////////////////////////////////////////////
// READ ENTRIES
////////////////////////////////////////////////////////////////////////////////
app.get('/api/chats/:cid/entries/:type-:offset-:limit', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'entry reader';
    var cid    = req.params.cid;
    var target = 'cid-' + cid
    var type   = req.params.type;
    var offset = parseInt(req.params.offset);
    var limit  = parseInt(req.params.limit);
    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
	   .then(onerva.auth.fetchPermissions(role, target))
    	   .then(onerva.chat.fetchPermittedEntries(cid, type, offset, limit))
	   .then(function(context) {
	       //console.log(context.entries);
	       res.json(context.entries);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});



////////////////////////////////////////////////////////////////////////////////
// GROUP
////////////////////////////////////////////////////////////////////////////////
// CREATE GROUP
////////////////////////////////////////////////////////////////////////////////
app.post('/api/groups', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'group creator';
    var gid1 = onerva.util.generateOnervaID();
    var gid2 = onerva.util.generateOnervaID();
    var gid3 = onerva.util.generateOnervaID();
    var group = req.body.group;

    group.gid = gid1;
    
    
    // Check input 
    if ( ( ! group ) ||
	 ( ! group.alias ) ) {
	res.json({ error: 'Invalid group data', context: { 'group': group }});
	return;
    }

    // add empty users and chats, if do not exist
    if ( ! group.users )
	group.users = [];
    if ( ! group.chats )
	group.chats = [];

    // utility function for retrying GID
    function retryNextGID(gid) {
	return function(error) {  //  if exists, retry with another gid
	    if ( error.message.startsWith('GID exists') ) {
		console.log(error.message + ' trying new GID: ' + gid);
		group.gid = gid;
		return onerva.group.isNewGID(gid)(error.context)
	    }
	    else
		throw error;
	};
    }

    // for permissions
    var start_timestamp = onerva.util.getTimestamp(0, -1.0);
    var end_timestamp = onerva.util.getTimestamp(0, 100*365*24*60*60);

    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
	   .then(onerva.auth.fetchPermissions(role, '*'))
	   .then(onerva.auth.hasPermissionNow())
	   .then(onerva.group.isNewGID(gid1))
	   .catch(retryNextGID(gid2))
	   .catch(retryNextGID(gid3))
	   .then(onerva.group.insertGroup(group))
	   .then(function(context) {
	       // Add permissions for sender to update the group
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'group writer',
		   target: 'gid-' + context.group.gid,
		   start_timestamp: start_timestamp, 
		   end_timestamp:   end_timestamp,
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       // Add permissions for sender to read the group
	       let permission = {
		   owner:  'uid-' + context.sender.uid,
		   role:   'group reader',
		   target: 'gid-' + context.group.gid,
		   start_timestamp: start_timestamp,
		   end_timestamp:   end_timestamp
	       }
	       return onerva.auth.insertPermission(permission)(context);
	   })
	   .then(function(context) {
	       let promises = [];

	       // Add permissions for user to read group
	       for(let i = 0; i < group.users.length; ++i) {
		   let permission = {
		       owner:  'uid-' + context.group.users[i].uid,
		       role:   'group reader',
		       target: 'gid-' + context.group.gid,
		       start_timestamp: start_timestamp,
		       end_timestamp:   end_timestamp
		   }
		   promises.push(onerva.auth.insertPermission(permission)(context));
	       }

	       
	       // Add permissions to read chat
	       // and create and read entries
	       for(let i = 0; i < group.chats.length; ++i) {
		   let permission = {
		       owner:  'gid-' + context.group.gid,
		       role:   'chat reader',
		       target: 'cid-' + context.group.chats[i].cid,
		       start_timestamp: start_timestamp,
		       end_timestamp:   end_timestamp
		   }
		   promises.push(onerva.auth.insertPermission(permission)(context));
		   permission.role = 'entry creator';
		   promises.push(onerva.auth.insertPermission(permission)(context));
		   permission.role = 'entry reader';
		   promises.push(onerva.auth.insertPermission(permission)(context));
	       }

	       return Promise.all(promises)
			     .then(function(context_array) {
				 return context; 
			     });
	   })
	   .then(function(context) {
	       let group = context.group;	       
	       res.json(group);
	   })
	   .catch(function(error) {
	       console.log(error);
	       res.json(onerva.util.errorToJson(error));
	   });
});


////////////////////////////////////////////////////////////////////////////////
// READ GROUP
////////////////////////////////////////////////////////////////////////////////
app.get('/api/groups/:gid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'group reader';
    var gid    = req.params.gid;
    var target = 'gid-' + gid;
    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.group.fetchGroup(gid))
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
	   .then(function(context) {
	       res.json(context.group);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});



////////////////////////////////////////////////////////////////////////////////
// WRITE GROUP
////////////////////////////////////////////////////////////////////////////////
app.post('/api/groups/:gid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = 'group writer';
    var gid    = req.params.gid;
    var target = 'gid-' + gid;
    var group  = req.body.group;

    // Check input 
    if ( ( ! group ) ||
	 ( ! group.alias ) ||
	 ( ! group.users ) ||
	 ( ! group.chats ) ) {
	res.json({ error: 'Invalid group data', context: { 'group': group }});
	return;
    }
    if ( group.gid != gid ) {
	res.json({ error: 'Group IDs do not match', context: { 'group': group }});
	return;
    }

    console.log(group);

    // Don't allow direct changes
    group.gid = gid;

    
    // for permissions
    var start_timestamp = onerva.util.getTimestamp(0, -1.0);
    var end_timestamp = onerva.util.getTimestamp(0, 100*365*24*60*60);

    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
    	   .then(onerva.group.fetchGroup(gid))
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
           .then(function(context) {
	       let promises = [];

	       // update permissions first
	       // context group = old group
	       // group = new group
	       
	       let new_uids = group.users.map(function(item) { return item.uid; });
	       let old_uids = context.group.users.map(function(item) { return item.uid; });

	       //console.log('---UIDS---');
	       //console.log('old: ' + JSON.stringify(old_uids));
	       //console.log('new: ' + JSON.stringify(new_uids));

	       new_uids = new Set(new_uids);
	       old_uids = new Set(old_uids);
	       
	       let exp_uids = new Set(old_uids);
	       for(let elem of new_uids)
		   exp_uids.delete(elem);

	       for(let elem of old_uids)
		   new_uids.delete(elem);

	       exp_uids = [...exp_uids];
	       new_uids = [...new_uids];

	       console.log('exp: ' + JSON.stringify(exp_uids));
	       console.log('new: ' + JSON.stringify(new_uids));

	       
	       // Add permissions to read user
	       for(let i = 0; i < new_uids.length; ++i) {
		   let permission = {
		       owner:  'uid-' + new_uids[i],
		       role:   'group reader',
		       target: 'gid-' + context.group.gid,
		       start_timestamp: start_timestamp,
		       end_timestamp:   end_timestamp
		   }
		   promises.push(onerva.auth.insertPermission(permission)(context));
		   //console.log('new permission for ' + new_uids[i]);
	       }


	       // Expire permissions to read user
	       for(let i = 0; i < exp_uids.length; ++i) {
		   let permission = {
		       owner:  'uid-' + exp_uids[i],
		       role:   'group reader',
		       target: 'gid-' + context.group.gid,
		       end_timestamp:   start_timestamp,
		       //start_timestamp: start_timestamp,
		       //end_timestamp:   end_timestamp
		   }
		   promises.push(onerva.auth.expirePermission(permission)(context));
		   //console.log('expired permission for ' + exp_uids[i]);
	       }
	       
	       return Promise.all(promises)
			     .then(function(context_array) {
				 return context; 
			     });
	   })
    	   .then(function(context) {
	       let promises = [];
	       
	       // update permissions first
	       // context group = old group
	       // group = new group
	       
	       let new_cids = group.chats.map(function(item) { return item.cid; });
	       let old_cids = context.group.chats.map(function(item) { return item.cid; });
	       
	       //console.log('---CIDS---');
	       //console.log('old: ' + JSON.stringify(old_cids));
	       //console.log('new: ' + JSON.stringify(new_cids));

	       new_cids = new Set(new_cids);
	       old_cids = new Set(old_cids);
	       
	       let exp_cids = new Set(old_cids);
	       for(let elem of new_cids)
		   exp_cids.delete(elem);

	       for(let elem of old_cids)
		   new_cids.delete(elem);

	       exp_cids = [...exp_cids];
	       new_cids = [...new_cids];

	       //console.log('exp: ' + JSON.stringify(exp_cids));
	       //console.log('new: ' + JSON.stringify(new_cids));

	       
	       // Add permissions to read chat
	       // and create and read entries
	       for(let i = 0; i < new_cids.length; ++i) {
		   let permission = {
		       owner:  'gid-' + context.group.gid,
		       role:   'chat reader',
		       target: 'cid-' + new_cids[i],
		       start_timestamp: start_timestamp,
		       end_timestamp:   end_timestamp
		   }
		   promises.push(onerva.auth.insertPermission(permission)(context));
		   permission.role = 'entry creator';
		   promises.push(onerva.auth.insertPermission(permission)(context));
		   permission.role = 'entry reader';
		   promises.push(onerva.auth.insertPermission(permission)(context));
		   //console.log('new permission for ' + new_cids[i]);
	       }


	       // Expire permissions to read chat
	       // and create and read entries
	       for(let i = 0; i < exp_cids.length; ++i) {
		   let permission = {
		       owner:  'gid-' + context.group.gid,
		       role:   'chat reader',
		       target: 'cid-' + exp_cids[i],
		       end_timestamp:   start_timestamp,
		       //start_timestamp: start_timestamp,
		       //end_timestamp:   end_timestamp
		   }
		   promises.push(onerva.auth.expirePermission(permission)(context));
		   permission.role = 'entry creator';
		   promises.push(onerva.auth.expirePermission(permission)(context));
		   permission.role = 'entry reader';
		   promises.push(onerva.auth.expirePermission(permission)(context));
		   //console.log('expired permission for ' + exp_cids[i]);
	       }
	       
	       return Promise.all(promises)
			     .then(function(context_array) {
				 return context; 
			     });
	   })
	   .then(onerva.group.updateGroup(group))
	   .then(function(context) {
	       // remove sensitive info before sending
	       let group = context.group;
	       delete group.password;
	       delete group.pin;
	       delete group.pass_hash;
	       delete group.pin_hash;
	       delete group.auth_hash;
	       
	       res.json(group);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});



////////////////////////////////////////////////////////////////////////////////
// READ PERMISSIONS
////////////////////////////////////////////////////////////////////////////////
app.get('/api/permissions/:uid', function(req, res) {
    var context = {
	db: req.app.locals.db,
    };
    
    var auth_token = req.get('Authorization');
    var role   = '*';
    var target = '*';
    
    Promise.resolve(context)
	   .then(onerva.auth.decodeAuthToken(auth_token))
	   .then(onerva.auth.authenticateSenderWithToken())
	   .then(onerva.auth.verifySenderGroups())
	   .then(onerva.auth.fetchPermissions(role, target))
	   .then(onerva.auth.hasPermissionNow())
	   .then(function(context) {
	       res.json(context.permissions);
	   })
	   .catch(function(error) {
	       res.json(onerva.util.errorToJson(error));
	   });
});



////////////////////////////////////////////////////////////////////////////////
mongo.connect('mongodb://localhost:27017/' + config.db_name)
     .catch(err => console.error(err.stack))
     .then(db => {
	 app.locals.db = db;
	 app.listen(config.port, () => {
	     console.log(`Listening at http://localhost:${config.port}/`);
	 });
     });

////////////////////////////////////////////////////////////////////////////////
