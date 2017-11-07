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

var styles = require('./styles');
var colors = require('./colors');

const tick = require('./imgs/tick.png');

export default class MessageScene extends Component {
    constructor(props, context) {
	super(props, context);
	this.setMessage = this.setMessage.bind(this);
	this.state = { message: this.props.entry.message };
    }

    setMessage(message) {
    	//console.log(message);
	this.setState({ message: message });
	this.props.onUpdateEntry({ message: message });
    }

    
    render() {
	let scene = this;

	let highlight = this.props.entry.message.length > 0;
	
	return (
	    <View style={[styles.flex110, styles.flexColumn, { backgroundColor: colors.background2 }]}>
	    
	    <Header title={scene.props.chat.alias} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <View style={[styles.flex100, styles.flexColumn, { backgroundColor: colors.background2, margin: pt2dp(5), alignItems: 'stretch', justifyContent: 'flex-start'}]} >

	    <Text style={{ display: 'flex', fontSize: pt2dp(10), margin: pt2dp(10), marginLeft: pt2dp(10), marginBottom: pt2dp(5) }}>VIESTI</Text>

	    <TextInput key={'messageInput'} ref={'messageInput'} multiline={true}
	    style={[styles.flex110, styles.flexColumn, {margin: pt2dp(5), padding: pt2dp(10), maxHeight: pt2dp(150), fontSize: pt2dp(12), fontFamily: 'Helvetica', backgroundColor: '#ffffff',
						       	textAlignVertical: 'top' }]} // Android bull****
	    onChangeText={(text) => {
		scene.setMessage(text);
	    }}
	    value={scene.state.message} placeholder="Kirjoita viesti..." />
	    
	    </View>

	    
	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: highlight ? colors.turquoise : colors.gray }}
	    onPress={() => { scene.props.onNext(scene.props.nextScene)}}>
	    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
	    LÄHETÄ &nbsp; &nbsp; &nbsp; &gt;
	    </Text>
	    </Button>
	    
	    </View>
	)
    }
}
