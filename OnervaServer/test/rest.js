var assert = require('assert');

////////////////////////////////////////////////////////////////////////////////
var onerva = {};
onerva.util  = require('../onerva.server.v2.util.js');
onerva.auth  = require('../onerva.server.v2.auth.js');
onerva.user  = require('../onerva.server.v2.user.js');
//onerva.chat  = require('../onerva.server.v2.chat.js');
onerva.group = require('../onerva.server.v2.group.js');

////////////////////////////////////////////////////////////////////////////////
var test = {};
test.setup = require('./lib/test.setup.js');

test.rest = {};
test.rest.auth = require('./lib/test.rest.auth.js');
test.rest.user = require('./lib/test.rest.user.js');
test.rest.chat = require('./lib/test.rest.chat.js');
test.rest.group = require('./lib/test.rest.group.js');
test.rest.admin = require('./lib/test.rest.admin.js');


////////////////////////////////////////////////////////////////////////////////
var context = {};

var test_data = require('./lib/test.data.js');

var admin = test_data.admin;

var user1 = test_data.user1;
var user2 = test_data.user2;
var user3 = test_data.user3;

var chat1 = test_data.chat1;
var chat2 = test_data.chat2;

var group1 = test_data.group1;
var group2 = test_data.group2;


////////////////////////////////////////////////////////////////////////////////
describe('Onerva', function() {
    
    ////////////////////////////////////////////////////////////////////////////
    describe('REST', function() {
	
	////////////////////////////////////////////////////////////////////////
	// admin login
	////////////////////////////////////////////////////////////////////////
	describe('admin login', function() {

	    ////////////////////////////////////////////////////////////////////
	    it('with password', function() {
		this.timeout(5000);
		context.sender = admin;
		return test.rest.auth.loginWithPassword(context)
		    .then(function(context) {
			assert.equal(onerva.auth.encodeAuthToken(context.auth_token), test_data.admin.auth_token);
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('with wrong email', function() {
		context.sender = admin;
		context.sender.email = 'xxx';
		return test.rest.auth.loginWithPassword(context)
		    .then(function(context) {
			return Promise.reject(new Error('Should not return valid user'));
		    })
		    .catch(function(error) {
			//console.log(error);
			return Promise.resolve(error);
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('with wrong password', function() {
		context.sender = admin;
		context.sender.password = 'xxx';
		return test.rest.auth.loginWithPassword(context)
		    .then(function(context) {
			return Promise.reject(new Error('Should not return valid user'));
		    })
		    .catch(function(error) {
			//console.log(error);
			return Promise.resolve(error);
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('with wrong pin multiple times', function() {
		this.timeout(5000);
		
		context.sender = admin;
		context.sender.pin = 'xxx';

		for(let i = 0; i < 0; ++i)
		    test.rest.auth.loginWithPassword(context)
			.then(function(context) {
			    return Promise.reject(new Error('Should not return valid user'));
			})
			.catch(function(error) {
			    //console.log(error);
			    return Promise.resolve(error);
			});

		return test.rest.auth.loginWithPassword(context)
		    .then(function(context) {
			return Promise.reject(new Error('Should not return valid user'));
		    })
		    .catch(function(error) {
			//console.log(error.message);
			return Promise.resolve(error);
		    });
	    });


	});

	////////////////////////////////////////////////////////////////////////
	// admin permissions
	////////////////////////////////////////////////////////////////////////
	describe('admin: ', function() {

	    ////////////////////////////////////////////////////////////////////
	    it('read permissions', function() {
		context.sender = admin;
		return test.rest.admin.readPermissions(context)
		    .then(function(context) {
			//console.log(user3);
			return context;
		    });
	    });
	});
	
	////////////////////////////////////////////////////////////////////////
	// user as admin
	////////////////////////////////////////////////////////////////////////
	describe('modify user as admin: ', function() {

	    ////////////////////////////////////////////////////////////////////
	    it('create user #1', function() {
		context.sender = admin;
		context.user = user1;
		return test.rest.user.createUser(context)
		    .then(function(context) {
			user1.uid = context.user.uid; // unnecessary because passing reference in above
			//console.log(user1);
			return context;
		    });
	    });
	    ////////////////////////////////////////////////////////////////////
	    it('create user #2', function() {
		context.sender = admin;
		context.user = user2;
		return test.rest.user.createUser(context)
		    .then(function(context) {
			user2.uid = context.user.uid;
			//console.log(user2);
			return context;
		    });
	    });
	    ////////////////////////////////////////////////////////////////////
	    it('create user #3', function() {
		context.sender = admin;
		context.user = user3;
		return test.rest.user.createUser(context)
		    .then(function(context) {
			user3.uid = context.user.uid;
			//console.log(user3);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('read user #3', function() {
		context.sender = admin;
		context.user = user3;
		return test.rest.user.readUser(context)
		    .then(function(context) {
			//console.log(user3);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('write user #3', function() {
		user3.alias = 'Pirjo';
		context.sender = admin;
		context.user = user3;
		return test.rest.user.writeUser(context)
		    .then(function(context) {
			//console.log(user3);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('re-read user #3', function() {
		context.sender = admin;
		context.user = user3;
		return test.rest.user.readUser(context)
		    .then(function(context) {
			//console.log(user3);
			return context;
		    });
	    });

	});

	
	////////////////////////////////////////////////////////////////////////
	// chat as admin
	////////////////////////////////////////////////////////////////////////
	describe('modify chat as admin: ', function() {

	    ////////////////////////////////////////////////////////////////////
	    it('create chat #1', function() {
		context.sender = admin;
		context.chat = chat1;
		return test.rest.chat.createChat(context)
		    .then(function(context) {
			chat1.cid = context.chat.cid;
			//console.log(chat1);
			return context;
		    });
	    });
	    ////////////////////////////////////////////////////////////////////
	    it('create chat #2', function() {
		context.sender = admin;
		context.chat = chat2;
		return test.rest.chat.createChat(context)
		    .then(function(context) {
			chat2.cid = context.chat.cid;
			//console.log(chat2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('read chat #2', function() {
		context.sender = admin;
		context.chat = chat2;
		return test.rest.chat.readChat(context)
		    .then(function(context) {
			//console.log(chat2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('write chat #2', function() {
		chat2.alias = 'Reino I.';
		chat2.actions.push('Lääkkeet');
		context.sender = admin;
		context.chat = chat2;
		return test.rest.chat.writeChat(context)
		    .then(function(context) {
			//console.log(chat2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('re-read chat #2', function() {
		context.sender = admin;
		context.chat = chat2;
		return test.rest.chat.readChat(context)
		    .then(function(context) {
			//console.log(chat2);
			return context;
		    });
	    });
	});	    

	
	////////////////////////////////////////////////////////////////////////
	// group as admin
	////////////////////////////////////////////////////////////////////////
	describe('modify group as admin: ', function() {

	    ////////////////////////////////////////////////////////////////////
	    it('create group #1', function() {
		context.sender = admin;
		context.group = group1;
		return test.rest.group.createGroup(context)
		    .then(function(context) {
			group1.gid = context.group.gid;
			//console.log(group1);
			return context;
		    });
	    });
	    ////////////////////////////////////////////////////////////////////
	    it('create group #2', function() {
		context.sender = admin;
		context.group = group2;
		//console.log(group2);
		return test.rest.group.createGroup(context)
		    .then(function(context) {
			group2.gid = context.group.gid;
			//console.log(group2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('read group #2', function() {
		context.sender = admin;
		context.group = group2;
		return test.rest.group.readGroup(context)
		    .then(function(context) {
			//console.log(group2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('write group #2', function() {
		group2.users = [ { uid: user1.uid } ];
		group2.chats = [ { cid: chat1.cid }, { cid: chat2.cid } ];
		context.sender = admin;
		context.group = group2;
		return test.rest.group.writeGroup(context)
		    .then(function(context) {
			//console.log(group2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('re-read group #2', function() {
		context.sender = admin;
		context.group = group2;
		return test.rest.group.readGroup(context)
		    .then(function(context) {
			//console.log(group2);
			return context;
		    });
	    });
	    
	    ////////////////////////////////////////////////////////////////////
	    it('write group #2 again', function() {
		group2.users = [ { uid: user1.uid }, { uid: user3.uid } ];
		group2.chats = [ { cid: chat1.cid } ];
		context.sender = admin;
		context.group = group2;
		return test.rest.group.writeGroup(context)
		    .then(function(context) {
			//console.log(group2);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('re-read group #2 again', function() {
		context.sender = admin;
		context.group = group2;
		return test.rest.group.readGroup(context)
		    .then(function(context) {
			//console.log(group2);
			return context;
		    });
	    });
	});


	////////////////////////////////////////////////////////////////////////
	// chat as admin
	////////////////////////////////////////////////////////////////////////
	describe('normal user behaviour: ', function() {
	    
	    ////////////////////////////////////////////////////////////////////
	    it('login user #3 with password and pin', function() {
		context.sender = user3;
		return test.rest.auth.loginWithPassword(context)
		    .then(function(context) {			
			//console.log(context);
			//user3.auth_token.gids = [];
			user3.auth_token = onerva.auth.encodeAuthToken(context.auth_token);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('write user #3', function() {
		user3.alias = 'Pirjo L';
		// cannot change email, password, or pin without reauthentication
		//user3.password = 'Onerva1357';
		//user3.pin = '2468';
		context.sender = user3;
		context.user = user3;
		return test.rest.user.writeUser(context)
		    .then(function(context) {
			//console.log(user3);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('re-read user #3', function() {
		context.sender = user3;
		context.user = user3;
		return test.rest.user.readUser(context)
		    .then(function(context) {
			//console.log(user3);
			return context;
		    });
	    });

	    
	    ////////////////////////////////////////////////////////////////////
	    it('read user aliases from group #2', function() {
		context.sender = null; //user3;
		context.group = group2;
		return test.rest.group.readGroupAliases(context)
		    .then(function(context) {
			//console.log(context.aliases);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('read chat #1', function() {
		context.sender = user3;
		context.chat = chat1;
		return test.rest.chat.readChat(context)
		    .then(function(context) {
			//console.log(context.chat);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('create entry #1 to chat #1', function() {
		context.sender = user3;
		//console.log(context.sender.auth_token);
		onerva.auth.decodeAuthToken(context.sender.auth_token)(context);
		context.auth_token.gids = [ group2.gid ];
		context.sender.auth_token = onerva.auth.encodeAuthToken(context.auth_token);
		//console.log(context.sender);
		context.chat = chat1;
		context.entry = {
		    timestamp: onerva.util.getTimestamp(),
		    chat: chat1,
		    user: user3,
		    type: 'message',
		    message: 'Test',
		};
		return test.rest.chat.createEntry(context)
		    .then(function(context) {
			//console.log(context.entry);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('create entry #2 to chat #1', function() {
		context.sender = user3;
		//console.log(context.sender.auth_token);
		onerva.auth.decodeAuthToken(context.sender.auth_token)(context);
		context.auth_token.gids = [ group2.gid ];
		context.sender.auth_token = onerva.auth.encodeAuthToken(context.auth_token);
		//console.log(context.sender);
		context.chat = chat1;
		context.entry = {
		    timestamp: onerva.util.getTimestamp(0,-100),
		    chat: chat1,
		    user: user3,
		    type: 'message',
		    message: 'Test2',
		};
		return test.rest.chat.createEntry(context)
		    .then(function(context) {
			//console.log(context.entry);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('create entry #3 to chat #1', function() {
		context.sender = user3;
		//console.log(context.sender.auth_token);
		onerva.auth.decodeAuthToken(context.sender.auth_token)(context);
		context.auth_token.gids = [ group2.gid ];
		context.sender.auth_token = onerva.auth.encodeAuthToken(context.auth_token);
		//console.log(context.sender);
		context.chat = chat1;
		context.entry = {
		    timestamp: onerva.util.getTimestamp(0, 100),
		    chat: chat1,
		    user: user3,
		    type: 'description',
		    message: 'Test3',
		};
		return test.rest.chat.createEntry(context)
		    .then(function(context) {
			//console.log(context.entry);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('read entries from chat #1', function() {
		context.sender = user3;
		context.chat = chat1;
		return test.rest.chat.readEntries(context)
		    .then(function(context) {
			//console.log(context);
			return context;
		    });
	    });

	    ////////////////////////////////////////////////////////////////////
	    it('read entries from chat #1 with wrong auth hash', function() {
		this.skip();
		
		context.sender = user3;
		context.chat = chat1;
		context.sender.auth_token = onerva.auth.encodeAuthToken({ 'uid': user3.uid, 'auth_hash': 'xxx', 'pin': '1234', gids: [] });

		for(let i = 0; i < 10; ++i)
		    test.rest.chat.readEntries(context)
		    .then(function(context) {
			//console.log(context.chat);
			return context;
		    })
		    .catch(function(error) {
			// should fail
			return true;
		    });
		return test.rest.chat.readEntries(context)
		    .then(function(context) {
			//console.log(context.chat);
			return context;
		    })
		    .catch(function(error) {
			// should fail
			return true;
		    });
		
	    });

	    
	});
    });
});

	 /**
5) normal user behaviour
   f) read  description as user 	(auth_hash + pin)
   g) create entry			(auth_hash + pin)
   h) read   entries as user 		(auth_hash + pin)
*/
