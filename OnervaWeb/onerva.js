import config from './config';

// only for web
if ( config.platform == 'web' ) {
    require('es6-promise').polyfill();
    require('es6-object-assign').polyfill();
}

// fetch API
import 'whatwg-fetch';

// React stuff
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { View, Text, AsyncStorage, KeyboardSpacer, mm2dp } from './ui/react-onerva';

import styles from './ui/styles';

// update for setState
import update from 'immutability-helper';

// UI screens
import SplashScreen from './ui/splashscreen';
import LoadingScene from './ui/loadingscene';
import ErrorScene from './ui/errorscene';

import LoginScene from './ui/loginscene';
import SelectUserScene from './ui/selectuserscene';
import PinScene from './ui/pinscene';
import SelectChatScene from './ui/selectchatscene';
import ChatScene from './ui/chatscene';

import DescriptionScene from './ui/descriptionscene';
import GradesScene from './ui/gradesscene';
import ActionsScene from './ui/actionsscene';
import MessageScene from './ui/messagescene';
import ImageScene from './ui/imagescene';
//import SendingScene from './ui/sendingscene';

import colors from './ui/colors';

var onerva = { util: require('./util.js') };


class Onerva extends Component {
    constructor(props, context) {
	super(props, context);

	this.back = this.back.bind(this);
	this.next = this.next.bind(this);
	this.lock = this.lock.bind(this);

	this.requestFullscreen = this.requestFullscreen.bind(this);
	this.exitFullscreen = this.exitFullscreen.bind(this);

	this.selectUser = this.selectUser.bind(this);
	this.showLogin = this.showLogin.bind(this);
	this.loginUser = this.loginUser.bind(this);
	
	this.getLocalUsers = this.getLocalUsers.bind(this);
	this.setLocalUsers = this.setLocalUsers.bind(this);

	this.authenticateUser = this.authenticateUser.bind(this);
	this.fetchPermissions = this.fetchPermissions.bind(this);

	this.setPIN = this.setPIN.bind(this);
	this.fetchChats = this.fetchChats.bind(this);
	this.fetchGroup = this.fetchGroup.bind(this);
	this.fetchChat = this.fetchChat.bind(this);
	this.fetchChatEntries = this.fetchChatEntries.bind(this);
	
	this.selectChat = this.selectChat.bind(this);

	this.sendEntry = this.sendEntry.bind(this);
	this.updateEntry = this.updateEntry.bind(this);
	this.newEntry = this.newEntry.bind(this);
	this.newImage = this.newImage.bind(this);

	this.updateChatEntries = this.updateChatEntries.bind(this);


	this.showDescription = this.showDescription.bind(this);

	this.getAsyncStorageEntry = this.getAsyncStorageEntry.bind(this);

	this.getLastSeen = this.getLastSeen.bind(this);
	this.updateLastSeen = this.updateLastSeen.bind(this);

	this.getLastEntries = this.getLastEntries.bind(this);
	this.updateLastEntries = this.updateLastEntries.bind(this);

	
	this.preventCaching = this.preventCaching.bind(this);

	this.state = {
	    credentials: {},
	    users: {},
	    chats: {},
	    current_chat:  {},
	    current_entry: {},
	    scene: null,
	};
    }

    /*************************************************************************/
    componentDidMount() {
	this.lock();
    }

    /*************************************************************************/
    back(backScene) {
	this.setState({ scene: backScene });
    }
    /*************************************************************************/
    next(nextScene) {
	this.setState({ scene: nextScene });
    }

    
    /*************************************************************************/
    lock() {
	let app = this;
	var context = {};

	//app.exitFullscreen();
	
	this.getLocalUsers(context)
	    .then(function(context) {
		var users = context.users;
		app.setState({
		    credentials: {
			alias: null,
			uid: null,
			auth_hash: null,
			pin: null,
			auth_token: null,
		    },
		    users: users,
		    chats: {},
		    current_chat: null,
		    current_entry: {
			type: null,
			user: null,
			chat: null,
			message: '',
		    },
		    scene: 'select user',
		});
	    })	
    }

    	
    /*************************************************************************/
    /*************************************************************************/
    selectUser(credentials) {
	let app = this;
	//app.requestFullscreen();
	
	app.setState(
	    update(app.state, { 
		scene: { $set: 'ask PIN' },
		$merge: { credentials: credentials },
	    })
	);
    }
    
