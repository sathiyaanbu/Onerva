import React, { Component, StyleSheet } from 'react';
import {
    Image,
    Audio,
    View,
    Text,
    TextInput,
    Button,
    ScalableImage,
    pt2dp,
} from './react-onerva';

var styles = require('./styles');
var colors = require('./colors');

const moodIcon = [ require('./imgs/mood0.png'),
		   require('./imgs/mood1.png'),
		   require('./imgs/mood2.png'),
		   require('./imgs/mood3.png'),
		   require('./imgs/mood4.png'),
		   require('./imgs/mood5.png') ];

const abilityIcon = [ require('./imgs/ability0.png'),
		      require('./imgs/ability1.png'),
		      require('./imgs/ability2.png'),
		      require('./imgs/ability3.png'),
		      require('./imgs/ability4.png'),
		      require('./imgs/ability5.png') ];


export default class EntryView extends Component {
    constructor(props, context) {
	super(props, context);

	this.createGradesBox.bind(this)
	this.createActionsBox.bind(this)
	this.createMessageBox.bind(this)
	this.createImageBox.bind(this)
	this.createAudioBox.bind(this)
    }

    /**************************************************************************/
    render() {
	let props = this.props;

	let actions = props.entry.actions;
	let message = props.entry.message;

	if ( props.entry.type == "description" ) 
	    actions = ['Uusi kuvaus'];

	let image = null;
	if ( props.entry.type == "image" && props.entry.dataURL && props.entry.dataURL.indexOf('data:image') >= 0 ) {
	    image = props.entry.dataURL;
	}
	if ( props.entry.type == "image" && props.entry.message.indexOf('data:image') >= 0 && props.entry.message.indexOf(';base64,') > 0 ) {
	    image = props.entry.message;
	    message = '';
	}

	let audio = null;
	if ( props.entry.type == "audio" && props.entry.dataURL && props.entry.dataURL.indexOf('data:audio') >= 0 ) {
	    audio = props.entry.dataURL;
	}
	if ( props.entry.type == "audio" && props.entry.message.indexOf('data:audio') >= 0 && props.entry.message.indexOf(';base64,') > 0 ) {
	    audio = props.entry.message;
	    message = '';
	}
	
	return (
	    <View style={[styles.flex100, styles.flexColumn, { margin: pt2dp(5), marginRight: pt2dp(7), marginLeft: pt2dp(7) }]}> 

	    { /* 2 icons, actions, and message */ }
	    <View style={[styles.flexRow, { marginTop: pt2dp(5), minHeight: '1%' }]}>
	    
	    { /* 3 icons */ }
	    {this.createGradesBox(props.entry.mood, props.entry.ability)}
	    
	    { /* 3 actions and message */ }
	    <View style={[styles.flex110,styles.flexColumn, { margin: pt2dp(7), marginLeft: 0 }]}>
	    {this.createActionsBox(actions)}
	    {this.createImageBox(image)}
	    {this.createAudioBox(audio)}
	    {this.createMessageBox(message) }
	    </View>
	    
	    </View>
	    
	    { /* 2 user and timestamp */ }
	    <View style={{ margin: 0, marginBottom: 0, display: 'flex', flexDirection: 'row'}}>

	    <Text style={{ fontSize: pt2dp(9), color: colors.gray }}>{props.entry.user.alias}</Text>
	    
	    <View  style={styles.flex110} />

	    <Text style={{ fontSize: pt2dp(9), color: colors.gray }}>
	    { props.entry.timestamp.substring(0, props.entry.timestamp.length-3) }
	    </Text>
	    
	    </View>

	    </View>
	)
    }
    
    /**************************************************************************/
    createGradesBox(mood, ability) {
	mood = mood ? mood : 0;
	ability = ability ? ability : 0;
	
	if ( mood == 0 && ability == 0 )
	    return ( <View /> )
	
	let gradeStyle = { width: pt2dp(20), height: pt2dp(20), marginRight: pt2dp(10), marginBottom: pt2dp(2) };
	
	return (
	    <View>
	    <Image style={gradeStyle} source={moodIcon[mood]} />
	    <View style={{ height: pt2dp(1) }} />
	    <Image style={gradeStyle} source={abilityIcon[ability]} />
	    </View>
	)
    }

    /**************************************************************************/
    createActionsBox(actionsList) {
	let actions = '';
	actionsList = actionsList ? actionsList : [];
	
	actionsList.map(function(item,index) {
	    actions += ', ' + item;
	});
	actions = actions.substring(2);
	
	if ( actions.length > 0 )
	    return (
		    <View style={{ paddingBottom: pt2dp(3), borderWidth: 0, borderBottomWidth: pt2dp(1), borderStyle: 'solid', borderBottomColor: '#f0f0f0' }}>
		<Text style={{ fontSize: pt2dp(12), fontWeight: 'bold', color: colors.darkGray}}>{actions}</Text>
		</View>
	    )
	return ( <View /> )
    }

    /**************************************************************************/
    createMessageBox(message) {
	message = message ? message : '';
	if ( message.trim().length > 0 )
	    return (
		<View style={{ width: '100%', paddingTop: pt2dp(5) }}>
		    <Text style={{ fontSize: pt2dp(12), color: colors.darkGray,     whiteSpace: 'pre-wrap', lineHeight: pt2dp(12*1.3)}}>{message}</Text>
		</View>
	    )
	return ( <View /> )
    }
    /**************************************************************************/
    createImageBox(data) {
	data = data ? data : '';
	if ( data.trim().length > 0 ) {
	    // data = 'data:image/jpg;base64,' + data
	    // console.log('ImageBox ' + data.substring(0,30));
	    return (
		<View style={{ width: '100%', paddingTop: pt2dp(5), minHeight: '1%' }}>
		<ScalableImage style={{ width: '100%' }} source={{ uri: data }} />
		</View>
	    )
	}
	return ( <View /> )
    }
    /**************************************************************************/
    createAudioBox(data) {
	data = data ? data : '';
	if ( data.trim().length > 0 ) {
	    // data = 'data:image/jpg;base64,' + data
	    return (
		<View style={{ width: '100%', paddingTop: pt2dp(5) }}>
		<Audio style={{ width: '100%' }} source={data} />
		</View>
	    )
	}
	return ( <View /> )
    }
}
