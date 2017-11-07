import { config } from '../config.js';

import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    ImageInput,
    ScalableImage,
    ScrollView,
    pt2dp
} from './react-onerva';

import Header from './header';

var styles = require('./styles');
var colors = require('./colors');

const tick = require('./imgs/tick.png');

const placeholderDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAQAAACRI2S5AAAAEklEQVR42mP8/58BL2AcVQAGAHscEfhX5bYNAAAAAElFTkSuQmCC';

export default class ImageScene extends Component {
    constructor(props, context) {
	super(props, context);
	this.setImage = this.setImage.bind(this);
	this.setDataURL = this.setDataURL.bind(this);
	this.rotateImage = this.rotateImage.bind(this);
	this.state = {
	    //message: this.props.entry.message,
	    //dataURL: this.props.entry.dataURL,
	};
    }

    rotateImage() {
	var scene = this;
	if ( ! this.props.entry.dataURL ) return;
	var image = document.createElement("img");

	// fire when image is loaded
	image.onload = function() {
	    console.log("Image onload");
	    var canvas = document.createElement("canvas");
	    const ctx = canvas.getContext('2d');	    
	    var image = this;

	    // rotated values
	    var iw = image.height;
	    var ih = image.width;
	    
	    canvas.width = 640;
	    var w = canvas.width;
	    var h = ih * canvas.width / iw;
	    canvas.height = h;
	    if ( h > 640 ) {
		canvas.height = 640;
		h = canvas.height;
		w = iw * canvas.height / ih;
		canvas.width = w;
	    }
	    var xoff = (canvas.width  - w) / 2;
	    var yoff = (canvas.height - h) / 2;


	    // rotate
	    //ctx.fillRect(0, 0, canvas.width, canvas.height);
	    ctx.translate(canvas.width/2,canvas.height/2);
	    ctx.rotate(Math.PI/2);
	    ctx.drawImage(image, -h/2, -w/2);
	    
	    var dataURL = canvas.toDataURL("image/jpeg", 0.5);
	    scene.setDataURL(dataURL);
	    
	    //console.log(image);
	    //scene.setState({ image: image });
	}

	// start loading
	image.src = this.props.entry.dataURL;
    }
    
    setDataURL(dataURL) {
	//console.log("setDataURL");
	//console.log(dataURL);
	//console.log(dataURL.length);
	this.props.onUpdateEntry({ type: 'image',
				   dataURL: dataURL, });
    }
    
    setImage(file) {
	var scene = this;
	var fileReader = new FileReader();
	var image = document.createElement("img");
	/*
	if ( scene.state.image ) {
	    image = scene.state.image;
	}
	else {
	    image = document.createElement("img");
	    scene.setState({ image: image });
	}
	*/
	
	// fire when image is loaded
	image.onload = function() {
	    console.log("Image onload");
	    var canvas = document.createElement("canvas");
	    const ctx = canvas.getContext('2d');
	    var image = this;
	    
	    canvas.width = 640;
	    var w = canvas.width;
	    var h = image.height * canvas.width / image.width;
	    canvas.height = h;
	    if ( h > 640 ) {
		canvas.height = 640;
		h = canvas.height;
		w = image.width * canvas.height / image.height;
		canvas.width = w;
	    }
	    var xoff = (canvas.width  - w) / 2;
	    var yoff = (canvas.height - h) / 2;
	    ctx.drawImage(image, xoff,yoff, w,h);
	    
	    var dataURL = canvas.toDataURL("image/jpeg", 0.5);
	    scene.setDataURL(dataURL);
	    
	    //console.log(image);
	    //scene.setState({ image: image });
	}
	
	// fire when file is loaded
	fileReader.onload = function() {
	    //console.log("FileReader onload");
	    //console.log(fileReader.result);
	    //console.log(image);
	    image.src = fileReader.result;
	}
	
	// reading file
	fileReader.readAsDataURL(file);

    	//console.log(message);
	//this.setState({ message: message });
	//this.props.onUpdateEntry({ message: message });
    }

    render() {
	let scene = this;

	let highlight = this.props.entry.dataURL.length > 0;
	
	return (
	    <View style={[styles.flex110, styles.flexColumn, { backgroundColor: colors.background2 }]}>
	    
	    <Header title={scene.props.chat.alias} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <View style={[styles.flex100, styles.flexColumn, { backgroundColor: colors.background2, margin: pt2dp(5), alignItems: 'stretch', justifyContent: 'flex-start'}]} >

	    <View style={[styles.flexRow,{ justifyContent: 'space-between' }]}>

	    <Text style={{ display: 'flex', fontSize: pt2dp(10), margin: pt2dp(10), marginLeft: pt2dp(10), marginBottom: pt2dp(5) }}>KUVA</Text>
	    
	    <Button style={{ display: highlight ? 'flex' : 'none', margin: pt2dp(4), padding: pt2dp(4), backgroundColor: colors.turquoise }}
	    onPress={() => { scene.rotateImage() }}>
	    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
	    KÄÄNNÄ
	    </Text>
	    </Button>

	    </View>

		<ScrollView style={styles.flex110}>
		<View style={{ padding: '10pt' }}>
		<View style={{ width: '100%' }}>
		{/*
	    <ScalableImage style={{ width: '100%' }} source={{ uri: scene.props.entry.dataURL ? scene.props.entry.dataURL : 'data:image/gif;base64,R0lGODlhAgABAPAAAAAAAP///yH5BAUKAAAALAAAAAACAAEAAAICBAoAOw=='}} />
		 */}
	    	    <ScalableImage style={{ width: '100%' }} source={{ uri: scene.props.entry.dataURL ? scene.props.entry.dataURL : placeholderDataURL }} />
	    </View>
		</View>
	    </ScrollView>

	    <View style={[styles.flexRow,{ justifyContent: 'space-between' }]}>
	    <ImageInput key={'imageInput'} ref={'imageInput'}
	    style={[{margin: pt2dp(8), padding: pt2dp(8), fontSize: pt2dp(12), fontFamily: 'Helvetica', backgroundColor: '#ffffff'}]}
	    formStyle={{display: 'inline-block', margin: '8pt', marginLeft: '0pt', padding: '8pt'}}
	    labelStyle={{margin: '0pt', padding: '6pt', paddingTop: '8pt', backgroundColor: colors.turquoise,  fontWeight: 'bold', fontSize: '10pt', color: colors.background}}
	    onChangeFile={(file) => {
		//alert(file);
		scene.setImage(file);
	    }} />
		</View>
	    
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
