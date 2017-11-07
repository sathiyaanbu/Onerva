var config = require('./config.js');

const nodemailer = require('nodemailer');
const fs = require('fs');

var Base64 = require('js-base64').Base64;

var onerva = { user: {} };

onerva.util  = require('./onerva.server.v2.util.js');
onerva.error = require('./onerva.server.v2.error.js');

//
// In mongo:
// user = {
//   uid:
//   email:
//   alias:
//   pass_hash:
//   pin_hash:
// }
//
//
// In REST:
// user = {
//   uid:
//   email:
//   alias:
//   password:
//   pin:
// }
//

////////////////////////////////////////////////////////////////////////////////
onerva.user.fetchUser = function(uid) {
    return function(context) {
	return context.db.collection('users').findOne({
	    uid: uid
	})
		      .then(function(result) {
			  //console.log(result);
			  if ( ! result ) {
			      throw new onerva.error.OnervaError('User not found', context);
			  }
			  else {
			      //console.log(result);
			      
			      if ( result._id ) delete result._id;
			      if ( result.pin_hash ) delete result.pin_hash;
			      if ( result.pass_hash ) delete result.pass_hash;
			      
			      context.user = result;
			      return context;
			  }
		      });
    }
}

////////////////////////////////////////////////////////////////////////////////
onerva.user.insertUser = function(user) {
    return function(context) {
	if ( ! user.uid )
	    throw new onerva.error.OnervaError('Insert user failed because UID does not exist.', context);


	// create database user dict with necessary fields only
	var db_user = {};
	db_user.uid = user.uid;
	db_user.email = user.email;
	db_user.alias = user.alias;
	db_user.pass_hash = user.pass_hash;
	db_user.pin_hash = user.pin_hash;
	
	return context.db.collection('users').insert(db_user, {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Insert user failed.', context);
			  context.user = user;
			  return context;
		      });
    }
}


////////////////////////////////////////////////////////////////////////////////
onerva.user.updateUser = function(user) {
    return function(context) {
	// create database user dict with necessary fields only
	var db_user = {};
	//db_user.uid = user.uid;
	db_user.alias = user.alias;
	if ( user.email )
	    db_user.email = user.email;
	if ( user.pass_hash )
	    db_user.pass_hash = user.pass_hash;
	if ( user.pin_hash )
	    db_user.pin_hash = user.pin_hash;

	console.log(db_user);
	
	return context.db.collection('users').update({ uid: user.uid },
						     { $set: db_user },
						     {w:1})
		      .then(function(cursor) {
			  //console.log(cursor);
			  if ( ! cursor.result.ok )
			      throw new onerva.error.OnervaError('Update user failed.', context);
			  context.user = user;
			  return context;
		      });
    }
}

///////////////////////////////////////////////////////////////////////////////
onerva.user.isNewUID = function(uid) {
    return function(context) {
	return context.db.collection('users').findOne({
	    uid: uid
	})
		      .then(function(result) {
			  context.next_uid = uid;
			  if ( result && result.uid == uid )
			      throw new onerva.error.OnervaError('UID exists: ' + uid, context);
			  return context;
		      });
    }
}


