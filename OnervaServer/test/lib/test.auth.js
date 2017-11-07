var test = {};
test.auth = {};

var onerva = {};
onerva.util  = require('../../onerva.server.v2.util.js');
onerva.auth  = require('../../onerva.server.v2.auth.js');
onerva.user  = require('../../onerva.server.v2.user.js');
//onerva.chat  = require('../../onerva.server.v2.chat.js');
//onerva.group = require('../../onerva.server.v2.group.js');

test.auth.authenticateSenderWithLogin = function(email, password, pin) {
    return onerva.auth.authenticateSenderWithLogin(email, password, pin);
}

module.exports = test.auth;
