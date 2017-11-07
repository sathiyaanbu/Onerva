var config = require('./test.rest.config.js');
var test_data = require('./test.data.js');

var fetch  = require('node-fetch');
var assert = require('assert');

////////////////////////////////////////////////////////////////////////////////
var onerva = {};
onerva.util  = require('../../onerva.server.v2.util.js');
onerva.auth  = require('../../onerva.server.v2.auth.js');
onerva.user  = require('../../onerva.server.v2.user.js');
//onerva.chat  = require('../../onerva.server.v2.chat.js');
//onerva.group = require('../../onerva.server.v2.group.js');

////////////////////////////////////////////////////////////////////////////////
var test = {}
test.rest = {};
test.rest.auth = {};

////////////////////////////////////////////////////////////////////////////////
test.rest.auth.loginWithPassword = function(context) {
    var fetch_params = {
	method: 'POST',
	mode:   'same-origin',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	},
	body: JSON.stringify(
	    { email:    context.sender.email,
	      password: context.sender.password,
	      pin:      context.sender.pin
	    })
    };
    

    return fetch(config.api_url + '/auth', fetch_params)
	.then(function(response) {
	    return response.json();			
	})
	.then(function(responseJson) {
	    if ( ! responseJson.uid )
		throw new Error(JSON.stringify(responseJson));
	    if ( responseJson.uid != context.sender.uid )
		throw new Error("Incorrect UID: " + responseJson);
	    //console.log(responseJson);
	    var auth_token = responseJson;
	    auth_token.pin = context.sender.pin;
	    auth_token.gids = [];
	    context.auth_token = auth_token;
	    return context;
	});
}


////////////////////////////////////////////////////////////////////////////////
module.exports = test.rest.auth;
