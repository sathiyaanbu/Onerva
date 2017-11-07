var onerva = { group: {} };

onerva.util  = require('./onerva.server.v2.util.js');
onerva.error = require('./onerva.server.v2.error.js');

////////////////////////////////////////////////////////////////////////////////
onerva.group.fetchGroup = function(gid) {
    return function(context) {
	return context.db.collection('groups').findOne({
	    gid: gid
	})
		      .then(function(result) {
			  //console.log(result);
			  if ( ! result ) {
			      throw new onerva.error.OnervaError('Group not found', context);
			  }
			  else {
			      if ( result._id ) delete result._id;
			      context.group = result;
			      return context;
			  }
		      });
    }
}

////////////////////////////////////////////////////////////////////////////////
onerva.group.insertGroup = function(group) {
    return function(context) {
	if ( ! group.gid )
	    throw new onerva.error.OnervaError('Insert group failed because GID does not exist.', context);

	// create database group dict with necessary fields only
	var db_group = {};
	db_group.gid = group.gid;
	db_group.alias = group.alias;
	db_group.role = group.role;
	db_group.users = [];
	for(let i = 0; i < group.users.length; ++i)
	    db_group.users.push({ uid: group.users[i].uid }); 
	db_group.chats = [];
	for(let i = 0; i < group.chats.length; ++i)
	    db_group.chats.push({ cid: group.chats[i].cid }); 

	
	return context.db.collection('groups').insert(db_group, {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Insert group failed.', context);
			  context.group = group;
			  return context;
		      });
    }
}


////////////////////////////////////////////////////////////////////////////////
onerva.group.updateGroup = function(group) {
    // create database group dict with necessary fields only
    var db_group = {};
    // db_group.gid = group.gid;
    db_group.alias = group.alias;
    db_group.role = group.role;
    db_group.users = [];
    for(let i = 0; i < group.users.length; ++i)
	if ( group.users[i] && group.users[i].uid )
	    db_group.users.push({ uid: group.users[i].uid }); 
    db_group.chats = [];
    for(let i = 0; i < group.chats.length; ++i)
	if ( group.chats[i] && group.chats[i].cid )
	db_group.chats.push({ cid: group.chats[i].cid }); 
    
    return function(context) {
	return context.db.collection('groups').update({ gid: group.gid },
						      { $set: db_group },
						      {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Update group failed.', context);
			  context.group = group;
			  return context;
		      });
    }
}

///////////////////////////////////////////////////////////////////////////////
onerva.group.isNewGID = function(gid) {
    return function(context) {
	return context.db.collection('groups').findOne({
	    gid: gid
	})
		      .then(function(result) {
			  context.next_gid = gid;
			  if ( result && result.gid == gid )
			      throw new onerva.error.OnervaError('GID exists: ' + gid, context);
			  return context;
		      });
    }
}


////////////////////////////////////////////////////////////////////////////////

module.exports = onerva.group;
