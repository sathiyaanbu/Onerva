import config from '../config';
import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    mm2dp,
} from './react-onerva';

const loadingIcon = require('./imgs/loading.png');

export default class SplashScreen extends Component {
    constructor(props, context) {
	super(props, context);
	this.state = { rotation: -10 };
	this.updateRotation = this.updateRotation.bind(this);
    }

    componentDidMount() {
	this.interval = setInterval(this.updateRotation, 1000/60)
    }
    componentWillUnmount() {
	clearInterval(this.interval);
    }

    updateRotation() {
	this.setState({ rotation: this.state.rotation + 3 });
    }
    
    render() {
	let scene = this;

	let transform = [{rotate: scene.state.rotation+'deg'}];
	if ( config.platform == 'web' )
	    transform = ['rotate('+scene.state.rotation+'deg)'];
	
	return (
	    <View style={{ opacity: 1.0, position: 'relative', width: '70%', height: '100%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
	    <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }} >
	    <Image style={{ width: mm2dp(70), height: mm2dp(50) }} source={require('./imgs/splash.png')} />
	    </View>
	    <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }} >
	    <Image style={{ width: mm2dp(10), height: mm2dp(10), opacity: 0.5, transform: transform }} source={loadingIcon} />
	    </View>
	    </View>
	);
    }
}
