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
test.rest.admin = {};


////////////////////////////////////////////////////////////////////////////////
test.rest.admin.readPermissions = function(context) {
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
    
    return fetch(config.api_url + '/permissions/' + context.sender.uid, fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    /*
	    if ( ! responseJson.uid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.uid != context.user.uid )
		throw new Error("Incorrect UID: " + responseJson);
	    if ( responseJson.email != context.user.email )
		throw new Error("Incorrect email: " + responseJson);
	    if ( responseJson.alias != context.user.alias )
		throw new Error("Incorrect alias: " + responseJson);
	    */
	    console.log(responseJson);

	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
module.exports = test.rest.admin;