    /*************************************************************************/
    getLocalUsers(context) {
	let app = this;
	return AsyncStorage.getItem('OnervaUsers')
			   .then(function(value) {
			       //console.log('Getting local users: ' + JSON.stringify(value));
			       var users = {};
			       if ( value ) {
				   try {
				       users = JSON.parse(value);
				   }
				   catch(error) {
				       users = {};
				   }
			       }
			       if ( ! users )
				   users = {};

			       context.users = users;
			       
			       //console.log('Getting local users: ' + JSON.stringify(users));

			       return context;
			   });
    }
    /*************************************************************************/
    setLocalUsers(users) {
	//console.log('Setting local users: ' + JSON.stringify(users));
	AsyncStorage.setItem('OnervaUsers', JSON.stringify(users));
    }

    /*************************************************************************/
    getAsyncStorageEntry(storageId, contextId, context) {
	let app = this;
	return AsyncStorage.getItem(storageId)
		       .then(function(value) {
			   var data = {};
			   if ( value ) {
			       try {
				   data = JSON.parse(value);
			       }
			       catch(error) {
				   data = {};
			       }
			   }
			   if ( ! data )
			       data = {};
			   
			   context[contextId] = data;
			   
			   return context;
		       });
    }
    
    /*************************************************************************/
    getLastSeen(context) {
	return this.getAsyncStorageEntry('OnervaLastSeen', 'lastSeen', context);
    }
    /*************************************************************************/
    updateLastSeen(cid,timestamp) {
	let app = this;
	var context = {};
	Promise.resolve(context)
	       .then(app.getLastSeen)
	       .then(function(context) {
		   let lastSeen = {};
		   //console.log(context.lastSeen);
		   if ( context.lastSeen )
		       lastSeen = Object.assign({},context.lastSeen);
		   lastSeen[cid] = timestamp;
		   AsyncStorage.setItem('OnervaLastSeen', JSON.stringify(lastSeen));
		   //console.log('Last seen: ' + JSON.stringify(lastSeen));
		   app.state.chats[cid].lastSeen = timestamp;	   
	       });
    }

    /*************************************************************************/
    getLastEntries(context) {
	return this.getAsyncStorageEntry('OnervaLastEntries', 'lastEntries', context);
    }
    /*************************************************************************/
    updateLastEntries(cid,timestamp) {
	let app = this;
	var context = {};
	Promise.resolve(context)
	       .then(app.getLastEntries)
	       .then(app.getLastSeen)
	       .then(function(context) {
		   let lastEntries = {};
		   //console.log(context.lastEntries);
		   if ( context.lastEntries )
		       lastEntries = Object.assign({},context.lastEntries);
		   lastEntries[cid] = timestamp;
		   AsyncStorage.setItem('OnervaLastEntries', JSON.stringify(lastEntries));
		   //console.log('Last entries: ' + JSON.stringify(lastEntries));
		   //console.log('Last seen: ' + JSON.stringify(context.lastSeen));
		   //app.state.chats[cid].lastEntry = timestamp;
		   //app.state.chats[cid].lastSeen = context.lastSeen[cid];
	       });
    }


    /*************************************************************************/
    showLogin() {
	let app = this;
	app.setState({ scene: 'ask login' });
    }

    /*************************************************************************/
    showDescription() {
	let app = this;
	app.setState({ scene: 'description scene' });
    }

