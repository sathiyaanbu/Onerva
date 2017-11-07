var config = require('./config.js');

/////////////////////////////////////////////////////////////////////////////////
var mongo = require('mongodb').MongoClient;

var onerva = {};
onerva.auth  = require('./onerva.server.v2.auth.js');

function initDatabase(context) {
    if ( config.db_name != 'onerva2_test' )
	throw "Wrong database";
    console.log(config.db_name);

    return mongo.connect('mongodb://127.0.0.1:27017' + config.db_name)
	.then(db => {
		context.db = db;
		return context;
	    })
	.then(function(context) {		
		if ( process.env.REMOVE_ALL_COLLECTIONS ) {
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
		}
		else 
		    return context;
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
			      .createIndex({ timestamp: -1, 'user.uid': 1, 'chat.cid': 1 },
					   { unique: true, background: false, dropDups: true, w:1 }));
		return Promise.all(promises)
		    .then(function(results) {
			    context.results = results;
			    return context;
			});
	    })
	.then(function(context) {
		console.log(context);
		return context;
	    })
	.catch(function(error) {
		console.log(error);
		throw error;
	    });
}


var context = {};
initDatabase(context).then(function(context) {
	console.log('Done');
	process.exit(0);
    });
