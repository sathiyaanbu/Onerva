var onerva = { util: {} };

//var Base64 = require('base-64');

//onerva.error  = require('./onerva.server.v2.error.js');

////////////////////////////////////////////////////////////////////////////////
// Authorization: ONERVA-TOKEN token="base 64 encoded json { uid: str, gids: [str], auth_hash: str, pin: str}"
onerva.util.encodeAuthToken = function(token) {
    token = JSON.stringify(token);
    //console.log(token);
    token = btoa(token);
    //console.log(token);
    token = 'ONERVA-TOKEN token="' + token + '"';
    return token;
}

////////////////////////////////////////////////////////////////////////////////
onerva.util.generateOnervaID = function() {
    let rnd_bytes = new Uint8Array(8*4);
    let crypto = window.crypto || window.msCrypto;
    crypto.getRandomValues(rnd_bytes)

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
onerva.util.copyGroup = function(group) {
    var copy = {};
    copy.gid = group.gid;
    copy.alias = group.alias;
    copy.role = group.role;
    copy.users = [];
    for(let i = 0; i < group.users.length; ++i)
	if ( group.users[i] && group.users[i].uid )
	    copy.users.push({ uid: group.users[i].uid }); 
    copy.chats = [];
    for(let i = 0; i < group.chats.length; ++i)
	if ( group.chats[i] && group.chats[i].cid )
	    copy.chats.push({ cid: group.chats[i].cid });

    return copy;
}

////////////////////////////////////////////////////////////////////////////////
module.exports = onerva.util;
