var config = require('./config.js');

/////////////////////////////////////////////////////////////////////////////////
var mongo = require('mongodb').MongoClient;

var onerva = {};
onerva.util  = require('./onerva.server.v2.util.js');
onerva.auth  = require('./onerva.server.v2.auth.js');
onerva.user  = require('./onerva.server.v2.user.js');
onerva.group  = require('./onerva.server.v2.group.js');

////////////////////////////////////////////////////////////////////////////////
function addAdmin(group_name, alias, email, password, pin) {
    var user = {};
    user.alias = alias;
    user.email = email;
    user.password = password;
    user.pin = pin;

    user.uid = onerva.util.generateOnervaID();

    user.pass_hash = onerva.auth.calculatePassHash(user.email, user.password, user.pin);
    user.auth_hash = onerva.auth.calculateAuthHash(user.uid, user.password, user.pin);
    user.pin_hash = onerva.auth.calculatePinHash(user.auth_hash, user.pin);
    console.log(user);


    var group = {};
    group.gid = onerva.util.generateOnervaID();
    group.alias = group_name;
    group.role = 'caregiver';
    group.users = [];
    group.chats = [];
    console.log(group);

    
    // for permissions
    var start_timestamp = onerva.util.getTimestamp(0, -1.0);
    var end_timestamp = onerva.util.getTimestamp(0, 100*365*24*60*60);
    
    var permissions = [
	{
	    owner:  'uid-' + user.uid,
	    role:   'user creator',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-' + user.uid,
	    role:   'chat creator',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-' + user.uid,
	    role:   'group creator',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-' + user.uid,
	    role:   'user reader',
	    target: 'uid-' + user.uid,
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-' + user.uid,
	    role:   'user writer',
	    target: 'uid-' + user.uid,
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	}
	/*
	{
	    owner:  'uid-' + user.uid,
	    role:   'permission reader',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	}
	*/
    ];
    
    return mongo.connect('mongodb://127.0.0.1:27017' + config.db_name)
	.then(db => {
		context.db = db;
		return context;
	    })
	.then(onerva.user.insertUser(user))
	.then(function(context) {
	    var promises = [];
	    for(let i = 0; i < permissions.length; ++i) {
		//console.log('Adding permission: ' + JSON.stringify(permissions[i]));
		promises.push(onerva.auth.insertPermission(permissions[i]) (context) );
	    }
	    return Promise.all(promises).then(function(array) {
		return context; });
	})
	.then(onerva.group.insertGroup(group))
    	.then(function(context) {
	    console.log(context);
	    // Add permissions for sender to update the group
	    // SENDER replaced by USER here
	    let permission = {
		owner:  'uid-' + context.user.uid,
		role:   'group writer',
		target: 'gid-' + context.group.gid,
		start_timestamp: start_timestamp, 
		end_timestamp:   end_timestamp,
	    }
	    console.log(permission);
	    return onerva.auth.insertPermission(permission)(context);
	})
	.then(function(context) {
	    // Add permissions for sender to read the group
	    let permission = {
		owner:  'uid-' + context.user.uid,
		role:   'group reader',
		target: 'gid-' + context.group.gid,
		start_timestamp: start_timestamp,
		end_timestamp:   end_timestamp
	    }
	    console.log(permission);
	    return onerva.auth.insertPermission(permission)(context);
	})
	.then(function(context) {
	    let promises = [];

	    /*
	    // Add permission for group to read itself
	    let permission = {
		owner:  'gid-' + context.group.gid,
		role:   'group reader',
		target: 'gid-' + context.group.gid,
		start_timestamp: start_timestamp,
		end_timestamp:   end_timestamp
	    }
	    console.log(permission);
	    */
	    
	    return Promise.all(promises)
		.then(function(context_array) {
		    return context; 
		});
	})
	.catch(function(error) {
		//console.log(error);
		throw error;
	    });
}


var context = {};


let group_alias  = process.env.GROUP_ALIAS;
let admin_alias  = process.env.ADMIN_ALIAS;
let admin_email  = process.env.ADMIN_EMAIL;
let admin_passwd = process.env.ADMIN_PASSWD;
let admin_pin    = process.env.ADMIN_PIN;

if ( ( ! group_alias ) ||
     ( ! admin_alias ) ||
     ( ! admin_email ) ||
     ( ! admin_passwd ) ||
     ( ! admin_pin ) ) {

    console.log('GROUP_ALIAS, ADMIN_ALIAS, ADMIN_EMAIL, ADMIN_PASSWD, and ADMIN_PIN must be set.');
    process.exit(0);
}


console.log(group_alias + ' ' + admin_alias + ' ' + admin_email + ' ' + admin_passwd + ' ' + admin_pin);
addAdmin(group_alias, admin_alias, admin_email, admin_passwd, admin_pin)
    .then(function(array) {
	    //console.log(array);
	    process.exit(0);
	});

addAdmin('Onervahoiva', 'Sathiya', 'msnature12@gmail.com', 'Onerva12345', '2345')
    .then(function(array) {
	    //console.log(array);
	    process.exit(0);
	});

/*
addAdmin('Onervahoiva', 'Lauri', 'lauri@onervahoiva.fi', 'Onerva1234', '1234')
    .then(function(array) {
	    //console.log(array);
	    process.exit(0);
	});
*/
