var Crypto = require('crypto');
var CircularJson = require('circular-json');

var onerva = { util: {} };
onerva.error  = require('./onerva.server.v2.error.js');

////////////////////////////////////////////////////////////////////////////////
onerva.util.generateOnervaID = function() {
    const rnd_bytes = Crypto.randomBytes(8*4);
    let symbols = "abcdfgjkmprstvxz";

    let key = '';
    for(let i = 0; i < 8; ++i) {
        for(let j = 0; j < 4; ++j) {
            key += symbols[rnd_bytes[i*4+j]%16];
        }
        key += '-';
    }
    return key.substring(0,key.length-1);
}

////////////////////////////////////////////////////////////////////////////////
onerva.util.getTimestamp = function(datetime, offset_in_seconds) {
    if ( ! datetime )
	datetime = new Date(Date.now());
    if ( offset_in_seconds )
	datetime.setTime(datetime.getTime() + offset_in_seconds * 1000);
    
    var str = datetime.getFullYear()  + '-';
    
    if ( (datetime.getMonth()+1) < 10 ) str += '0';
    str += (datetime.getMonth()+1);
    str += '-';
    if ( datetime.getDate() < 10 ) str += '0';
    str += datetime.getDate();
    str += ' ';
    if ( datetime.getHours() < 10 ) str += '0';
    str += datetime.getHours();
    str += ':';
    if ( datetime.getMinutes() < 10 ) str += '0';
    str += datetime.getMinutes();
    str += ':';
    if ( datetime.getSeconds() < 10 ) str += '0';
    str += datetime.getSeconds();
    //str += ' ';

    return str;
}

////////////////////////////////////////////////////////////////////////////////
onerva.util.simplifyContext = function (context) {
    if ( context.db ) {
	context.db = { databaseName: context.db.databaseName };
    }
    //console.log('---------------------');
    //console.log(CircularJson.stringify(context, null, '\t'));
    return JSON.parse(CircularJson.stringify(context));
}

////////////////////////////////////////////////////////////////////////////////
onerva.util.errorToJson = function(error) {
    if ( error instanceof onerva.error.OnervaError ) {
	return { error: error.message, context: onerva.util.simplifyContext(error.context) };
    }
    else {
	if ( process.env.PRODUCTION )
	    return JSON.parse(CircularJson.stringify({ error: error.message }));
	else
	    return JSON.parse(CircularJson.stringify({ error: error.message, stack: error.stack }));
    }
}


////////////////////////////////////////////////////////////////////////////////
module.exports = onerva.util;