    /*************************************************************************/
    loginUser(email, password, pin, remember) {
	let app = this;

	email    = email.trim();
	password = password.trim();
	pin      = pin.trim();

	var context = {
	    credentials: {
		email:    email,
		password: password,
		pin:      pin,
	    }
	};
	
	Promise.resolve(context)
	       .then(app.authenticateUser)
	       .then(app.fetchPermissions)
	       .then(app.getLocalUsers)
	       .then(function(context) {
		   //console.log(context);
		   let users = context.users;
		   let credentials = {
		       uid:       context.credentials.uid,
		       alias:     context.credentials.alias,
		       auth_hash: context.credentials.auth_hash,
		       gids:      context.readable_gids
		   };
		   users[credentials.alias] = credentials;
		   if ( remember ) {
		       app.setLocalUsers(users);
		   }
			   
		   var users_this_only = {};
		   users_this_only[credentials.alias] = credentials;
		   //console.log(JSON.stringify(users_this_only));
		   //console.log('https://onervahoiva.fi/onerva2/pikalinkki.html?data=' + Base64.encode(JSON.stringify(users_this_only)).replace(/\+/g,'-').replace(/\//g,'_').replace(/\=/g,'.') + '&e');
		   //console.log(credentials);
		   //console.log(users);
		   
		   credentials.pin = pin;
		   credentials.auth_token = onerva.util.encodeAuthToken({
		       uid:       credentials.uid,
		       auth_hash: credentials.auth_hash,
		       pin:       credentials.pin,
		       gids:      credentials.gids,
		   });
		   
		   app.setState(
		       update(app.state, { 
			   scene: { $set: 'loading chats' },
			   $merge: { credentials: credentials },
		       }));
		   
		   return context;
	       })
	       .catch(function(error) {
		   console.log(error);
		   if ( error.error == "User authentication failed" )
		       app.errorScene = ( <ErrorScene error={'Kirjautuminen epäonnistui. Tarkista tunnus, salasana ja PIN-koodi. Jos ongelma ei ratkea, ota yhteyttä tukeen.'} backScene={'ask login'} onBack={app.back} /> );
		   else if ( error.error && error.error.indexOf("User authentication postponed") >= 0 )
		       app.errorScene = ( <ErrorScene error={'Kirjautuminen epäonnistui, koska tunnus on väliaikaisesti lukittu liian monen epäonnistumisen jälkeen. Odota muutama minuutti ennen kuin yrität kirjautua uudelleen. Jos ongelma ei ratkea, ota yhteyttä tukeen.'} backScene={'ask login'} onBack={app.back} /> );
		   else
		       app.errorScene = ( <ErrorScene error={'Ongelma haettaessa tietoja'} backScene={'ask login'} onBack={app.back} /> );
		   app.setState({ scene: 'error' });
		   return;
	       });
    }
    
    /*************************************************************************/
    authenticateUser(context) {
	let app = this;
	
	return fetch(config.api_url + '/auth' + app.preventCaching(), {
	    method: 'POST',
	    // mode: 'cors',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json', },
	    body:
		 JSON.stringify(context.credentials),
	}).then(
	    (response) => response.json()
	).then(
	    (responseJson) => {
		if ( responseJson.uid ) {
		    context.credentials.uid = responseJson.uid;
		    context.credentials.alias = responseJson.alias;
		    context.credentials.auth_hash = responseJson.auth_hash;
		    context.credentials.auth_token = onerva.util.encodeAuthToken({
			uid:       context.credentials.uid,
			auth_hash: context.credentials.auth_hash,
			pin:       context.credentials.pin,
			gids:      [],
		    });
		}
		else
		    throw responseJson;
		
		//console.log(responseJson);
		return context;
	    }
	);
    }

