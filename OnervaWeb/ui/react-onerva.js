import config from '../config';

// only for web
if ( config.platform == 'web' ) {
   require('es6-promise').polyfill();
   require('es6-object-assign').polyfill();
}

import React, { Component } from 'react';


/*****************************************************************************/
export function mm2dp(mm) {
    return mm + 'mm';
    //return mm / (25.4/160);
}
export function pt2dp(pt) {
    return pt + 'pt';
}

/*****************************************************************************/
export class AsyncStorage {
    static getItem(id) {
	return Promise.resolve(localStorage.getItem(id));
    }
    static setItem(id,value) {
	return Promise.resolve(localStorage.setItem(id,value));
    }
}

/*****************************************************************************/
export class View extends Component {
    constructor(props, context) {
	super(props, context);
    }
    
    render() {
	let parent = this;
	let userStyle = this.props.style;
	//console.log(JSON.stringify(userStyle));
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	return (
	    <div
	    style={userStyle}
	    >
	    {this.props.children}
	    </div> );
    }
};

/*****************************************************************************/
export class ScrollView extends Component {
    constructor(props, context) {
	super(props, context);
    }
    
    render() {
	let parent = this;

	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, {margin: 0, overflowY: 'auto'}, ...userStyle);
	else
	    userStyle = Object.assign({}, {margin: 0, overflowY: 'auto'}, userStyle);
	    
	return (
	    <div
	    style={userStyle}
	    >
	    {this.props.children}
	    </div> );
    }
};


/*****************************************************************************/
export class Image extends Component {
    render() {
	let parent = this;
	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	return (
	    <img
	    style={userStyle}
	    src={this.props.source} /> );
    }
};

/*****************************************************************************/
export class ScalableImage extends Component {
    render() {
	let parent = this;
	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	if ( this.props.source.uri ) {
	    return (
		    <img
		style={userStyle}
		src={this.props.source.uri} /> );
	}
	else {
	    return (
		    <img
		style={userStyle}
		src={this.props.source.uri} /> );
	}
    }
};

/*****************************************************************************/
export class Audio extends Component {
    render() {
	let parent = this;
	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	return (
	    <audio controls
	    style={userStyle}
	    src={this.props.source} /> );
    }
};


/*****************************************************************************/
export class Text extends Component {
    render() {
	let parent = this;
	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	return (
	    <span
	    style={userStyle}
	    >
	    {this.props.children}
	    </span> );
    }
};

/*****************************************************************************/
export class Link extends Component {
    render() {
	let parent = this;

	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	let href = this.props.href;

	return (
	    <a
	    style={userStyle}
	    href={href}
	    >
	    {this.props.children}
	    </a> );
    }
};

/*****************************************************************************/
export class TextInput extends Component {
    constructor(props, context) {
	super(props, context);
	this.blur = this.blur.bind(this);
    }
    
    blur() {
	console.log('blur');
	if ( this.refs.htmlElem ) {
	    this.refs.htmlElem.blur();
	    console.log('blurred');
	}
    }

    render() {
	let parent = this;

	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);

	let defaultStyle = {
	    border: '0px',
	};

	let finalStyle = Object.assign({},defaultStyle,userStyle);


	if ( this.props.password ) {
	    return (
		/*<input type="password"*/
		<input
		autoCorrect='off'
		ref={'htmlElem'}
		style={finalStyle}
		value={parent.props.value}
		onChange={(event) => {parent.props.onChangeText(event.target.value)}}
		onKeyPress={(event) => {
		    if ( parent.props.onKeyPress )
			parent.props.onKeyPress(event);
		}}
		placeholder={parent.props.placeholder ? parent.props.placeholder : ''}
		/> );	    
	}
	else if ( ! this.props.multiline )
	    return (
		<input type="text"
		ref={'htmlElem'}
		style={finalStyle}
		value={parent.props.value}
		onChange={(event) => {parent.props.onChangeText(event.target.value)}}
		onKeyPress={(event) => {
		    if ( parent.props.onKeyPress )
			parent.props.onKeyPress(event);
		}}
		placeholder={parent.props.placeholder ? parent.props.placeholder : ''}
		/> );
	else
	    return (
		<textarea
		ref={'htmlElem'}
		style={finalStyle}
		value={parent.props.value}
		onChange={(event) => {parent.props.onChangeText(event.target.value)}}
		placeholder={parent.props.placeholder ? parent.props.placeholder : ''}
		/> );	    
    }
};

