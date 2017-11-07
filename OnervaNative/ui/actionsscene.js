import config from '../config';
import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    pt2dp
} from './react-onerva';

import Header from './header';

var styles = require('./styles');
var colors = require('./colors');

const tick = require('./imgs/tick.png');

export default class ActionsScene extends Component {
    constructor(props, context) {
	super(props, context);
	this.toggleAction = this.toggleAction.bind(this);
    }

    toggleAction(action) {
    	//console.log(action);
	let actions = this.props.entry.actions;
	if ( ! actions )
	    actions = [];
	
	let index = actions.indexOf(action);
	if ( index >= 0 )
	    actions.splice(index,1);
	else
	    actions.push(action);
	this.props.onUpdateEntry({ type: 'visit', actions: actions });
    }

    
    render() {
	let scene = this;

	let actions = this.props.entry.actions;
	if ( ! actions )
	    actions = [];

	
	let highlight = false;
	if ( actions.length > 0 )
	    highlight = true;

	let tickSize = pt2dp(8);
	if ( config.platform == 'web' )
	    tickSize = pt2dp(12);

	
	return (
	    <View style={[styles.flex110,styles.flexColumn,{ backgroundColor: colors.background2 }]}>
	    
	    <Header title={scene.props.chat.alias} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <View style={[styles.flex110, styles.flexRow, { margin: 0, backgroundColor: colors.background2 }]}>

	    <View style={[styles.flex110,styles.flexColumn, { margin: pt2dp(5), alignItems: 'stretch', justifyContent: 'flex-start' }]} >

	    <Text style={{ display: 'flex', fontSize: pt2dp(10), margin: pt2dp(10), marginBottom: pt2dp(5) }}>HOITOTOIMET</Text>

	    <ScrollView style={[styles.flex110]}>
	    {
		scene.props.chat.actions.map(function(item,index) {
		    let selected = actions.indexOf(item) >= 0;
		    return (
			<Button key={'actionBtn'+item}
			style={[{display: 'flex', flexDirection: 'row', borderRadius: pt2dp(3), backgroundColor: colors.background2, margin: pt2dp(3), padding: 0, alignItems: 'stretch', justifyContent: 'flex-start', maxHeight: pt2dp(40) }]}
			underlayColor={colors.gray}
			onPress={() => { scene.toggleAction(item) }}
			>

			<View style={[styles.flexRow, { justifyContent: 'flex-start', alignItems: 'center', padding: 0, margin: 0, borderRadius: pt2dp(3), height: '100%' }]}>
			
			<View style={[{ marginLeft: pt2dp(10), width: pt2dp(13), height: pt2dp(13), borderRadius: pt2dp(3), backgroundColor: selected ? colors.green2 : colors.background, borderWidth: pt2dp(1), borderStyle: 'solid', borderColor: selected ? colors.green2 : '#d0d0d0', padding: pt2dp(2) }]} >
			<Image source={tick} style={{width: tickSize, height: tickSize }}/>
			</View>
			
			<View style={[{alignItems: 'center', paddingLeft: pt2dp(15), paddingTop: pt2dp(10), paddingBottom: pt2dp(10) }]}>
			<Text style={{fontSize: pt2dp(12), color: colors.darkGray}}>{item}</Text>
			</View>
			</View>
			</Button>
		    )
		})
	    }
	    </ScrollView>
	    
	    </View>

	    </View>
	    
	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: highlight ? colors.turquoise : colors.gray }}
	    onPress={() => { scene.props.onNext(scene.props.nextScene)}}>
	    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
	    SEURAAVA &nbsp; &nbsp; &nbsp; &gt;
	    </Text>
	    </Button>
	    
	    </View>
	)
    }
}