    /*************************************************************************/
    fetchPermissions(context) {
	let app = this;
	
	return fetch(config.api_url + '/permissions/' + context.credentials.uid + app.preventCaching(), {
	    method: 'GET',
	    // mode: 'cors',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': context.credentials.auth_token,
	    },
	}).then(
	    (response) => response.json()
	).then(
	    (responseJson) => {
		let permissions = responseJson;
		let readable_gids = [];
		let writable_gids = [];
		
		for(let i = 0; i < permissions.length; ++i) {
		    if ( permissions[i].role == "group reader" )
			readable_gids.push(permissions[i].target.substring(4));
		    if ( permissions[i].role == "group writer" )
			writable_gids.push(permissions[i].target.substring(4));
		}
		//console.log(JSON.stringify(permissions));
		context.readable_gids = readable_gids;
		context.writable_gids = writable_gids;

		context.credentials.auth_token = onerva.util.encodeAuthToken({
		    uid:       context.credentials.uid,
		    auth_hash: context.credentials.auth_hash,
		    pin:       context.credentials.pin,
		    gids:      readable_gids,
		});

		return context;
	    }
	).catch(function(error) {
	    console.log(error);
	});
    }


    /*************************************************************************/
    
    /*************************************************************************/
    setPIN(pin) {
	let app = this;
	let credentials = this.state.credentials;
	credentials.pin = pin;
	credentials.auth_token = onerva.util.encodeAuthToken({
	    uid:       credentials.uid,
	    auth_hash: credentials.auth_hash,
	    pin:       credentials.pin,
	    gids:      credentials.gids,
	});

	// if has gids already
	if ( credentials.gids && credentials.gids.length > 0 ) {
	    //console.log(credentials);
	    
	    this.setState(
		update(this.state, { 
		    scene: { $set: 'loading chats' },
		    $merge: { credentials: credentials },
		}));

	    return;
	}
	// if does not have gids, fetch permissions and set gids
	else {
	    app.setState(
		update(app.state, { 
		    scene: { $set: 'loading permissions' },
		}));

	    var context = { credentials: credentials };
	    context.credentials.gids = [];
	    context.credentials.auth_token = onerva.util.encodeAuthToken({
		uid:       context.credentials.uid,
		auth_hash: context.credentials.auth_hash,
		pin:       context.credentials.pin,
		gids:      context.credentials.gids,
	    });
	    
	    Promise.resolve(context)
		.then(app.fetchPermissions)
		.then(app.getLocalUsers)
		.then(function(context) {
		    let users = context.users;
		    let credentials = {
			uid:       context.credentials.uid,
			alias:     context.credentials.alias,
			auth_hash: context.credentials.auth_hash,
			gids:      context.readable_gids
		    };
		    users[credentials.alias] = credentials;
		    app.setLocalUsers(users);

		    credentials.pin = pin;
		    credentials.auth_token = onerva.util.encodeAuthToken({
			uid:       credentials.uid,
			auth_hash: credentials.auth_hash,
			pin:       credentials.pin,
			gids:      credentials.gids,
		    });
		    //console.log(credentials);
		    
		    app.setState(
			update(app.state, { 
			    scene: { $set: 'loading chats' },
			    $merge: { credentials: credentials },
			}));
		});
	    return;
	}
    }
    
    /*************************************************************************/
    fetchChats() {
	let app = this;

	//console.log(JSON.stringify(app.state.credentials));
	var context = {
	    credentials: app.state.credentials,
	    chats: {},
	};
	
	Promise.resolve(context)
	       .then(function(context) {
		   let group_promises = [];
		   for(let i = 0; i < context.credentials.gids.length; ++i) {
		       let group_context = {
			   credentials: context.credentials,
			   group:       { gid: context.credentials.gids[i] }
		       };
		       group_promises.push(app.fetchGroup(group_context));
		   }
		   
		   return Promise.all(group_promises)
				 .then(function(group_context_array) {				     
				     let chat_promises = [];
				     
				     for(let i = 0; i < group_context_array.length; ++i) {
					 for(let j = 0; j < group_context_array[i].group.chats.length; ++j) {
					     let chat_context = {
						 credentials: context.credentials,
						 chat:        { cid: group_context_array[i].group.chats[j].cid }
					     };
					     //console.log('Fetching chat ' + chat_context.chat.cid);
					     chat_promises.push(app.fetchChat(chat_context));
					 }
				     }
				     
				     return Promise.all(chat_promises)
						   .then(function(chat_context_array) {
						       for(let i = 0; i < chat_context_array.length; ++i) {
							   // console.log('Fetched chat ' + chat_context_array[i].chat.cid);
							   context.chats[chat_context_array[i].chat.cid] = chat_context_array[i].chat;
				   }
						       return context;
						   })
				 })
		   
	       })
	       .then(function(context) {
		   //console.log(context);
		   app.setState(
		       update(app.state, { 
			   scene: { $set: 'select chat' },
			   chats: { $set: context.chats },
		       }));
		   
		   return context;
	       })
	       .then(function(context) {
		   let chats = [];
		   Object.keys(context.chats).map(function (key) {
		       chats.push(context.chats[key])
		   });
		   
		let entry_promises = [];
		   for(let i = 0; i < chats.length; ++i) {
		       let entry_context = {
			   credentials: context.credentials,
			   chat:    { cid: chats[i].cid },
			   entries: {
			       type:  '*',
			       offset: 0,
			       limit:  10,
			   }
		       };
		       entry_promises.push(app.fetchChatEntries(entry_context));
		   }
		   return Promise.all(entry_promises)
				 .then(function(entry_context_array) {
				     //console.log(JSON.stringify(entry_context_array));
				     for(let i = 0; i < entry_context_array.length; ++i) {
					 let ctx = entry_context_array[i];
					 context.chats[ctx.chat.cid].entries = ctx.entries;
				     }
				     //console.log(context);
				     return context;
				 })
				 .catch(function(error) {
				     console.log(JSON.stringify(error));
				     throw error;
				 });
		       
	       })
	       .then(app.getLastSeen)
	       .then(app.getLastEntries)
	       .then(function(context) {
		   //console.log('Last Seen    ' + JSON.stringify(context.lastSeen));
		   //console.log('Last Entries ' + JSON.stringify(context.lastEntries));
		   if ( context.lastSeen )
		       Object.keys(context.lastSeen).map(function(key) {
			   if ( context.chats.hasOwnProperty(key) )
			       context.chats[key].lastSeen = context.lastSeen[key];
		       });
		   if ( context.lastEntries )
		       Object.keys(context.lastEntries).map(function(key) {
			   if ( context.chats.hasOwnProperty(key) )
			       context.chats[key].lastEntry = context.lastEntries[key];
		       });
		   
		   return context;
	       })
	       .then(function(context) {
		   //console.log(context);
		   app.setState(
		       update(app.state, { 
			   chats: { $set: context.chats },
		       }));

		   return context;
	       })
	       .catch(function(error) {
		   console.log(error);
		   if ( error.error == "User authentication failed" )
		       app.errorScene = ( <ErrorScene error={'Kirjautuminen epäonnistui. Tarkista tunnus, salasana ja PIN-koodi. Jos ongelma ei ratkea, ota yhteyttä tukeen.'} backScene={'ask PIN'} onBack={app.back} /> );
		   else
		       app.errorScene = ( <ErrorScene error={'Ongelma haettaessa tietoja'} backScene={'ask PIN'} onBack={app.back} /> );
		   app.setState({ scene: 'error' });
		   return;
	       });
    }
    
    /*************************************************************************/
    fetchGroup(context) {
	let app = this;
	
	return fetch(config.api_url + '/groups/' + context.group.gid + app.preventCaching(), {
	    method: 'GET',
	    // mode: 'cors',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': context.credentials.auth_token,
	    },
	}).then(
	    (response) => response.json()
	).then(
	    (responseJson) => {
		//console.log(JSON.stringify(responseJson));
		if ( responseJson.error )
		    throw responseJson;
		else if ( responseJson.gid )
		    context.group = responseJson;
		else
		    throw new Error('Fetching group failed.');
		return context;
	    });
    }
    
    /*************************************************************************/
    fetchChat(context) {
	let app = this;
	
	return fetch(config.api_url + '/chats/' + context.chat.cid + app.preventCaching(), {
	    method: 'GET',
	    // mode: 'cors',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': context.credentials.auth_token,
	    },
	}).then(
	    (response) => response.json()
	).then(
	    (responseJson) => {
		//console.log(JSON.stringify(responseJson));
		if ( responseJson.cid )
		    context.chat = responseJson;
		else
		    throw new Error('Fetching chat failed.');
		return context;
	    })
    }


    /*************************************************************************/
    fetchChatEntries(context) {
	let app = this;
	
	return fetch(config.api_url + '/chats/' + context.chat.cid + '/entries/' + context.entries.type + '-' + context.entries.offset + '-' + context.entries.limit + app.preventCaching(), {
	    method: 'GET',
	    // mode: 'cors',
	    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': context.credentials.auth_token,
	    },
	}).then(function(response) {
	    //console.log('Fecthed entries ' + JSON.stringify(response));
	    return response.json();
	}).then(
	    (responseJson) => {
		//console.log('Fecthed entries ' + JSON.stringify(responseJson));
		if ( responseJson.length >= 0 ) {
		    context.entries = responseJson;
		    if ( context.entries.length > 0 )
			app.updateLastEntries(context.chat.cid, context.entries[0].timestamp);
		}
		else
		    throw new Error('Fetching chat entries failed.');
		return context;
	    });
    }


    /*************************************************************************/



    /*************************************************************************/
    selectChat(chat) {
	let app = this;
	
	let nextScene = 'loading chat';
	if ( chat.entries.length > 0 )
	    nextScene = 'chat scene';
	    
	app.setState(
	    update(app.state, { 
		scene: { $set: 'loading chat' },
		current_chat:  { $set: chat },
		current_entry: { $set: {
		    type: 'message',
		    user: {
			uid:   app.state.credentials.uid,
			alias: app.state.credentials.alias,
		    },
		    chat: chat,
		    message: '',
		    dataURL: '',
		} }
	    }));
	
	// description
	let entry_context = {
	    credentials: this.state.credentials,
	    chat:    { cid: chat.cid },
	    entries: {
		type:  'description',
		offset: 0,
		limit:  1,
	    }
	};
	return Promise.resolve(entry_context)
		      .then(app.fetchChatEntries)
		      .then(function(context) {
			  let newState = update(app.state, {
			      scene: { $set: 'chat scene'}
			  });
			  if ( context.entries && context.entries.length > 0 ) {
			      let chats = app.state.chats;
			      chats[context.chat.cid].description = context.entries[0];
			      newState = update(app.state, {
				  chats: { $set: chats },
				  scene: { $set: 'chat scene'}
			      }); 
			  }
			  app.setState(newState);

			  return context;
		      })
		      .catch(function(error) {
			  console.log(error);
			  app.errorScene = ( <ErrorScene error={'Ongelma haettaessa tietoja'} backScene={'ask PIN'} onBack={app.back} /> );
			  app.setState({ scene: 'error' });
			  return;
		      });

    }
    
    /*************************************************************************/
    updateChatEntries(chat, limit) {
	let app = this;
	
	let entry_context = {
	    credentials: this.state.credentials,
	    chat:    { cid: chat.cid },
	    entries: {
		type:  '*',
		offset: 0,
		limit:  limit,
	    }
	}
	
	return Promise.resolve(entry_context)
		      .then(app.fetchChatEntries)
		      .then(function(context) {
			  //console.log(context);
			  if ( context.entries ) {
			      let chats = app.state.chats;
			      chats[context.chat.cid].entries = context.entries;
			      let newState = update(app.state, { chats: { $set: chats } });
			      app.setState(newState);
			  }
			  return context;
		      });
    }

    
    /*************************************************************************/
    newEntry() {
	/*
    	   if ( this.state.current_chat.description )
	   this.setState({scene : 'description scene'});
	   else
	 */
	this.setState({scene : 'grades scene'});
    }

    /*************************************************************************/
    newImage() {
	/*
    	   if ( this.state.current_chat.description )
	   this.setState({scene : 'description scene'});
	   else
	 */
	this.setState({scene : 'image scene'});
    }

    /*************************************************************************/
    updateEntry(entry) {
	var newState = update(this.state, {
	    current_entry: { $merge: entry },
	} );
	this.setState(newState);
	//console.log(newState);
    }
    
    /*************************************************************************/
    sendEntry(entry) {
	let app = this;
	
	if ( ! entry )
	    entry = this.state.current_entry;

	// add timestamp and clean up
        entry.timestamp = onerva.util.getTimestamp();
	entry.chat = {
	    cid: entry.chat.cid,
	    alias: entry.chat.alias
	};
	
	//console.log(entry);
	
	this.setState( { lastSent: entry.timestamp } );

	//console.log(entry);

	return fetch(config.api_url + '/chats/' + this.state.current_chat.cid +  '/entries', {
            method: 'POST',
            //mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
		'Authorization': app.state.credentials.auth_token,
	    },
            body:
		 JSON.stringify({ entry: entry }),
        })
	    .then(function(response) {
		//console.log(response);
		return response.json();
	    }).then(function(responseJson) {
		// update state: chats[cid]
		let entry = responseJson;
		if ( entry.timestamp ) {
		    let chats = app.state.chats;
		    chats[entry.chat.cid].entries.unshift(entry); // push to front
		    let newState = update(app.state, { chats: { $set: chats } });
		    app.setState(newState);
		}
		else
		    throw responseJson;

		let context = { entry: entry }

		return context;
	    })
	    .then(function(context) {
		app.setState({
		    scene: 'chat scene',
		    current_entry: {
			type: 'message',
			user: {
			    uid:   app.state.credentials.uid,
			    alias: app.state.credentials.alias,
			},
			chat: entry.chat,
			message: '',
			dataURL: '',
		    }
		});

		//console.log(context);
		return context;
	    });
    }


    /*************************************************************************/
    /*************************************************************************/
    requestFullscreen() {
	var domNode = ReactDOM.findDOMNode(this);

	if (domNode.requestFullscreen) {
	    domNode.requestFullscreen();
	} else if (domNode.webkitRequestFullscreen) {
	    domNode.webkitRequestFullscreen();
	} else if (domNode.mozRequestFullScreen) {
	    domNode.mozRequestFullScreen();
	} else if (domNode.msRequestFullscreen) {
	domNode.msRequestFullscreen();
	}
    }
    /*************************************************************************/
    exitFullscreen() {
	var domNode = document;

	if (domNode.exitFullscreen) {
	    domNode.exitFullscreen();
	} else if (domNode.webkitExitFullscreen) {
	    domNode.webkitExitFullscreen();
	} else if (domNode.mozCancelFullScreen) {
	    domNode.mozCancelFullScreen();
	} else if (domNode.msExitFullscreen) {
	    domNode.msExitFullscreen();
	}
    }

    /*************************************************************************/
    preventCaching() {
    	return '?' + Date.now();
    }   

    /*************************************************************************/
    render() {
	let bodyStyle = {
	    position: 'absolute',
	    top: 0,
	    bottom: 0,
	    left: 0,
	    right: 0,
	    padding: 0,
	    margin: 0,
	    backgroundColor: colors.body,
	    fontFamily: 'Helvetica',
	    display: 'flex',
	    //flexDirection: 'row',
	    justifyContent: 'center', //'flex-start',
	    alignItems: 'stretch'
	};
	let rootStyle = {
	    maxWidth: mm2dp(120),
	    backgroundColor: colors.background,
	    display: 'flex',
	    //flexDirection: 'row',
	    //justifyContent: 'stretch',
	    alignItems: 'stretch',
	    flexGrow: 1,
	    flexShrink: 0,
	    flexBasis: 0
	};

	//console.log( config.platform );
	return (
	    <View style={bodyStyle}>
	    <View style={rootStyle}>
	    {
		this.getScene()
	    }
	    </View>
	    <KeyboardSpacer/>
	    </View>
	);
    }

    /*************************************************************************/
    getScene() {
	let app = this;

	//console.log(this.state.scene);
	//console.log(this.state.entry);

	switch( this.state.scene ) {
	    case 'error':
		return app.errorScene;

	    case 'select user':
		return ( <SelectUserScene users={app.state.users} onSelect={app.selectUser} onLogin={app.showLogin} onBack={null} backScene={null} onLock={null} /> )

	    case 'ask login':
		return ( <LoginScene onLogin={app.loginUser} onBack={app.back} backScene={'select user'}  onLock={app.lock} /> )

	    case 'ask PIN':
		return ( <PinScene credentials={app.state.credentials} onPin={app.setPIN} onBack={app.back} backScene={'select user'} onLock={app.lock} /> )

	    case 'loading chats':
		return ( <LoadingScene key={'loading_chats'} opacity={0.3} onShow={app.fetchChats} /> )
	    
	    case 'loading chat':
		return ( <LoadingScene key={'loading_chat'} opacity={0.3} onShow={null} /> )

	case 'loading permissions':
		return ( <LoadingScene key={'loading_permissions'} opacity={0.3} onShow={null} /> )

	    case 'select chat':
		return ( <SelectChatScene chats={app.state.chats} onSelect={app.selectChat} onLock={app.lock} /> )
		//return ( <SelectChatScene chats={app.state.chats} onSelect={app.selectChat} onBack={app.back} backScene={'select user'} onLock={app.lock} /> )

	    case 'chat scene':
		return ( <ChatScene credentials={app.state.credentials} chat={app.state.current_chat} entry={app.state.current_entry} onUpdateEntry={app.updateEntry} onSendEntry={app.sendEntry} onUpdateChat={app.updateChatEntries} onNewEntry={app.newEntry} onNewImage={app.newImage} onShowDescription={app.showDescription} onUpdateLastSeen={app.updateLastSeen} onBack={app.back} backScene={'select chat'} onLock={app.lock} /> )


	    case 'description scene':
		return ( <DescriptionScene chat={app.state.current_chat} onNext={app.next} nextScene={'chat scene'} onBack={app.back} backScene={'chat scene'} onLock={app.lock} /> )

	    case 'grades scene':
		return ( <GradesScene chat={app.state.current_chat} entry={app.state.current_entry} onUpdateEntry={app.updateEntry} onNext={app.next} nextScene={'actions scene'} onBack={app.back} backScene={'chat scene'} onLock={app.lock} /> )

	    case 'actions scene':
		return ( <ActionsScene chat={app.state.current_chat} entry={app.state.current_entry} onUpdateEntry={app.updateEntry} onNext={app.next} nextScene={'message scene'} onBack={app.back} backScene={'grades scene'} onLock={app.lock} /> )

	    case 'message scene':
		return ( <MessageScene chat={app.state.current_chat} entry={app.state.current_entry} onUpdateEntry={app.updateEntry} onNext={app.next} nextScene={'sending scene'} onBack={app.back} backScene={'actions scene'} onLock={app.lock} /> )

	    case 'image scene':
		return ( <ImageScene chat={app.state.current_chat} entry={app.state.current_entry} onUpdateEntry={app.updateEntry} onNext={app.next} nextScene={'sending scene'} onBack={app.back} backScene={'chat scene'} onLock={app.lock} /> )


	    case 'sending scene':
		return ( <LoadingScene opacity={0.3} onShow={app.sendEntry} /> )
		
		// onUpdateChat={app.updateChat} onUpdateEntry={app.updateEntry} onSendEntry={app.sendEntry} onNewEntry={app.newEntry}
		//return ( <ChatScene credentials={app.state.credentials} chat={app.state.chat} entry={app.state.entry} lastSent={app.state.lastSent} onUpdateChat={app.fetchChat} onUpdateEntry={app.updateEntry} onSendEntry={app.sendEntry} onNewEntry={app.newEntry} onBack={app.back} backScene={'select chat'} onLock={app.lock} /> )




		
		
	    case 'ask OnervaID':
		return ( <LoginScene onervaID={app.state.credentials.onervaID} onLogin={app.setOnervaID} /> )

	    case 'loading OnervaID':
		return ( <LoadingScene key={'loading_id'} onShow={app.fetchOnervaID} /> )

 	    case 'loading users':
		return ( <LoadingScene key={'loading_users'} onShow={app.fetchUsers} /> )
 


	    default:
		return ( <SplashScreen /> )
	}
    }
}

export default Onerva;