/*****************************************************************************/
export class Button extends Component {
    constructor(props, context) {
	super(props, context);
	this.state = {
	    pressed: false
	};
	this.focus = this.focus.bind(this);
    }

    focus() {
	if ( this.refs.htmlElem )
	    this.refs.htmlElem.focus();
    }
    
    render() {
	let parent = this;
	
	let userStyle = this.props.style;
	if ( Array.isArray(userStyle) )
	    userStyle = Object.assign({}, ...userStyle);
	
	let defaultStyle = {
	    border: '0',
	};

	let upStyle = Object.assign({},defaultStyle,userStyle);

	let downStyle = Object.assign({},defaultStyle, userStyle, {backgroundColor: this.props.underlayColor});

	return (
	    <button
	    ref={'htmlElem'}
	    disabled={parent.props.disabled}
	    style={parent.state.pressed ? downStyle : upStyle}
	    onMouseDown={() => {
		if ( parent.props.onPress )
		    parent.props.onPress();
		parent.setState({ pressed: true  });
		//console.log('press down');
	    } }
	    onMouseUp={() => {
		if ( parent.state.pressed && parent.props.onClick )
		    parent.props.onClick();
		parent.setState({ pressed: false });
		//console.log('press up');
	    } }
	    onMouseLeave={() => {
		parent.setState({ pressed: false });
		//console.log('mouse lost');
	    } }
	    >
	    {this.props.children}
	    </button>
	);
	
    }
};



/*****************************************************************************/
export class ImageInput extends Component {
    constructor(props, context) {
	super(props, context);
	this.blur = this.blur.bind(this);
    }
    
    blur() {
	console.log('blur');
	if ( this.refs.htmlElem ) {
	    this.refs.htmlElem.blur();
	    console.log('blurred');
	}
    }

    render() {
	let parent = this;

	let userStyleForm = this.props.formStyle;
	if ( Array.isArray(userStyleForm) )
	    userStyleForm = Object.assign({}, ...userStyleForm);
	let userStyleLabel = this.props.labelStyle;
	if ( Array.isArray(userStyleLabel) )
	    userStyleLabel = Object.assign({}, ...userStyleLabel);

	let defaultStyle = {
	    border: '0px',
	};

	let formStyle  = Object.assign({},defaultStyle,userStyleForm);
	let labelStyle = Object.assign({},defaultStyle,userStyleLabel);

	return (
		<form style={formStyle}>
		<label style={labelStyle}>VALITSE KUVA . . .
		<input type="file"
	    id="file_upload"
	    name="file_upload"
	    accept="image/*"
	    ref={'htmlElem'}
	    style={{display: 'none'}}
	    onChange={(event) => {
		if ( event.target.files )
		    parent.props.onChangeFile(event.target.files[0]);
	    }}
		/>
		</label>
		</form>
	);
    }
};

/*****************************************************************************/
export class KeyboardSpacer extends Component {
    constructor(props, context) {
	super(props, context);
    }
    render() { return ( <View /> ) }
}
/*****************************************************************************/
/*export class Canvas extends Component {
    constructor(props, context) {
	super(props, context);
	//this.state = { dataURL: null };
	this.updateCanvas = this.updateCanvas.bind(this);	
    }
    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    updateCanvas() {
	var canvas = this.refs.htmlElem;
	const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, this.props.width, this.props.height);
	
	var image = this.props.image;
	//console.log(image);
	if ( ! image )
	    return;
	
	var w = canvas.width;
	var h = image.height * canvas.width / image.width;
	if ( h > canvas.height ) {
	    h = canvas.height;
	    w = image.width * canvas.height / image.height;
	}
	var xoff = (canvas.width  - w) / 2;
	var yoff = (canvas.height - h) / 2;
	ctx.drawImage(image, xoff,yoff, w,h);

	var dataURL = canvas.toDataURL("image/jpeg", 0.1);
	this.props.updateDataURL(dataURL);
    }
    
    render() {
	let parent = this;

	let userStyle = this.props.style;

	let defaultStyle = {
	    border: '10px',
	};

	let style = Object.assign({},defaultStyle,userStyle);
	
	return (
		<canvas ref="htmlElem" style={style} width={this.props.width} height={this.props.height}></canvas>
	);
    }
};
*/
