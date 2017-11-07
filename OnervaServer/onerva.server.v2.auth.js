// REMEMBER TO ADD CATCHES WITH REJECTS
// REMEMBER TO RETURNS TO REJECT
// REMEMBER TO HANDLE ERRORS PROPERLY

// example
// permission = {
//   owner:  'uid-' + context.sender.uid,
//   role:   'user writer',
//   target: context.user.uid,
//   start_timestamp: start_timestamp, 
//   end_timestamp:   end_timestamp,
// }

var Crypto = require('crypto');
var Base64 = require('js-base64').Base64;

var onerva = { auth: {} };

//onerva.auth.salt = 'onerva-pKcr-5Wax-niAh-j9Oc';
onerva.auth.salt = 'onerva'

onerva.util  = require('./onerva.server.v2.util.js');
onerva.error = require('./onerva.server.v2.error.js');

////////////////////////////////////////////////////////////////////////////////
onerva.auth.calculateDigest = function(data) {
    var sha256 = Crypto.createHash('sha256');
    sha256.update(data);
    return sha256.digest('hex');
}
////////////////////////////////////////////////////////////////////////////////
onerva.auth.calculatePassHash = function(username, password, pin) {
    return onerva.auth.calculateDigest(onerva.auth.salt + '-' + username + '-' + password + '-' + pin);
}
////////////////////////////////////////////////////////////////////////////////
onerva.auth.calculateAuthHash = function(uid, password, pin) {
    return onerva.auth.calculateDigest(onerva.auth.salt + '-' + uid + '-' + password + '-' + pin);
}
////////////////////////////////////////////////////////////////////////////////
onerva.auth.calculatePinHash = function(auth_hash, pin) {
    return onerva.auth.calculateDigest(pin + '-' + auth_hash);
}

////////////////////////////////////////////////////////////////////////////////
// Authorization: ONERVA-TOKEN token="base 64 encoded json { uid: str, gids: [str], auth_hash: str, pin: str}"
onerva.auth.encodeAuthToken = function(token) {
    token = JSON.stringify(token);
    token = Base64.encode(token);
    token = 'ONERVA-TOKEN token="' + token + '"';
    return token;
}
////////////////////////////////////////////////////////////////////////////////
// NOTE: this is promise-like function, returning context
////////////////////////////////////////////////////////////////////////////////
onerva.auth.decodeAuthToken = function(auth_token) {
    return function(context) {
	if ( ! auth_token )
	    throw new onerva.error.OnervaError('No authorization token in authorization header: ' + auth_token, context);
	
	if ( ! auth_token.startsWith('ONERVA-TOKEN token="') ) {
	    throw new onerva.error.OnervaError('Invalid token type in authorization header: ' + auth_token, context);
	}
	
	var token = auth_token.substr('ONERVA-TOKEN token="'.length);
	token = token.substr(0, token.length-1);
	
	try {
	    token = Base64.decode(token);
	    token = JSON.parse(token);
	} catch(err) {
	    context.auth_token = token;
	    throw new onerva.error.OnervaError('Parsing authorization token failed: ' + err, context);
	}

	//console.log(token);
	context.auth_token = token;
	if ( ( ! context.auth_token.uid )       ||
	     ( ! context.auth_token.auth_hash ) ||
	     ( ! context.auth_token.gids )      ||
	     ( ! context.auth_token.pin )       ) {
	    throw new onerva.error.OnervaError('Invalid authorization token', context);
	}
	
	return context;
    }
}


