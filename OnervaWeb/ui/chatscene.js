import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    pt2dp,
} from './react-onerva';

import Header from './header';
import ChatScrollView from './chatscrollview';
import SpeechBubble from './speechbubble';
import ChatFooter from './chatfooter';

var styles = require('./styles');
var colors = require('./colors');

const loadingIcon = require('./imgs/loading.png');


export default class SelectChatScene extends Component {
    constructor(props, context) {
	super(props, context);

	this.updateChat = this.updateChat.bind(this);
	this.animate = this.animate.bind(this);
	this.scrollToBottom = this.scrollToBottom.bind(this);

	this.state = {
	    limit: 10,
	    lastSeen: null,
	    lastScroll: null,
	    isLoading: false,
	    rotation: 0,
	    dontScroll: false,
	    updateSkips: 1,
	    updateIndex: 1,
	};
    }

    /**************************************************************************/
    componentDidMount() {
	this.interval  = setInterval(this.updateChat, 500);
	if ( this.props.chat.entries.length > 0 ) {
	    //console.log('Last Seen called');
	    this.props.chat.lastSeen = this.props.chat.entries[0].timestamp;
	    this.props.onUpdateLastSeen(this.props.chat.cid, this.props.chat.entries[0].timestamp);
	}
    }
    /**************************************************************************/
    componentWillUnmount() {
	//clearInterval(this.interval2);
	clearInterval(this.interval);
	//clearTimeout(this.timeout);
    }

    /**************************************************************************/
    componentWillReceiveProps(nextProps) {
	//console.log('chat scene props ' + JSON.stringify(new Date(Date.now())));

	if ( nextProps.chat.entries.length > 0 ) {
	    this.state.lastSeen = nextProps.chat.entries[0].timestamp;
	    nextProps.chat.lastSeen = nextProps.chat.entries[0].timestamp;
	    this.props.onUpdateLastSeen(nextProps.chat.cid, nextProps.chat.entries[0].timestamp);
	}
	
	
	/* does not work, because new is already same as old
	let old_entries = this.props.chat.entries;
	let new_entries = nextProps.chat.entries;
	console.log(old_entries);
	console.log(new_entries);
	if ( old_entries[0].timestamp
	     == new_entries[0].timestamp )
	    console.log('same');
	else
	    console.log('diff');
	*/

	
	/*
	if ( nextProps.lastSent != this.props.lastSent ) {
	    this.setState({ isLoading: true, rotation: 0 });
	    //this.interval2 = setInterval(this.animate, 1000/60);
	    this.interval2 = setInterval(this.animate, 1000/2);	    
	}
	*/
    }
    
    /**************************************************************************/
    componentWillUpdate() {
	/*
	let lastScroll = this.state.lastScroll;
	let lastGot = null;
	
	if ( this.props.chat.entries && this.props.chat.entries[0] )
	    lastGot = this.props.chat.entries[0].timestamp;

	if ( lastGot != lastScroll ) {
	    setTimeout(this.scrollToBottom, 300);
	    this.setState({ lastGot: lastGot, lastScroll: lastGot });
	}
	*/
    }

    /**************************************************************************/
    componentDidUpdate(prevProps, prevState) {
	if ( this.state.lastScrolled != this.state.lastSeen ) {
	    this.setState({ lastScrolled: this.state.lastSeen });
	    this.scrollToBottom();
	}
	
	/*
	let lastSent = this.props.lastSent;
	if ( this.props.chat.entries ) {
	    let found = false;
	    for(let i = 0; i < this.props.chat.entries.length; ++i) {
		let entry = this.props.chat.entries[i];
		//console.log(entry.timestamp + ' ' + lastSent + ' ' + entry.timestamp.localeCompare(lastSent) + ' ' + (entry.timestamp == lastSent));
		if ( entry.timestamp == lastSent ) {
		    found = true;
		    break;
		}
	    }
	    if ( found && this.state.isLoading && this.state.rotation > 9 ) {
		this.setState({ isLoading: false });
		clearInterval(this.interval2);
	    }
	}
	*/
    }

    /**************************************************************************/
    animate() {
	if ( this.state.isLoading )
	    this.setState({ rotation: this.state.rotation + 3 });
	//if ( this.state.isLoading && this.state.rotation % 60 == 0 )
	this.refs.chatScrollView.scrollToBottom();
    }

    /**************************************************************************/
    scrollToBottom() {
	if ( this.refs.chatScrollView )
    	    this.refs.chatScrollView.scrollToBottom();
    }

    /**************************************************************************/
    updateChat(limit) {
	let chat = this.props.chat;
	let n = 0;
	if ( limit && limit > n )
	    n = limit;
	if ( this.state.limit && this.state.limit > n )
	    n = this.state.limit;
	if ( this.props.chat.entries && this.props.chat.entries.length > n )
	    n = this.props.chat.entries.length;

	//console.log('Update Chat ' + this.state.updateIndex + ' / ' + this.state.updateSkips + ' = ' + (this.state.updateIndex >= this.state.updateSkips) );
	//console.log(' n: ' + n)
	if ( this.state.updateIndex >= this.state.updateSkips ) {
	    console.log('Update chat fetching ' + n);	    
	    this.props.onUpdateChat(chat, n);
	    this.setState({
		limit: n,
		updateIndex: 1,
		updateSkips: Math.min(this.state.updateSkips * 4, 16)
	    });
	}
	else {
	    this.setState( {
		limit: n,
		updateIndex: this.state.updateIndex + 1
	    } );
	}
    }
        
    /**************************************************************************/
    /**************************************************************************/
    render() {
	let scene = this;

	let activityIndicator = ( <View /> );
	if ( this.state.isLoading ) {
	    let i = (this.state.rotation / 3) % 3;
	    let text = '......'.substring(2-i, 4 + i);
	    activityIndicator = (
	    	    <View style={{ height: '35pt', display: 'flex', justifyContent: 'center' }}>
		    <Text style={{ fontSize: '19pt', fontWeight: 'bold', color: colors.gray }}>
		    {text}
		    </Text>
		    </View>
	    )
	}
	
	    
	// newest first, so reverse
	let entries = Array.prototype.slice.call(scene.props.chat.entries);
	entries.reverse();

	
	return (
	    <View style={[styles.flex110, styles.flexCol]}>
	    
	    <Header title={scene.props.chat.alias} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <ChatScrollView ref={'chatScrollView'} dontScroll={scene.state.dontScroll} >
		
	    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
	    <Button style={{backgroundColor: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: pt2dp(15), margin: pt2dp(15), marginTop: pt2dp(5), marginBottom: pt2dp(3), padding: pt2dp(3), paddingLeft: pt2dp(20), paddingRight: pt2dp(20), fontSize: pt2dp(9), fontWeight: 'bold', color: colors.gray }}
	    onPress={()=>{
		scene.setState({ updateIndex: 100, dontScroll: true });
		scene.updateChat(scene.state.limit + 5);
	    }} >
	    <Text>HAE VANHEMPIA VIESTEJÄ</Text>
	    </Button>
	    
	    </View>
	    {
		entries.map(function(item, index) {
		    return <SpeechBubble key={'speechbubble'+item.timestamp} entry={item} user={scene.props.credentials} />
		})
	    }

	    { activityIndicator }

	    </ChatScrollView>
	    
	    <ChatFooter chat={scene.props.chat} entry={scene.props.entry} onUpdateEntry={scene.props.onUpdateEntry} onSendEntry={scene.props.onSendEntry} onNewEntry={scene.props.onNewEntry} onNewImage={scene.props.onNewImage} onShowDescription={scene.props.onShowDescription} />


	    </View>
	)
    }
}
