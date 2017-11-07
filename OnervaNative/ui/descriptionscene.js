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


export default class GradesScene extends Component {
    constructor(props, context) {
	super(props, context);
    }

    
    render() {
	let scene = this;

	let highlight = true;

	// breaks back
	//if ( ! scene.props.chat.description )
	//    scene.props.onNext(scene.props.nextScene);

	return (
		<View style={[styles.flex110,{display: 'flex', flexDirection: 'column', backgroundColor: colors.background2 }]}>
	    
	    <Header title={scene.props.chat.alias} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <View style={[styles.flex110, styles.flexColumn, { margin: 0, overflowY: 'auto', backgroundColor: colors.background2 }]}>

	    <View style={[styles.flex110, styles.flexColumn, { margin: pt2dp(5),  alignItems: 'stretch', justifyContent: 'flex-start'}]} >

	    <Text style={{ fontSize: pt2dp(10), margin: pt2dp(10), marginLeft: pt2dp(10), marginBottom: pt2dp(5) }}>KUVAUS</Text>

	    <TextInput key={'messageInput'} ref={'messageInput'} multiline={true}
	    style={[styles.flex110, {margin: pt2dp(5), padding: pt2dp(10), maxHeight: pt2dp(250), fontSize: pt2dp(12), fontFamily: 'Helvetica', backgroundColor: '#ffffff',
				    						       	textAlignVertical: 'top' }]} // Android bull****
	    onChangeText={(text) => {}}
	    value={scene.props.chat.description ? scene.props.chat.description.message : 'Ei kuvausta'} />
		    
	    </View>

	    </View>

	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: highlight ? colors.turquoise : colors.gray }}
	    onPress={() => { scene.props.onNext(scene.props.nextScene) }}>
		<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
		       PALAA
	    </Text>
	    </Button>
	    
	    </View>
	)
    }
}
