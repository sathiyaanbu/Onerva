var config = require('./test.rest.config.js');
var test_data = require('./test.data.js');

var fetch  = require('node-fetch');
var assert = require('assert');

////////////////////////////////////////////////////////////////////////////////
var onerva = {};
onerva.util  = require('../../onerva.server.v2.util.js');
onerva.auth  = require('../../onerva.server.v2.auth.js');
//onerva.user  = require('../../onerva.server.v2.user.js');
//onerva.chat  = require('../../onerva.server.v2.chat.js');
//onerva.group = require('../../onerva.server.v2.group.js');

////////////////////////////////////////////////////////////////////////////////
var test = {}
test.rest = {};
test.rest.chat = {};

////////////////////////////////////////////////////////////////////////////////
test.rest.chat.createChat = function(context) {
    var data = {};
    data.chat = context.chat;
    
    var fetch_params = {
	method: 'POST',
	mode:   'same-origin',
	headers: {
	    'Accept':        'application/json',
	    'Content-Type':  'application/json',
	    'Authorization':  context.sender.auth_token
	},
	body: JSON.stringify(data)
    };

    //console.log(fetch_params);
    
    return fetch(config.api_url + '/chats', fetch_params)
	.then(function(response) {
	    //console.log(response);
	    return response.json();		
	})
	.then(function(responseJson) {
	    if ( ! responseJson.cid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.alias != context.chat.alias )
		throw new Error("Incorrect alias: " + responseJson);
	    //console.log(responseJson);

	    context.chat.cid = responseJson.cid;

	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
test.rest.chat.readChat = function(context) {
    var fetch_params = {
	method: 'GET',
	mode:   'same-origin',
	headers: {
	    'Accept':        'application/json',
	    'Content-Type':  'application/json',
	    'Authorization':  context.sender.auth_token
	},
    };

    //console.log(fetch_params);
    
    return fetch(config.api_url + '/chats/' + context.chat.cid, fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    if ( ! responseJson.cid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.cid != context.chat.cid )
		throw new Error("Incorrect CID: " + responseJson);
	    if ( responseJson.alias != context.chat.alias )
		throw new Error("Incorrect alias: " + responseJson);
	    //console.log(responseJson);

	    return context;
	});
}

////////////////////////////////////////////////////////////////////////////////
test.rest.chat.writeChat = function(context) {
    var data = {};
    data.chat = context.chat;
    
    var fetch_params = {
	method: 'POST',
	mode:   'same-origin',
	headers: {
	    'Accept':        'application/json',
	    'Content-Type':  'application/json',
	    'Authorization':  context.sender.auth_token
	},
	body: JSON.stringify(data)
    };

    //console.log(fetch_params);
    
    return fetch(config.api_url + '/chats/' + context.chat.cid, fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    if ( ! responseJson.cid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.cid != context.chat.cid )
		throw new Error("Incorrect CID: " + responseJson);
	    if ( responseJson.alias != context.chat.alias )
		throw new Error("Incorrect alias: " + responseJson);
	    //console.log(responseJson);

	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
test.rest.chat.createEntry = function(context) {
    var data = {};
    data.entry = context.entry;
    
    var fetch_params = {
	method: 'POST',
	mode:   'same-origin',
	headers: {
	    'Accept':        'application/json',
	    'Content-Type':  'application/json',
	    'Authorization':  context.sender.auth_token
	},
	body: JSON.stringify(data)
    };

    //console.log(fetch_params);
    
    return fetch(config.api_url + '/chats/' + context.chat.cid + '/entries', fetch_params)
	.then(function(response) {
	    //console.log(response);
	    return response.json();		
	})
	.then(function(responseJson) {
	    if ( ! responseJson.timestamp )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.chat.cid != context.chat.cid )
		throw new Error("Incorrect alias: " + responseJson);
	    //console.log(responseJson);

	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
test.rest.chat.readEntries = function(context) {
    var fetch_params = {
	method: 'GET',
	mode:   'same-origin',
	headers: {
	    'Accept':        'application/json',
	    'Content-Type':  'application/json',
	    'Authorization':  context.sender.auth_token
	},
    };

    //console.log(fetch_params);
    let type = '*';
    //let type = 'message';
    let offset = 0;
    let limit = 5;
    
    return fetch(config.api_url + '/chats/' + context.chat.cid + '/entries/' + type + '-' + offset + '-' + limit, fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    //console.log(responseJson);
	    
	    if ( ! responseJson )
	        throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.length != 2 )
		throw new Error("Incorrect number of entries: " + responseJson);


	    return context;
	});
}




////////////////////////////////////////////////////////////////////////////////
module.exports = test.rest.chat;
