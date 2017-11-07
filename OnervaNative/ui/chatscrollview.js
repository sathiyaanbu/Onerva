import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
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
	this.scrollToBottom();
    }

    /**************************************************************************/
    componentWillUnmount() {
    }

    /**************************************************************************/
    scrollToBottom() {
	this.refs.scrollDiv.scrollTop = (
	    this.refs.scrollDiv.scrollHeight
	    - this.refs.scrollDiv.offsetHeight );
    }
    
    /**************************************************************************/
    render() {
	let scene = this;

	return (
	    <div ref={'scrollDiv'} style={{ margin: 0, overflowY: 'auto', flex: 1, backgroundColor: colors.background2 }}>
	    {scene.props.children}
	    </div>
	)
    }
}
