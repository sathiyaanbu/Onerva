var Base64 = require('js-base64').Base64;

var config = {
    api_url: 'http://localhost:8778/api',
    port:  process.env.PORT || 8778,
    db_name:    'onervatest',
    auth_token: (
	'ONERVA-TOKEN token="'
	+ Base64.encode(JSON.stringify(
	    {
		uid: '12345',
		auth_hash: 'bca9ef0700b18ebae32f065810ca124b3640cf49f6fb44dedb04b72339e4058b',
		pin: '1234',
		gids: [],
	    })
	) + '"'
    )
};

var fetch = require('node-fetch');
var assert = require('assert');

var onerva = {};
onerva.auth = require('../onerva.server.v2.auth.js');


beforeEach(function() {
});


var auth_token = {};

describe('REST', function() {
    describe('auth', function() {
	describe('#post()', function() {
	    it('response with matching record', function() {
		var uid = '12345';
		//console.log(config.auth_token);
		return fetch(config.api_url + '/auth',
			     {
				 method: 'POST',
				 mode:   'same-origin',
				 headers: {
				     'Accept': 'application/json',
				     'Content-Type': 'application/json',
				 },
				 body:
				      JSON.stringify(
					  { email: 'test@onervahoiva.fi',
					    password: 'Kala1234',
					    pin: '1234'
					  })
			     })
		    .then(function(response) {
			return response.json();			
		    })
		    .then(function(responseJson) {
			if ( ! responseJson.uid )
			    throw new Error(JSON.stringify(responseJson));
			if ( responseJson.uid != uid )
			    throw new Error("Incorrect UID: " + responseJson);
			console.log(responseJson);
			auth_token = responseJson;
			auth_token.pin = '1234';
			auth_token.gids = [];
			auth_token = onerva.auth.encodeAuthToken(auth_token);
			assert.equal(auth_token,config.auth_token);
			//config.auth_token = auth_token;
			return true;
		    })
	    });
	});
    });
});


describe('REST', function() {
    describe('user', function() {
	describe('#get()', function() {
	    it('response with matching record', function() {
		var uid = 'prft-kfmd-kxcf-xmbj-vdjv-zkrg-tgra-gfvt';
		//console.log(config.auth_token);
		return fetch(config.api_url + '/users/' + uid,
			     {
				 method: 'GET',
				 mode:   'same-origin',
				 headers: {
				     'Accept': 'application/json',
				     'Content-Type': 'application/json',
				     'Authorization': config.auth_token,
				 },
			     })
		    .then(function(response) {
			return response.json();			
		    })
		    .then(function(responseJson) {
			if ( ! responseJson.uid )
			    throw new Error(JSON.stringify(responseJson));
			if ( responseJson.uid != uid )
			    throw new Error("Incorrect UID: " + responseJson);
			console.log(responseJson);
			return true;
		    })
	    });
	});
    });
});


describe('REST', function() {
    describe('user', function() {
	describe('#post()', function() {
	    it('response with matching record', function() {
		var uid = 'prft-kfmd-kxcf-xmbj-vdjv-zkrg-tgra-gfvt';
		//console.log(config.auth_token);
		return fetch(config.api_url + '/users',
			     {
				 method: 'POST',
				 mode:   'same-origin',
				 headers: {
				     'Accept': 'application/json',
				     'Content-Type': 'application/json',
				     'Authorization': config.auth_token,
				 },
				 body:
				      JSON.stringify(
					  { "user":
					    { "uid": uid,
					      "alias": "Lauri",
					      "email": "lauri.lehtovaara@gmail.com",
					      "password": "test",
					      "pin": "1234" }
					  })
			     })
		    .then(function(response) {
			return response.json();			
		    })
		    .then(function(responseJson) {
			if ( ! responseJson.uid )
			    throw new Error(JSON.stringify(responseJson));
			if ( responseJson.uid != uid )
			    throw new Error("Incorrect UID: " + responseJson);
			console.log(responseJson);
			return true;
		    })
	    });
	});
    });
});

//curl -H 'Authorization: ONERVA-TOKEN token="eyJ1aWQiOiIxMjM0NSIsImF1dGhfaGFzaCI6ImJjYTllZjA3MDBiMThlYmFlMzJmMDY1ODEwY2ExMjRiMzY0MGNmNDlmNmZiNDRkZWRiMDRiNzIzMzllNDA1OGIiLCAicGluIjoiMTIzNCIsICJnaWRzIjpbIjEyMzQ1Il19Cg=="' -H "Content-Type: application/json" --data '{ "user": { "uid": "prft-kfmd-kxcf-xmbj-vdjv-zkrg-tgra-gfvt", "alias": "Lauri", "email": "lauri.lehtovaara@gmail.com", "password": "test", "pin": "1234" } }' localhost:8778/api/users/