////////////////////////////////////////////////////////////////////////////////
onerva.auth.authenticateSenderWithLogin = function(email, password, pin) {

    // USE REDIS AND RATELIMITER NPM-PACKAGES
    
    return function(context) {
	var sender = {};
	sender.email = email;
	
	// fire and forget, false until proven right
	context.db.collection('attempts').insert({
	    email: email,
	    time:  Date.now(),
	    success: false
	});

	return context.db.collection('attempts').find({ email: email }).sort({ time: -1 }).limit(2*10).toArray()
		      .then(function(array) {
			  //console.log(array);
			  var return_time = Date.now();

			  var delays = [ 100,  100,
					 300,  300,
					 1000, 1000,
					 1000, 1000,
					 1000, 1000,
					 1000, 1000,
					 1000, 1000,
					 1000, 1000,
					 1000, 1000,
					 60*1000, 60*1000 ];
			  
			  let nfails = 0;
			  for( ; nfails < array.length; ++nfails)
			      if ( array[nfails].success )
				  break;
			  if ( nfails > 0 && nfails < array.length )
			      return_time = array[0].time + delays[nfails];

			  var delay = return_time - Date.now();
			  if ( delay < 0 )
			      delay = 0;

			  //console.log('delay ' + delay / 1e3 + ' for email ' + email);
			  
			  if ( delay > 3000 )
			      throw new onerva.error.OnervaError('User authentication postponed ' + (delay/1e3) + ' seconds', context);
			  

			  //console.log(email);
			  //console.log(password);
			  //console.log(pin);
			  sender.pass_hash = onerva.auth.calculatePassHash(email, password, pin);
			  //console.log(sender);

			  return context.db.collection('users').findOne({
			      email:     sender.email,
			      pass_hash: sender.pass_hash
			  })
					.then(function(result) {
					    //console.log(result);
					    // fire and forget
					    // uid to reset also uid+pin attempts
					    context.db.collection('attempts').insert({
						email: email,
						uid:   result ? result.uid : '',
						time:  Date.now(),
						success: result ? true : false
					    });
					    

					    if ( result )
						context.sender = result;
					    
					    return new Promise(function(resolve,reject) {
						setTimeout(function() {
						    if ( result ) 
							return resolve(context);
						    else
							return reject(new onerva.error.OnervaError('User authentication failed', context));
						},
							   delay );
					    });
					});
		      });
    }
}

////////////////////////////////////////////////////////////////////////////////
onerva.auth.authenticateSenderWithToken = function() {
    return function(context) {
	//console.log(context.auth_token);

	// USE REDIS AND RATELIMITER NPM-PACKAGES?
	// COMMENTED OUT DOES NOT WORK FOR BRUTE FORCING
	
	var sender = {};
	sender.uid  = context.auth_token.uid;
	sender.gids = [];
	
	var uid = sender.uid;

	sender.pin_hash = onerva.auth.calculatePinHash(context.auth_token.auth_hash, context.auth_token.pin);
	
	return context.db.collection('users').findOne({
	    uid:      sender.uid,
	    pin_hash: sender.pin_hash
	})
		      .then(function(result) {
			  // fire and forget
			  //context.db.collection('attempts').insert({
			  //    uid:   uid,
			  //    time:  Date.now(),
			  //    success: result ? true : false
			  //});
			  
			  
			  if ( result )
			      context.sender = result;
			  
			  if ( result ) 
			      return context;
			  else
			      throw new onerva.error.OnervaError('User authentication failed', context);
		      });
	
	
	/*
			     // fire and forget, false until proven right
	context.db.collection('attempts').insert({
	    uid:   uid,
	    time:  Date.now(),
	    success: false
	});
	
	return context.db.collection('attempts').find({ uid: uid }).sort({ time: -1 }).limit(10).toArray()
		      .then(function(array) {
			  //console.log(array);
			  
			  var return_time = Date.now();
			  var delays = [   0,    0,
					   300,    300,
					   1000,    1000,
					   60*60*1000, 60*60*1000,
					   24*60*60*1000, 24*60*60*1000 ];
			  
			  for(let i = 0; i < array.length; ++i) {
			      if ( array[i].success )
				  break;
			      //console.log(array[i].time);
			      return_time = array[0].time + delays[i];
			  }
			  
			  
			  var delay = return_time - Date.now();
			  if ( delay < 0 )
			      delay = 0;
			  
			  console.log('delay ' + delay / 1e3 + ' for email ' + uid);
			  
			  if ( delay > 3000 )
			      throw new onerva.error.OnervaError('User authentication postponed ' + (delay/1e3) + ' seconds', context);

			  
			  sender.pin_hash = onerva.auth.calculatePinHash(context.auth_token.auth_hash, context.auth_token.pin);
			  
			  return context.db.collection('users').findOne({
			      uid:      sender.uid,
			      pin_hash: sender.pin_hash
			  })
					.then(function(result) {
					    
					    // fire and forget
					    context.db.collection('attempts').insert({
						uid:   uid,
						time:  Date.now(),
						success: result ? true : false
					    });
					    
					    
					    if ( result )
						context.sender = result;
					    
					    return new Promise(function(resolve,reject) {
						setTimeout(function() {
						    if ( result ) 
							return resolve(context);
						    else
							return reject(new onerva.error.OnervaError('User authentication failed', context));
						},
							   delay );
					    });
					});
		      });
	
	*/
    }
}



