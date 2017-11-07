const nodemailer = require('nodemailer');
const fs = require('fs');

var onerva = { chat: {} };

onerva.util  = require('./onerva.server.v2.util.js');
onerva.error = require('./onerva.server.v2.error.js');

//
// In mongo:
// chat = {
//   cid:
//   alias:
//   actions:
// }
//
//
// In REST:
// chat = {
//   cid:
//   alias:
//   actions:
// }
//

////////////////////////////////////////////////////////////////////////////////
onerva.chat.fetchChat = function(cid) {
    return function(context) {
	return context.db.collection('chats').findOne({
	    cid: cid
	})
		      .then(function(result) {
			  //console.log(result);
			  if ( ! result ) {
			      throw new onerva.error.OnervaError('Chat not found', context);
			  }
			  else {
			      //console.log(result);
			      
			      if ( result._id ) delete result._id;
			      
			      context.chat = result;
			      return context;
			  }
		      });
    }
}

////////////////////////////////////////////////////////////////////////////////
onerva.chat.insertChat = function(chat) {
    return function(context) {
	if ( ! chat.cid )
	    throw new onerva.error.OnervaError('Insert chat failed because CID does not exist.', context);

	// create database chat dict with necessary fields only
	var db_chat = {};
	db_chat.cid = chat.cid;
	db_chat.alias = chat.alias;
	db_chat.actions = chat.actions;
	
	return context.db.collection('chats').insert(db_chat, {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Insert chat failed.', context);
			  context.chat = chat;
			  return context;
		      });
    }
}


////////////////////////////////////////////////////////////////////////////////
onerva.chat.updateChat = function(chat) {
    return function(context) {
	// create database chat dict with necessary fields only
	var db_chat = {};
	//db_chat.cid = chat.cid;
	db_chat.alias = chat.alias;
	db_chat.actions = chat.actions;

	return context.db.collection('chats').update({ cid: chat.cid },
						     { $set: db_chat },
						     { w:1 })
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Update chat failed.', context);
			  context.chat = chat;
			  return context;
		      });
    }
}

///////////////////////////////////////////////////////////////////////////////
onerva.chat.isNewCID = function(cid) {
    return function(context) {
	return context.db.collection('chats').findOne({
	    cid: cid
	})
		      .then(function(result) {
			  context.next_cid = cid;
			  if ( result && result.cid == cid )
			      throw new onerva.error.OnervaError('CID exists: ' + cid, context);
			  return context;
		      });
    }
}



////////////////////////////////////////////////////////////////////////////////
onerva.chat.insertEntry = function(entry) {
    return function(context) {
	if ( ! entry.timestamp )
	    throw new onerva.error.OnervaError('Insert entry failed because timestamp does not exist.', context);

	// create database entry dict with necessary fields only
	var db_entry = {};
	db_entry.timestamp = entry.timestamp;
	db_entry.user = {};
	db_entry.user.alias = entry.user.alias;
	db_entry.user.uid = entry.user.uid;
	db_entry.chat = {};
	db_entry.chat.alias = entry.chat.alias;
	db_entry.chat.cid = entry.chat.cid;
	db_entry.type = entry.type;

	if ( ( entry.type != 'message'     ) &&
	     ( entry.type != 'visit'       ) && 
	     ( entry.type != 'image'       ) && 
	     ( entry.type != 'description' ) )
	    throw new onerva.error.OnervaError('Insert entry failed because unknown entry type.', context);

	if ( entry.type == 'message' ) {
	    db_entry.message = entry.message;
	}
	if ( entry.type == 'description' ) {
	    db_entry.message = entry.message;
	}
	if ( entry.type == 'visit' ) {
	    db_entry.message = entry.message;
	    db_entry.actions = entry.actions;
	    db_entry.mood    = entry.mood;
	    db_entry.ability = entry.ability;
	}
	if ( entry.type == 'image' ) {
	    db_entry.message = entry.message;
	    db_entry.dataURL = entry.dataURL;
	}

	console.log(db_entry);
	return context.db.collection('entries').insert(db_entry, {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Insert entry failed.', context);
			  context.entry = entry;
			  return context;
		      });
    }
}


////////////////////////////////////////////////////////////////////////////////
onerva.chat.fetchPermittedEntries = function(cid, type, offset, limit) {
    return function(context) {
	if ( limit > 100 )
	    limit = 100;

	// DEBUG
	//context.permissions[0].start_timestamp = onerva.util.getTimestamp(0,10);
	//let test_perm = Object.assign({}, context.permissions[0]);
	//test_perm.start_timestamp = onerva.util.getTimestamp(0,-1000);
	//context.permissions.push(test_perm);
	//console.log(context.permissions);

	let queries = [];
	context.permissions.map(function(item) {
	    let query = {
		$and:
		[ { 'chat.cid': cid },
		  { timestamp: { $gte: item.start_timestamp } }, 
		  { timestamp: { $lte: item.end_timestamp } },
		]
	    };
	    if ( type != '*' )
		query.type = type;
		queries.push(query);
	});

	// MISSING: CLEANED UP DATA OF PERMITTED RANGE AND SELECTED TYPE ONLY (or if type is *, then all types) 

	//console.log(JSON.stringify(queries));

	if ( queries.length < 1 ) {
	    context.entries = [];
	    return context;
	}
	
	return context.db.collection('entries').find(
	    { $or: queries }
	)
	    .skip(offset)
	    .limit(limit)
	    .toArray()
	    .then(function(result) {
		//console.log(result);
		if ( ! result ) {
		    throw new onerva.error.OnervaError('Entries not found', context);
		}
		else {
		    //console.log(result);

		    // clean up entries from sensitive info before returning
		    
		    //if ( result._id ) delete result._id;
		    
		    context.entries = result;
		    return context;
		}
	    });
    }
};

////////////////////////////////////////////////////////////////////////////////
module.exports = onerva.chat;
