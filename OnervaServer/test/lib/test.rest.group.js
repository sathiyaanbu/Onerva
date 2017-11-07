var config = require('./test.rest.config.js');
var test_data = require('./test.data.js');

var fetch  = require('node-fetch');
var assert = require('assert');

////////////////////////////////////////////////////////////////////////////////
var onerva = {};
onerva.util  = require('../../onerva.server.v2.util.js');
onerva.auth  = require('../../onerva.server.v2.auth.js');
//onerva.user  = require('../../onerva.server.v2.user.js');
//onerva.group  = require('../../onerva.server.v2.group.js');
//onerva.group = require('../../onerva.server.v2.group.js');

////////////////////////////////////////////////////////////////////////////////
var test = {}
test.rest = {};
test.rest.group = {};

////////////////////////////////////////////////////////////////////////////////
test.rest.group.createGroup = function(context) {
    var data = {};
    data.group = context.group;
    
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
    
    return fetch(config.api_url + '/groups', fetch_params)
	.then(function(response) {
	    //console.log(response);
	    return response.json();		
	})
	.then(function(responseJson) {
	    if ( ! responseJson.gid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.alias != context.group.alias )
		throw new Error("Incorrect alias: " + responseJson);
	    //console.log(responseJson);

	    context.group.gid = responseJson.gid;

	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
test.rest.group.readGroup = function(context) {
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
    
    return fetch(config.api_url + '/groups/' + context.group.gid, fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    if ( ! responseJson.gid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.gid != context.group.gid )
		throw new Error("Incorrect GID: " + responseJson);
	    if ( responseJson.alias != context.group.alias )
		throw new Error("Incorrect alias: " + responseJson);

	    let new_cids = responseJson.chats.map(function(item) { return item.cid; });
	    let old_cids = context.group.chats.map(function(item) { return item.cid; });
	    new_cids = new Set(new_cids);
	    old_cids = new Set(old_cids);
	    for (var elem of new_cids)
		if ( ! old_cids.has(elem) )
		    throw new Error("Incorrect chats: " + responseJson);
	    for (var elem of old_cids)
		if ( ! new_cids.has(elem) )
		    throw new Error("Incorrect chats: " + responseJson);

	    let new_uids = responseJson.users.map(function(item) { return item.uid; });
	    let old_uids = context.group.users.map(function(item) { return item.uid; });
	    new_uids = new Set(new_uids);
	    old_uids = new Set(old_uids);
	    for (var elem of new_uids)
		if ( ! old_uids.has(elem) )
		    throw new Error("Incorrect users: " + responseJson);
	    for (var elem of old_uids)
		if ( ! new_uids.has(elem) )
		    throw new Error("Incorrect users: " + responseJson);
	    
	    return context;
	});
}

////////////////////////////////////////////////////////////////////////////////
test.rest.group.writeGroup = function(context) {
    var data = {};
    data.group = context.group;
    
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
    
    return fetch(config.api_url + '/groups/' + context.group.gid, fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    if ( ! responseJson.gid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.gid != context.group.gid )
		throw new Error("Incorrect GID: " + responseJson);
	    if ( responseJson.alias != context.group.alias )
		throw new Error("Incorrect alias: " + responseJson);
	    //console.log(responseJson);

	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
test.rest.group.readGroupAliases = function(context) {
    var fetch_params = {
	method: 'GET',
	mode:   'same-origin',
	headers: {
	    'Accept':        'application/json',
	    'Content-Type':  'application/json',
	    //'Authorization':  context.sender.auth_token
	},
    };

    //console.log(fetch_params);
    
    return fetch(config.api_url + '/groups/' + context.group.gid + '/users.alias', fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    if ( ! responseJson.gid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.gid != context.group.gid )
		throw new Error("Incorrect GID: " + responseJson);
	    if ( responseJson.alias != context.group.alias )
		throw new Error("Incorrect alias: " + responseJson);

	    context.aliases = responseJson.users;
	    
	    return context;
	});
}

////////////////////////////////////////////////////////////////////////////////
module.exports = test.rest.group;
