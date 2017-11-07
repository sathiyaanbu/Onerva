import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    pt2dp
} from './react-onerva';

import Header from './header';

var styles = require('./styles');
var colors = require('./colors');

const msgIcon = require('./imgs/new.png');
const nextIcon = require('./imgs/next.png');

export default class SelectChatScene extends Component {
    constructor(props, context) {
	super(props, context);
    }

    render() {
	let scene = this;
	let dotColors = colors.rainbowList;
	let chats = [];
	//console.log(scene.props.chats);
	if ( scene.props.chats ) {
	    let alias_to_keys = {};
	    let aliases = [];
	    Object.keys(scene.props.chats).map(function (key) { 
		    let alias = scene.props.chats[key].alias;
		    alias_to_keys[alias] = key; 
		    aliases.push(alias); 
		});
	    aliases.sort();
	    aliases.map(function (alias) {
		    chats.push(scene.props.chats[alias_to_keys[alias]]);
	    });
	}
	//if ( scene.props.chats )
	//    
	//	chats.push(scene.props.chats[key])
	//    });
	//console.log(chats);

	
	return (
	    <View style={{flexGrow: 1, flexShrink: 1, flexBasis: 0, display: 'flex', flexDirection: 'column'}}>
	    
	    <Header title={'Valitse keskustelu'} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <View style={{ margin: 0, overflowY: 'auto', flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
	    {
		chats.map(function(item, index) {
		    let initial = item.alias[0];
		    let newMsgs = false;

		    //console.log('Chat Last ' + JSON.stringify(item.lastSeen) + " " + JSON.stringify(item.lastEntry));

		    if ( (!item.lastSeen) && (!item.lastEntry) ) {
		    }
		    else if ( (!item.lastSeen) && item.lastEntry ) {
			newMsgs = true;
		    }
		    else if ( item.lastEntry && item.lastEntry.localeCompare(item.lastSeen) > 0 ) {
			newMsgs = true;
		    }
		    
		    return (
			<View key={'chatView'+index} 
			style={{ width: '100%', margin: 0, padding: 0, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}			onPress={() => { scene.props.onSelect(item)}}>
			
			<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch'}}>
			
			<View style={{opacity: 0.8, margin: pt2dp(8), marginLeft: pt2dp(10), borderRadius: pt2dp(20), height: pt2dp(40), width: pt2dp(40), backgroundColor: dotColors[index % dotColors.length], alignItems: 'center', justifyContent: 'center', display: 'flex' }} >
			<Text style={{ color: '#ffffff', fontSize: pt2dp(18)}}>
			{initial}
			</Text>
			</View>

			<Button key={'chatBtn'+index}
			style={[styles.flex110, styles.flexRow, { paddingLeft: pt2dp(20), textAlign: 'left', backgroundColor: colors.background, justifyContent: 'flex-start', alignItems: 'center' }]}
			onPress={() => { scene.props.onSelect(item)}}>
			<View>
			<Text style={{color: '#404040', fontSize: pt2dp(12) }}>
			{item.alias}
			</Text>
			</View>

			</Button>

			    <View style={{display: newMsgs ? 'flex' : 'none', alignItems: 'center', paddingRight: pt2dp(10), justifyContent: 'center' }}>
			    <Image style={{width: pt2dp(15), height: pt2dp(15) }} source={ msgIcon } />
			</View>
			<View style={{display: 'flex', alignItems: 'center', paddingRight: pt2dp(10), justifyContent: 'center' }}>
			    <Image style={{width: pt2dp(15), height: pt2dp(15) }} source={ nextIcon } />
			</View>
			
			</View>
			
			</View>
		    )
		})
	    }
	    </View>
	    
	    </View>
	)
    }
}
    
// textinput autofocus: onRef={(inputRef) => (inputRef && inputRef.focus())}