///////////////////////////////////////////////////////////////////////////////
onerva.user.sendLoginEmail = function(emailType) {
    return function(context) {
	if ( emailType == 'none' )
	    return context;
	
	if ( ! onerva.user.transporter )
	    onerva.user.transporter = nodemailer.createTransport({
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	    });


	let readable_gids = [];
	for(let i = 0; i < context.permissions.length; ++i) {
	    if ( context.permissions[i].role == "group reader" )
		readable_gids.push(context.permissions[i].target.substring(4));
	};
	let credentials = {
	    uid:       context.user.uid,
	    alias:     context.user.alias,
	    auth_hash: context.user.auth_hash,
	    gids:      readable_gids
	};
	let users_this_only = {};
	users_this_only[context.user.alias] = credentials;
	console.log(JSON.stringify(users_this_only));
	let quickLink = 'https://onervahoiva.fi/onerva2/pikalinkki.html?data=' + Base64.encode(JSON.stringify(users_this_only)).replace(/\+/g,'-').replace(/\//g,'_').replace(/\=/g,'.') + '&e'
	console.log(quickLink);
	
	var text = (
	    "Hei " + context.user.alias + "\n" +
		"\n" +
		"Tervetuloa viestimään Onervan avulla. Voit aloittaa heti seuraamalla alla mainittuja pikaohjeita.\n" +
		"\n" +
		"Onervan pikaohje omaiselle  http://onervahoiva.fi/ohje-omaiselle\n" +
		"Onervan pikaohje hoitajalle http://onervahoiva.fi/ohje-hoitajalle\n" +
		"\n" +
		"Käyttäjätunnuksenne on " + context.user.email + "\n" +
		"Salasananne  on " + context.user.password + "\n" +
		"PIN-koodinne on " + context.user.pin + "\n" +
		"\n" +
		"\n" +
		"Ystävällisin terveisin, \n" +
		"\n" +
		"    Onerva-tiimi \n" +
		"\n" );
	

	var html = (
	    "<!DOCTYPE html>\n" +
		"<html>\n" +
		"<head>\n" +
		"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n" +
		"</head>\n" +
		"<body>\n" +
		"<p>Hei " + context.user.alias + "<p>\n" +
		"<p>Tervetuloa viestimään Onervan avulla. Voit aloittaa heti seuraamalla alla olevia linkkejä pikaohjeisiin.</p>\n" +
		"<p><a href=\"http://onervahoiva.fi/ohje-omaiselle\">Onervan pikaohje omaiselle</a> <br>\n" +
		"<a href=\" http://onervahoiva.fi/ohje-hoitajalle\">Onervan pikaohje hoitajalle</a> </p>\n" +
		"<p>Käyttäjätunnuksenne on " + context.user.email + "<br>\n" +
		"Salasananne  on " + context.user.password + "<br>\n" +
		"PIN-koodinne on " + context.user.pin + "</p>\n" +
		"<p>Voit myös käyttää <a href=\"" + quickLink + "\">tätä pikalinkkiä</a> kirjautumiseen, \n" +
		"jos käytät Onervaa henkilökohtaiselta laitteelta. </p>\n" +
		"<br>\n" +
		"<p>Ystävällisin terveisin, </p>\n" +
		"<p> &nbsp; &nbsp; &nbsp; Onerva-tiimi</p>\n" +
		"<br>\n" +
		"</body>\n" +
		"</html>\n" );
	
	//console.log(context.user.email);
	//console.log(message);

	fs.writeFileSync('./emails/login_' + encodeURIComponent(context.user.email) + '.txt',
			 html, 'utf8');

	let email = context.user.email;
	if ( email.lastIndexOf(':') >= 0 )
	    email = email.substring(email.lastIndexOf(':')+1);
	
	if ( true || config.production )
	    return onerva.user.transporter.sendMail({
		from: 'Onerva <tuki@onervahoiva.fi>',
		to:   email,
		subject: 'Onervan kirjautumistiedot',
		text: text,
		html: html,
	    }).then(function(result) {
		//console.log(result);
		return context;
	    }).catch(function(error) {
		throw new onerva.error.OnervaError('Sending email failed: ' + error, context);
	    });
	else {
	    console.log('--- TESTING EMAIL NOT SENT to ' + email + '---');
	    console.log('--- ' + context.user.email + ' ---');
	    console.log('--- ' + context.user.alias + ' ---');
	    console.log('--- ' + context.user.password + ' ---');
	    console.log('--- ' + context.user.pin + ' ---');
	    return context;
	}
    }
}



////////////////////////////////////////////////////////////////////////////////
module.exports = onerva.user;
