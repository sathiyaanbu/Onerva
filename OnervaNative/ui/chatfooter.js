import config from '../config';
import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    Button,
    TextInput,
    pt2dp,
} from './react-onerva';

var styles = require('./styles');
var colors = require('./colors');

const msgIcon = require('./imgs/message.png');
const moreIcon = require('./imgs/plus.png');
const lessIcon = require('./imgs/cross.png');
const entryIcon = require('./imgs/visit.png');
const cardIcon = require('./imgs/card.png');
const shopIcon = require('./imgs/shop.png');
const cameraIcon = require('./imgs/camera.png');
const microphoneIcon = require('./imgs/microphone.png');


export default class ChatFooter extends Component {
    constructor(props, context) {
	super(props, context);
	this.state = { showMore: false };
    }

    render() {
	let scene = this;
	//let readyToSend = scene.state.message.length > 0;
	let readyToSend = scene.props.entry.message.length > 0;
	let boxHeight = pt2dp(30 + (scene.props.entry.message.length > 30 ? 30 : 0) + (scene.props.entry.message.length > 120 ? 30 : 0))

	let hasDescription = ( scene.props.chat && scene.props.chat.description ) ? true : false;
        let hasImageScene = ( config.platform == 'web' );
	
	return (
	    <View style={{marginTop: 0, backgroundColor: colors.background, display: 'flex', flexDirection: 'column', borderWidth: 0, borderTopWidth: 1, borderStyle: 'solid', borderTopColor: '#e0e0e0' }}>

	    <View style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>
		
	    <TextInput key={'messageInput'} ref={'messageInput'}
	    underlineColorAndroid={'transparent'} // Android bull****
	    multiline={true}
	    style={[styles.flex110, { margin: 0, padding: pt2dp(5), height: boxHeight, fontSize: pt2dp(12), fontFamily: 'Helvetica', backgroundColor: '#ffffff',
				      textAlignVertical: 'bottom' }]} // Android bull****
	    onChangeText={(text) => {
		//console.log(text);
		let entry = scene.props.entry;
		entry.type    = 'message';
		entry.message = text;
		scene.props.onUpdateEntry(entry);
		//scene.setState({message: text});
	    }}
	    value={scene.props.entry.message} placeholder="Kirjoita viesti..." />

	    <View style={{ display: 'flex', flexDirection: 'row' }}>

	    <Button
	    style={{opacity: readyToSend ? 1.0 : 0.5, width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.background, alignSelf: 'flex-end' }}
	    underlayColor={colors.background2}
	    disabled={readyToSend ? false: true}
	    onPress={() => {
		//console.log('send');
		let entry = scene.props.entry;
		//entry.message = scene.state.message;
		//scene.props.onUpdateEntry(entry);
		scene.props.onSendEntry(entry);
		//scene.setState({ message: '' });
		scene.refs.messageInput.blur();
	    }}
	    >
	    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
	    <Image source={msgIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.darkGray, fontWeight: 'bold', fontSize: pt2dp(7) }}>
	    LÄHETÄ
	    </Text>
	    </View>
	    </Button>


	    <Button
	    style={{width: pt2dp(40), height: pt2dp(40), backgroundColor: scene.state.showMore ? colors.green2 : colors.background, opacity: scene.state.showMore ? 1.0 : 1.0, alignSelf: 'flex-end'}}
	    underlayColor={colors.background2}
	    onPress={() => {
		scene.setState({showMore: ! scene.state.showMore});
	    }}
	    >
	    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
		<Image source={scene.state.showMore ? lessIcon : moreIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
		<Text style={{ height: pt2dp(10), display: scene.state.showMore ? 'flex' : 'none', color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>SULJE</Text>
		<Text style={{ height: pt2dp(10), display: ! scene.state.showMore ? 'flex' : 'none', color: colors.darkGray, fontWeight: 'bold', fontSize: pt2dp(7) }}>LISÄÄ</Text>
	    </View>
	    </Button>

	    
	    </View>

	    </View>


	    <View style={{ display: scene.state.showMore ? 'flex' : 'none', flexDirection: 'row', margin: 0, justifyContent: 'flex-end', backgroundColor: colors.green }}>

	    
	    <Button
	    disabled={!hasDescription}
	    style={{width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green, alignSelf: 'flex-end'}}
	    underlayColor={colors.green2}
	    onPress={() => {
		scene.props.onShowDescription();
	    }}
	    >
	    <View style={[{opacity: hasDescription ? 1.0 : 0.5},{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
	    <Image source={cardIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>KUVAUS</Text>
	    </View>
	    </Button>

	    
	    <View style={{display: 'flex', flex: 1}} />


	    <Button
	    disabled={true}
	    style={[{opacity: 0.3}, {width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green, alignSelf: 'flex-end'}]}
	    underlayColor={colors.green2}
	    onPress={() => {
		//console.log('new-entry');
		//scene.props.onNewEntry();
	    }}
	    >
	    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
	    <Image source={shopIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>PALVELUT</Text>
	    </View>
	    </Button>


	    	<View style={{display: 'flex', flex: 1}} />


	    <Button
	    disabled={false}
	    style={[{opacity: 0.3}, {width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green, alignSelf: 'flex-end'}]}
	    underlayColor={colors.green2}
	    onPress={() => {
		//console.log('new-entry');
		//scene.props.onNewEntry();
	    }}
	    >
	    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
	    <Image source={microphoneIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>ÄÄNI</Text>
	    </View>
	    </Button>


	    	<View style={{display: 'flex', flex: 1}} />

	    
	    <Button
	    disabled={hasImageScene ? false : true}
	    style={{width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green, alignSelf: 'flex-end'}}
	    underlayColor={colors.green2}
	    onPress={() => {
		//console.log('new-entry');
		scene.props.onNewImage();
	    }}
	    >
	    <View style={{opacity: hasImageScene ? 1.0 : 0.3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
	    <Image source={cameraIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>KUVA</Text>
	    </View>
	    </Button>


	    	<View style={{display: 'flex', flex: 1}} />
		
	    	    
	    <Button
	    style={{width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green, alignSelf: 'flex-end'}}
	    underlayColor={colors.green2}
	    onPress={() => {
		//console.log('new-entry');
		scene.props.onNewEntry();
	    }}
	    >
	    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
	    <Image source={entryIcon} style={{marginTop: pt2dp(6), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>KÄYNTI</Text>
	    </View>
	    </Button>

	    </View>
	    
	    </View>

	)
    }
}
    
