var config = require('./test.config.js');

/////////////////////////////////////////////////////////////////////////////////
var mongo      = require('mongodb').MongoClient;

/////////////////////////////////////////////////////////////////////////////////
var onerva = {};
onerva.util  = require('../../onerva.server.v2.util.js');
onerva.auth  = require('../../onerva.server.v2.auth.js');
onerva.user  = require('../../onerva.server.v2.user.js');
//onerva.chat  = require('../../onerva.server.v2.chat.js');
//onerva.group = require('../../onerva.server.v2.group.js');

/////////////////////////////////////////////////////////////////////////////////
var test = {};
test.setup = {}

/////////////////////////////////////////////////////////////////////////////////
test.setup.initDatabase = function(context) {
    var user = context.sender;
    user.pass_hash = onerva.auth.calculatePassHash(user.email, user.password, user.pin);
    user.auth_hash = onerva.auth.calculateAuthHash(user.uid, user.password, user.pin);
    user.pin_hash = onerva.auth.calculatePinHash(user.auth_hash, user.pin);

    // for permissions
    var start_timestamp = onerva.util.getTimestamp(0, -1.0);
    var end_timestamp = onerva.util.getTimestamp(0, 100*365*24*60*60);
    
    var permissions = [
	{
	    owner:  'uid-12345',
	    role:   'user creator',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-12345',
	    role:   'chat creator',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-12345',
	    role:   'group creator',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-12345',
	    role:   'user reader',
	    target: 'uid-12345',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-12345',
	    role:   'user writer',
	    target: 'uid-12345',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	},
	{
	    owner:  'uid-12345',
	    role:   'permission reader',
	    target: '*',
	    start_timestamp: start_timestamp,
	    end_timestamp:   end_timestamp,
	}
    ];

    return mongo.connect('mongodb://localhost:27017/' + config.db_name)
		.then(db => {
		    context.db = db;
		    return context;
		})
		.then(function(context) {
		    var promises = [];
		    promises.push(context.db.dropCollection('attempts'));
		    promises.push(context.db.dropCollection('permissions'));
		    promises.push(context.db.dropCollection('users'));
		    promises.push(context.db.dropCollection('chats'));
		    promises.push(context.db.dropCollection('groups'));
		    promises.push(context.db.dropCollection('entries'));
		    return Promise.all(promises)
				  .then(function(results) {
				      context.results = results;
				      return context;
				  }).catch(function(error) {
				      console.log(error);
				      return context;
				  });
		})
		.then(function(context) {
		    var promises = [];
		    promises.push(context.db.createCollection('attempts'));
		    promises.push(context.db.createCollection('permissions'));
		    promises.push(context.db.createCollection('users'));
		    promises.push(context.db.createCollection('chats'));
		    promises.push(context.db.createCollection('groups'));
		    promises.push(context.db.createCollection('entries'));
		    return Promise.all(promises)
				  .then(function(results) {
				      context.results = results;
				      return context;
				  });
		})
		.then(function(context) {
		    var promises = [];
		    // attempts and permissions, is not unique, all other are
		    promises.push(context.db.collection('attempts')
					 .createIndex({ email:1, time: -1 },
						      { unique: false, background: false, dropDups: true, w:1 }));
		    promises.push(context.db.collection('permissions')
					 .createIndex({ owner:1, role:1, target: 1 },
						      { unique: false, background: false, dropDups: true, w:1 }));
		    promises.push(context.db.collection('users')
					 .createIndex({ uid: 1 },
						      { unique: true, background: false, dropDups: true, w:1 }));
		    promises.push(context.db.collection('users')
					 .createIndex({ email: 1 },
						      { unique: true, background: false, dropDups: true, w:1 }));
		    promises.push(context.db.collection('chats')
					 .createIndex({ cid: 1 },
						      { unique: true, background: false, dropDups: true, w:1 }));
		    promises.push(context.db.collection('groups')
					 .createIndex({ gid: 1 },
						      { unique: true, background: false, dropDups: true, w:1 }));
		    promises.push(context.db.collection('entries')
					 .createIndex({ timestamp: -1, uid: 1, cid: 1 },
						      { unique: true, background: false, dropDups: true, w:1 }));
		    return Promise.all(promises)
				  .then(function(results) {
				      context.results = results;
				      return context;
				  });
		})
		.then(function(context) {
		    //console.log(context);
		    return context;
		})
		.then(onerva.user.insertUser(user))
		.then(function(context) {
		    var promises = [];
		    for(let i = 0; i < permissions.length; ++i) {
			//console.log('Adding permission: ' + JSON.stringify(permissions[i]));
			promises.push(onerva.auth.insertPermission(permissions[i]) (context) );
		    }
		    return Promise.all(promises);
		})
		.catch(function(error) {
		    //console.log(error);
		    throw error;
		});
}

////////////////////////////////////////////////////////////////////////////////
module.exports = test.setup;
