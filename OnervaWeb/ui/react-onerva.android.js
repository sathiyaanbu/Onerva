import React, { Component, Linking } from 'react';

import { View, ScrollView, Text, Image, TextInput, TouchableHighlight, AsyncStorage } from 'react-native';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
//import KeyboardSpacer from 'react-native-keyboard-spacer';


export { View, ScrollView, Text, Image, TextInput, TouchableHighlight as Button, AsyncStorage };


/******************************************************************************/
export function mm2dp(mm) {
    return mm / (25.4/100);
}
export function pt2dp(pt) {
    return pt / (72.0/100);
}

/*****************************************************************************/
export class KeyboardSpacer extends Component {
    constructor(props, context) {
	super(props, context);
    }
    render() { return ( <View /> ) }
}
/******************************************************************************/
export class Link extends Component {
    render() {
	let parent = this;
	let style = this.props.style;
	let href = this.props.href;
	return ( <Text style={style} 
		 onPress={function() { Linking.openURL(href) }} >
		 { this.props.children }
		 </Text> )
    }
}
/******************************************************************************/
export class ImageInput extends Component {
    render() {
	let parent = this;
	let style = this.props.style;
	return ( <View>
		 <Text>VALITSE KUVA...</Text>
		 </View> )
    }
}

/******************************************************************************/
export class ScalableImage extends Component {
    constructor(props) {
	super(props);
	//this.setImageSize = this.setImageSize.bind(this);
	this.setViewSize = this.setViewSize.bind(this);
	this.setRatio = this.setRatio.bind(this);
	this.state = { width: 0,
		       height: 0,
		     };
    }

    componentWillUnmount() {
	this.setRatio = function() {};
    }
    
    setViewSize(event) {
	let component = this;
	let vw = event.nativeEvent.layout.width;
	let vh = event.nativeEvent.layout.height;
	console.log("ScalableImage View = " + vw + " x " + vh);
	let source = this.props.source;
	if ( source.uri ) {
	    Image.getSize(source.uri, function(iw,ih) {
		//console.log("ScalableImage View = " + vw + " x " + vh + "    " + iw + " x " + ih);
	    component.setRatio(vw,vh,iw,ih);
	    }, console.log);
	}
	else {
	    let img = resolveAssetSource(source);
	    //console.log(img);
	    let iw = img.width;
	    let ih = img.height;
	    //console.log("ScalableImage View (asset) = " + vw + " x " + vh + "    " + iw + " x " + ih);
	    component.setRatio(vw,vh,iw,ih);
	}
    }
    /*
    setViewSize(event) {
	let component = this;
	let vw = event.nativeEvent.layout.width;
	let vh = event.nativeEvent.layout.height;
	console.log("ScalableImage View = " + vw + " x " + vh);
	Image.getSize(this.props.source.uri, function(iw,ih) {
	    console.log("ScalableImage View = " + vw + " x " + vh + "    " + iw + " x " + ih);
	    component.setRatio(vw,vh,iw,ih);
	}, console.log);
    }
    */
    
    setRatio(vw,vh,iw,ih) {
	if ( iw <= 0 || iw <= 0 ) return;
	if ( vw <= 0 && vh <= 0  ) return;

	if ( vw > 0 ) {
	    let imageRatio = (1.0 * iw) / ih;
	    this.setState({ width: vw, height: vw / imageRatio });
	    //console.log("ScalableImage " + imageRatio);
	}
    }
    
    render() {
	return ( <View style={{ width: '100%', flex: 1 }} onLayout={(event) => this.setViewSize(event)} >
		 <Image source={this.props.source} style={{width: this.state.width, height: this.state.height}} />
	       </View>);
    }
}


/******************************************************************************/
export class Audio extends Component {
    render() {
	let parent = this;
	let style = this.props.style;
	return ( <View>
		 <Text>(Ääniviesti)</Text>
		 </View> )
    }
}
