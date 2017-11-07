import config from '../config';
import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    Button,
    mm2dp,
    pt2dp,
} from './react-onerva';

var styles = require('./styles');
var colors = require('./colors');

const backIcon = require('./imgs/back.png');
const logoutIcon = require('./imgs/logout.png');

export default class Header extends Component {
    constructor(props, context) {
	super(props, context);
    }

    render() {
	let scene = this;
	let title = this.props.title;
	let hasBack = this.props.onBack != null;
	let hasLock = this.props.onLock != null;

	return (
	    <View style={{ display: 'flex', flexDirection: 'column' }}>
		<View style={{ height: config.platform == 'ios' ? pt2dp(14) : pt2dp(12), width: '100%', backgroundColor: colors.green2, }} />

	    <View style={{ height: pt2dp(40), backgroundColor: colors.green, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
	    
	    <Button
	    style={{ opacity: hasBack ? 1.0 : 0.0, width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green }}
	    underlayColor={colors.green2}
	    onPress={() => { console.log('back');
			     if ( hasBack)
				 scene.props.onBack(scene.props.backScene); }}
	    >
	    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
	    <Image source={backIcon} style={{ marginTop: pt2dp(5), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>PALAA</Text>
	    </View>
	    </Button>

	    <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, color: colors.background, marginTop: 0, marginLeft: pt2dp(5) }}>
	    <Text style={{ color: colors.background, fontWeight: 'normal', fontSize: pt2dp(18) }}>{this.props.title}</Text>
	    </View>

	    <Button
	    style={{ opacity: hasLock ? 1.0 : 0.0, width: pt2dp(40), height: pt2dp(40), backgroundColor: colors.green }}
	    underlayColor={colors.green2}
	    onPress={() => { console.log('lock');
			     if ( hasLock )
				 scene.props.onLock(); }}
	    >
	    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
	    <Image source={logoutIcon} style={{ marginTop: pt2dp(5), width: pt2dp(18), height: pt2dp(18) }}/>
	    <Text style={{ height: pt2dp(10), color: colors.background, fontWeight: 'bold', fontSize: pt2dp(7) }}>POISTU</Text>
	    </View>
	    </Button>

	    </View>
	    
	    </View>
	)

    }
}
    
