var Base64 = require('js-base64').Base64;

var test_data = {};

test_data.admin = {
    'uid':      '12345',
    'email':    'lauri@onervahoiva.fi',
    'alias':    'Lauri L',
    'password': 'Kala1234',
    'pin':      '1234',
    'auth_token': (
	'ONERVA-TOKEN token="'
	+ Base64.encode(JSON.stringify(
	    {
		alias: 'Lauri L',
		uid: '12345',
		auth_hash: 'bca9ef0700b18ebae32f065810ca124b3640cf49f6fb44dedb04b72339e4058b',
		pin: '1234',
		gids: [],
	    })
	) + '"' )
};

//////////////////////////////////////////////////////////////////////////////////
test_data.user1 = {
    'email':    'ville@onervahoiva.fi',
    'alias':    'Ville N',
    'password': 'Test1234',
    'pin':      '1111',
};

test_data.user2 = {
    'email':    'marika@onervahoiva.fi',
    'alias':    'Marika N',
    'password': 'Test1234',
    'pin':      '1111',
};

test_data.user3 = {
    'email':    'perhe.lehtovaara@gmail.com',
    'alias':    'Pirjo L',
    'password': 'Test1234',
    'pin':      '1357',
};

//////////////////////////////////////////////////////////////////////////////////
test_data.chat1 = {
    'alias':    'Sirkka T.',
    'actions':  ['Ruoka', 'Juoma', 'Ulkoilu', 'Viriketoiminta']
};

test_data.chat2 = {
    'alias':    'Reino J.',
    'actions':  ['Ruoka', 'Juoma', 'Ulkoilu']
};

//////////////////////////////////////////////////////////////////////////////////
test_data.group1 = {
    'alias': 'Onervahoiva',
    'role':  'caregiver',
    'users': [ test_data.user1, test_data.user2, test_data.user3 ],
    'chats': [ test_data.chat1, test_data.chat2 ],
};

test_data.group2 = {
    'alias': 'Sirkan omaiset',
    'role':  'relative',
    'users': [ test_data.user3 ],
    'chats': [ test_data.chat1 ],   
};

//////////////////////////////////////////////////////////////////////////////////


module.exports = test_data;
