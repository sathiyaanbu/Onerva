import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    pt2dp,
} from './react-onerva';


var styles = require('./styles');
var colors = require('./colors');

import EntryView from './entryview';

export default class SpeechBubble extends Component {
    constructor(props, context) {
	super(props, context);
    }

    
    /**************************************************************************/
    render() {
	let props = this.props;

	let myMsg = props.entry.user.alias == props.user.alias;

	let leftTriStyle = {
	    border: 0,
	    marginTop: pt2dp(-5.5),
	    width: 0,
	    height: 0,
	    backgroundColor: 'transparent',
	    marginLeft:  pt2dp(5),
	    marginBottom: pt2dp(5),
	    borderStyle: 'solid',
	    borderRightWidth: pt2dp(6),
	    borderTopWidth: pt2dp(5),
	    borderRightColor: 'transparent',
	    borderTopColor: myMsg ? colors.turquoise : colors.green
	};
	let rightTriStyle = {
	    border: 0,
	    marginTop: pt2dp(-5.5),
	    width: 0,
	    height: 0,
	    backgroundColor: 'transparent',
	    marginRight:  pt2dp(5),
	    marginBottom: pt2dp(5),
	    borderStyle: 'solid',
	    borderLeftWidth: pt2dp(6),
	    borderTopWidth: pt2dp(5),
	    borderLeftColor: 'transparent',
	    borderTopColor:  myMsg ? colors.turquoise : colors.green
	};
	    
	return (
	    <View key={'bubble'+props.entry.timestamp} style={[styles.flex100, {width: '100%', backgroundColor: 'transparent' }]} >

	    <View style={[styles.flex110,{backgroundColor: colors.background, margin: pt2dp(5), borderRadius: pt2dp(3), marginLeft: myMsg ? pt2dp(20) : pt2dp(5), marginRight: myMsg ? pt2dp(5) : pt2dp(20), display: 'flex', flexDirection: 'row', borderBottomLeftRadius: myMsg ? pt2dp(3): 0, borderBottomRightRadius: myMsg ? 0 : pt2dp(3), borderBottomWidth: 0 }]}>
	    
	    <View style={{opacity: myMsg ? 1 : 1, width: myMsg ? pt2dp(3) : pt2dp(5), backgroundColor: myMsg ? colors.turquoise : colors.green, borderBottomLeftRadius: myMsg ? pt2dp(3) : .5, borderTopLeftRadius: pt2dp(3) }} />

	    <EntryView entry={props.entry} />

	    
	    <View style={{opacity: myMsg ? 1 : 1, width: myMsg ? pt2dp(5) : pt2dp(3), backgroundColor: myMsg ? colors.turquoise : colors.green, borderBottomRightRadius: myMsg ? .5 : pt2dp(3), borderTopRightRadius: pt2dp(3) }} />
	    
	    </View>
	    
	    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: myMsg ? 'flex-end' : 'flex-start' }}>
	    <View style={myMsg ? rightTriStyle : leftTriStyle} />
	    </View>
	    
	    </View>
	)
    }
}