////////////////////////////////////////////////////////////////////////////////
onerva.auth.verifySenderGroups = function() {
    return function(context) {
	var gids = context.auth_token.gids;
	if ( ! gids ) gids = [];
	//console.log(gids);
	
	return context.db.collection('groups').find({
	    gid: { $in: gids },
	    users: { $elemMatch: { uid: context.sender.uid } }
	})
		      .toArray()
		      .then(function(array) {
			  context.sender.gids = [];
			  for(var i = 0; i < array.length; ++i)
			      context.sender.gids.push(array[i].gid);
			  
			  //console.log(JSON.stringify(context.sender, null, '\t'));
			  return context;
		      });
    }
}
		       
		

////////////////////////////////////////////////////////////////////////////////
onerva.auth.fetchPermissions = function(role, target) {
    return function(context) {
	var owner_list = [ 'uid-' + context.sender.uid ];
	for(var i = 0; i < context.sender.gids.length; ++i)
	    owner_list.push('gid-' + context.sender.gids[i]);
	
	//console.log(owner_list);
	//console.log({ owner: { $in: owner_list },
	//	      role: role,
	//	      target: target });

	let query = {
	    owner: { $in: owner_list },
	};
	if ( role != '*' )
	    query.role = role;
	if ( target != '*' )
	    query.target = target;
	
	return context.db.collection('permissions').find(query)
		      .toArray()
		      .then(function(array) {
			  //console.log(array);

			  if ( context.permissions )
			      context.permissions.concat(array);
			  else
			      context.permissions = array;
			  context.permission_now = false;
			  
			  var timestamp = null;
			  try {
			      timestamp = onerva.util.getTimestamp();
			  } catch(err) {
			      throw new onerva.error.OnervaError('Creating timestamp failed: ' + err, context);
			  }
			  //console.log(timestamp);
			  
			  var valid_now = false;
			  for(var i = 0; i < array.length; ++i) {
			      if ( array[i].start_timestamp.localeCompare(timestamp) <= 0 &&
				   array[i].end_timestamp.localeCompare(timestamp) >= 0 )
				  valid_now = true;
			  }
			  
			  if ( valid_now )
			      context.permission_now = {
				  role:            role,
				  target:          target,
			      };
			  
			  return context;
		      });
    }
}

////////////////////////////////////////////////////////////////////////////////
onerva.auth.hasPermissionNow = function() {
    return function(context) {
	//console.log(context);
	if ( context.permission_now )
	    return context;
	else {
	    throw new onerva.error.OnervaError('No permissions currently active', context);
	}
    }
}


////////////////////////////////////////////////////////////////////////////////
onerva.auth.insertPermission = function(permission) {
    var db_permission = {};
    db_permission.owner  = permission.owner;
    db_permission.role   = permission.role;
    db_permission.target = permission.target;
    db_permission.start_timestamp = permission.start_timestamp;
    db_permission.end_timestamp = permission.end_timestamp;

    //console.log(db_permission);
    
    return function(context) {
	//console.log(permission);
	return context.db.collection('permissions').insert(db_permission, {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Insert permission failed.', context);
			  return context;
		      });
    }
}

////////////////////////////////////////////////////////////////////////////////
onerva.auth.expirePermission = function(permission) {
    var db_permission = {};
    db_permission.owner  = permission.owner;
    db_permission.role   = permission.role;
    db_permission.target = permission.target;
    db_permission.end_timestamp = permission.end_timestamp;

    //console.log(db_permission);
    
    return function(context) {
	return context.db.collection('permissions').update(
	    { owner: db_permission.owner,
	      role: db_permission.role,
	      target: db_permission.target,
	      end_timestamp: { $gt: db_permission.end_timestamp }
	    },
	    { $set: db_permission },
	    {w:1})
	    .then(function(cursor) {
		//console.log(cursor);
		if ( ! cursor.result.ok )
		    throw new onerva.error.OnervaError('Update permission failed.', context);
		return context;
	    });
    }
}

////////////////////////////////////////////////////////////////////////////////
module.exports = onerva.auth;
