import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    ScrollView
} from './react-onerva';

var styles = require('./styles');
var colors = require('./colors');

export default class ChatScrollView extends Component {
    constructor(props, context) {
	super(props, context);
	this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    /**************************************************************************/
    componentDidMount() {
	//console.log(this.refs.scrollDiv);
	//console.log(this.refs.scrollDiv.offsetHeight);
	//console.log(this.refs.scrollDiv.scrollHeight);
	//this.refs.scrollDiv.scrollToEnd({animate: true});
    }

    /**************************************************************************/
    componentWillUnmount() {
    }

    /**************************************************************************/
    scrollToBottom() {
	if ( this.props.dontScroll ) return;

	this.refs.scrollDiv.scrollToEnd({animated: false});

	/*
	this.refs.scrollDiv.scrollTop = (
	    this.refs.scrollDiv.scrollHeight
	    - this.refs.scrollDiv.offsetHeight );
	*/
    }
    
    /**************************************************************************/
    render() {
	let scene = this;

	return (
		<ScrollView ref={'scrollDiv'} onContentSizeChange={(event) => this.scrollToBottom()} style={[styles.flex100,{ margin: 0, backgroundColor: colors.background2 }]}>
	    {scene.props.children}
	    </ScrollView>
	)
    }
}
