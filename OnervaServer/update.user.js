var config = require('./config.js');

/////////////////////////////////////////////////////////////////////////////////
var mongo = require('mongodb').MongoClient;

var onerva = {};
onerva.util  = require('./onerva.server.v2.util.js');
onerva.auth  = require('./onerva.server.v2.auth.js');
onerva.user  = require('./onerva.server.v2.user.js');
onerva.group  = require('./onerva.server.v2.group.js');

////////////////////////////////////////////////////////////////////////////////
function updateUser(uid, alias, email, password, pin) {
    var user = {};
    user.uid = uid;
    user.alias = alias;
    user.email = email;
    user.password = password;
    user.pin = pin;

    user.pass_hash = onerva.auth.calculatePassHash(user.email, user.password, user.pin);
    user.auth_hash = onerva.auth.calculateAuthHash(user.uid, user.password, user.pin);
    user.pin_hash = onerva.auth.calculatePinHash(user.auth_hash, user.pin);
    console.log(user);

    
    return mongo.connect('mongodb://127.0.0.1:27017' + config.db_name)
	.then(db => {
		context.db = db;
		return context;
	    })
	.then(function(context) {
	    return context.db.collection('users').update({ uid: user.uid },
							 { $set: user },
							 {w:1})
	})
	.then(function(cursor) {
	    //console.log(cursor);
	    if ( ! cursor.result.ok )
		throw new onerva.error.OnervaError('Update user failed.', context);
	    context.user = user;
	    return context;
	});
}


var context = {};


let user_uid    = process.env.USER_UID;
let user_alias  = process.env.USER_ALIAS;
let user_email  = process.env.USER_EMAIL;
let user_passwd = process.env.USER_PASSWD;
let user_pin    = process.env.USER_PIN;

if ( ( ! user_uid ) ||
     ( ! user_alias ) ||
     ( ! user_email ) ||
     ( ! user_passwd ) ||
     ( ! user_pin ) ) {

    console.log('USER_UID, USER_ALIAS, USER_EMAIL, USER_PASSWD, and USER_PIN must be set.');
    process.exit(0);
}


console.log(user_uid + ' ' + user_alias + ' ' + user_email + ' ' + user_passwd + ' ' + user_pin);
updateUser(user_uid, user_alias, user_email, user_passwd, user_pin)
    .then(function(array) {
	    //console.log(array);
	    process.exit(0);
	});

