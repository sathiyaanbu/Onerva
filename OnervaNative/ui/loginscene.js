import config from '../config';
import React, { Component, StyleSheet } from 'react';
import {
    ScrollView,
    Image,
    View,
    Text,
    TextInput,
    Button,
    mm2dp,
    pt2dp,
} from './react-onerva';

import Header from './header';

var styles = require('./styles');
var colors = require('./colors');

const tick = require('./imgs/tick.png');

export default class LoginScene extends Component {
    constructor(props, context) {
	super(props, context);
	this.state = {
	    email: props.email ? props.email : '',
	    password: props.password ? props.password : '',
	    pin: props.pin ? props.pin : '',
	    remember: true,
	};
    }

    render() {
	let scene = this;
	let title = this.props.title;

	let emailOk = scene.state.email.trim().length > 0;
	let passwordOk = scene.state.password.trim().length > 0;
	let pinOk = scene.state.pin.trim().length == 4;
	let loginOk = emailOk && passwordOk && pinOk;

	let tickSize = pt2dp(10);
	if ( config.platform == 'web' )
	    tickSize = pt2dp(12);

	let inputStyle = {
	    height: pt2dp(25),
	    width: '100%',
	    backgroundColor: colors.background,
	    fontSize: pt2dp(10),
	    fontWeight: 'normal',
	    marginTop: pt2dp(5),
	    marginBottom: pt2dp(10),
	    borderStyle: 'solid',
	    borderWidth: 0,
	    borderBottomWidth: pt2dp(.5),
	    paddingLeft: pt2dp(5),
	    paddingRight: pt2dp(5)
	};
	
	return (
	    <View style={[styles.flex100, styles.flexColumn, { backgroundColor: colors.background } ]}>
	    
	    <Header title={'Kirjautuminen'} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <ScrollView style={styles.flex110}>
	    
	    <View style={[{ margin: pt2dp(20) }]} >

	    <View style={[styles.flex110, styles.flexColumn, { alignItems: 'center'}]} >
	    <Image style={{ width: pt2dp(100), height: pt2dp(71) }} source={require('./imgs/splash.png')} />
	    </View>

	    <View style={[styles.flex110]}>
	    
	    <TextInput
	    underlineColorAndroid={'transparent'} // Android bull****
	    style={[inputStyle, { borderBottomColor: ( emailOk ? colors.turquoise : colors.orange ) }]}
	    value={scene.state.email}
	    onChangeText={(text) => {scene.setState({ email: text})}}
	    placeholder='Anna sähköpostiosoitteesi tähän'
	    />

	    <TextInput
	    underlineColorAndroid={'transparent'} // Android bull****
	    style={[inputStyle,{ borderBottomColor: ( passwordOk ? colors.turquoise : colors.orange )}]}
	    password={false}
	    value={scene.state.password}
	    onChangeText={(text) => {scene.setState({ password: text });}}
	    placeholder='Anna salasanasi tähän'
	    />

	    <TextInput
	    underlineColorAndroid={'transparent'} // Android bull****
	    style={[inputStyle, { borderBottomColor: ( pinOk ? colors.turquoise : colors.orange )}]}
	    password={true}
	    value={scene.state.pin}
	    onChangeText={(text) => {scene.setState({ pin: text });}}
	    placeholder='Anna PIN-koodisi tähän'
	    onKeyPress={(event) => {
		if ( event.charCode == 13 && loginOk )
		    scene.props.onLogin(scene.state.email, scene.state.password, scene.state.pin, scene.state.remember);
	    }}
	    />
	    
	    </View>

	    
	    <View style={[styles.flexColumn, {alignItems: 'flex-end'}]}>
	    <Button style={{ backgroundColor: 'transparent' }}
	    onPress={() => { scene.setState({ remember: ! scene.state.remember }) }} >
	    <View style={[styles.flexRow, { alignItems: 'center', paddingTop: pt2dp(5), paddingBottom: pt2dp(5) }]}>
	    <View style={{ width: pt2dp(13), height: pt2dp(13), borderRadius: pt2dp(3), backgroundColor: scene.state.remember ? colors.green2 : colors.background2, padding: pt2dp(2)  }} >
	    <Image source={tick} style={{width: tickSize, height: tickSize }}/>
	    </View>
	    <View style={{ marginLeft: pt2dp(5) }}>
	    <Text style={{ fontSize: pt2dp(10) }}>Muista tunnus</Text>
	    </View>
	    </View>
	    </Button>
	    </View>
    
	    </View>

	    </ScrollView>

	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: loginOk ? colors.turquoise : colors.background2 }}
	    onPress={() => { 
		    if (loginOk) 
			scene.props.onLogin(scene.state.email, scene.state.password, scene.state.pin, scene.state.remember)
			    }}>
	    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
	    KIRJAUDU &nbsp; &nbsp; &nbsp; &gt;
	    </Text>
	    </Button>
	    
	    </View>
	)

    }
}
    
