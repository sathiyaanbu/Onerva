function setUserFromHref2() {
    var debug = 'DEBUG';
    try {


	var loc     = location.href;
	var b64data = loc.split("?data=")[1];
	
	if ( ! b64data ) {
	    document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	return;
	}
	b64data = b64data.split("&e")[0];
	if ( ! b64data ) {
	    document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	    return;
	}
	
	b64data = b64data.replace(/\./g,'=').replace(/_/g,'/').replace(/\-/g,'+');
	console.log(b64data);
	var data = atob(b64data);    
	console.log(data);
	if ( ! data ) {
	    document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	    return;
	}

	debug += '<div>new_users = <br/>' + data + '</div>';
	
	var new_users = JSON.parse(data);
	if ( ! new_users ) {
	    document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	    return;
	}

	var users = localStorage.getItem('OnervaUsers');

	debug += '<div>users = <br/>' + users + '</div>';
	
	if ( users )
            users = JSON.parse(users);
	if ( ! users )
	    users = {};
	

	debug += '<div>upserted users = </div>';
	for(var alias in new_users) {
	    debug += '<div>' + alias + '= <br/>' + JSON.stringify(new_users[alias]) + '</div>';
	    document.getElementById('debug').innerHTML = debug;
	    users[alias] = new_users[alias];
	}


	debug += '<div>JSON users = <br/>' + JSON.stringify(users) + '</div>';
	document.getElementById('debug').innerHTML = debug;
	
	localStorage.setItem('OnervaUsers', JSON.stringify(users));

	users = localStorage.getItem('OnervaUsers');
	
	debug += '<div>resulting users = <br/>' + users + '</div>';
	document.getElementById('debug').innerHTML = debug;

	
	//location.href='https://onervahoiva.fi/onerva2';

    } catch(error) {
	document.getElementById('info').innerHTML = '<div>Pikalinkki epäonnistui, ota yhteys tukeen.</div><div>' + error + '</div>';
    }
}
    
function setUserFromHref() {
    var loc     = location.href;
    var b64data = loc.split("?data=")[1];

    if ( ! b64data ) {
	document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	return;
    }
    b64data = b64data.split("&e")[0];
    if ( ! b64data ) {
	document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	return;
    }
    
    b64data = b64data.replace(/\./g,'=').replace(/_/g,'/').replace(/\-/g,'+');
    console.log(b64data);
    var data = atob(b64data);    
    console.log(data);
    if ( ! data ) {
	document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	return;
    }
    var new_users = JSON.parse(data);
    if ( ! new_users ) {
	document.getElementById('info').innerHTML = 'Pikalinkki epäonnistui, ota yhteys tukeen.';
	return;
    }
    
    var users = localStorage.getItem('OnervaUsers');
    if ( users )
        users = JSON.parse(users);
    if ( ! users )
	users = {};

    for(var alias in new_users)
	users[alias] = new_users[alias];

    localStorage.setItem('OnervaUsers', JSON.stringify(users));

    location.href='https://onervahoiva.fi/onerva2';
}
