var Base64 = require('js-base64').Base64;
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
test.auth = require('./lib/test.auth.js');


////////////////////////////////////////////////////////////////////////////////
var context = {};

var test_data = require('./lib/test.data.js');
var admin = test_data.admin;


////////////////////////////////////////////////////////////////////////////////
before(function() {
    context.sender = admin;
    return test.setup.initDatabase(context);
});

////////////////////////////////////////////////////////////////////////////////
after(function() {
    var promises = [];
    if ( false ) {
	promises.push(context.db.collection('permissions').drop());
	promises.push(context.db.collection('users').drop());
	promises.push(context.db.collection('chats').drop());
	promises.push(context.db.collection('groups').drop());
	promises.push(context.db.collection('entries').drop());
    }
    else if ( false )
	promises.push(context.db.collection('permissions').find({}).toArray()
		      .then(function(array) {
			  for(let i = 0; i < array.length; ++i)
			      if ( array[i].owner.startsWith('gid') &&
				   array[i].role == "chat reader" )
				  console.log(JSON.stringify(array[i], null, '  '));
		      }));
    else if ( false )
	promises.push(context.db.collection('attempts').find({}).toArray()
		      .then(function(array) {
			  for(let i = 0; i < array.length; ++i)
			      console.log(JSON.stringify(array[i], null, '  '));
		      }));
    
    return Promise.all(promises);
});


////////////////////////////////////////////////////////////////////////////////
describe('Onerva', function() {
    
    ////////////////////////////////////////////////////////////////////////////
    describe('backend', function() {

	////////////////////////////////////////////////////////////////////////
	it('authenticate sender with login', function() {
	    context.sender = admin;
	    return test.auth.authenticateSenderWithLogin(context.sender.email,
							 context.sender.password,
							 context.sender.pin) (context);
	});
	
	////////////////////////////////////////////////////////////////////////
    	it('authenticate sender with wrong email', function() {
	    context.sender = admin;
	    // should fail
	    return test.auth.authenticateSenderWithLogin(context.sender.email+'x',
							 context.sender.password,
							 context.sender.pin) (context)
		       .then(function(context) {
			   return Promise.reject(new Error('Should not return valid user'));
		       })
		       .catch(function(error) {
			   //console.log(error);
			   return Promise.resolve(error);
		       });
	});

	////////////////////////////////////////////////////////////////////////
	it('authenticate sender with wrong password', function() {
	    context.sender = admin;
	    // should fail
	    return test.auth.authenticateSenderWithLogin(context.sender.email,
							 context.sender.password+'x',
							 context.sender.pin) (context)
		       .then(function(context) {
			   return Promise.reject(new Error('Should not return valid user'));
		       })
		       .catch(function(error) {
			   //console.log(error);
			   return Promise.resolve(error);
		       });
	});

	////////////////////////////////////////////////////////////////////////
	it('authenticate sender with wrong pin', function() {
	    context.sender = admin;

	    // try rate limiting
	    /*
	    for(let i = 0; i < 10; ++i)
		test.auth.authenticateSenderWithLogin(context.sender.email,
						      context.sender.password,
						      context.sender.pin+'x') (context);
	    */

	    // should fail
	    return test.auth.authenticateSenderWithLogin(context.sender.email,
							 context.sender.password,
							 context.sender.pin+'x') (context)
		       .then(function(context) {
			   return Promise.reject(new Error('Should not return valid user'));
		       })
		       .catch(function(error) {
			   //console.log(error);
			   return Promise.resolve(error);
		       });
	});
    });
});
