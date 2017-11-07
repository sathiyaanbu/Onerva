import React, { Component, StyleSheet } from 'react';
import {
    ScrollView,
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


export default class PinScene extends Component {
    constructor(props, context) {
	super(props, context);
	this.state = {
	    pin: ''
	};
	this.updatePIN = this.updatePIN.bind(this);
	this.renderRow = this.renderRow.bind(this);
    }

    updatePIN(num) {
	if ( num == 'C' )
	    this.setState({pin: ''});
	else if ( num == '<' ) 
	    this.setState({pin: this.state.pin.substring(0,this.state.pin.length-1)});
	else {
	    let pin = this.state.pin + num;
	    this.setState({ pin: pin });
	    if ( pin.length >= 4 )
		this.props.onPin(pin);
	}
    }
	
    renderRow(items, rowIndex) {
	let scene = this;
	return (
	    <View key={'row'+rowIndex}
	    style={[styles.flexRow, {justifyContent: 'center' }]}>
	    {
		items.map(function(item,index) {
		    return (
			<Button key={'pinBtn'+item}
			underlayColor={colors.turquoise}
			style={{ padding: 0, margin: pt2dp(5), backgroundColor: 'transparent' }}
			onPress={() => { scene.updatePIN(item) }} >	    
			<View style={{ width: pt2dp(50), height: pt2dp(50), display: 'flex', borderRadius: pt2dp(30), borderWidth: pt2dp(1.3), borderStyle: 'solid', borderColor: colors.gray, justifyContent: 'center', alignItems: 'center' }} >
			<Text style={{ fontSize: pt2dp(20) }}>
			{item}
			</Text>
			</View>
			</Button>
		    )
		})
	    }
	    </View>
	)
    }
    
    
    render() {
	let scene = this;
	let title = this.props.credentials.alias;

	let pinStr = 'Anna PIN koodisi';
	if ( scene.state.pin.length > 0 )
	    pinStr = scene.state.pin + '****'.substring(scene.state.pin.length);

	
	let rows = [
	    ['1','2','3'],
	    ['4','5','6'],
	    ['7','8','9'],
	    ['<','0','C']
	];
	if ( ! this.numpad )
	    this.numpad = (
		    <View>
		    {
			rows.map(function(item, index) {
			    return scene.renderRow(item, index);
			})
		    }
		</View>
	    )


	//console.log('PIN: ' + scene.state.pin);
	
	return (
	    <View style={[styles.flex110,styles.flexColumn]}>
	    
	    <Header title={title} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <ScrollView style={{}}>

	    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: pt2dp(30), paddingTop: pt2dp(50) }}>
	    <Text style={{ fontSize: pt2dp(18) }}>
	    {pinStr}
	    </Text>	    
	    </View>
		{ scene.numpad }
	    </ScrollView>

	    </View>
	)
    }
}
    

