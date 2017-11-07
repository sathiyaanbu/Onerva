import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    Button,
    Link,
    pt2dp
} from './react-onerva';

var styles = require('./styles');
var colors = require('./colors');

import Header from './header';

export default class ErrorScene extends Component {
    constructor(props, context) {
	super(props, context);
    }

    render() {
	let title = this.props.title;
	let scene = this;

	let textStyle = {
	    lineHeight: pt2dp(11*1.3),
	    fontSize: pt2dp(11)
	};
	
	let error1 = 'Onerva kohtasi ongelman, jota se ei pysty ratkaisemaan. Ongelman syy saattaa olla tietoverkkoyhteyksissä tai muissa teknisissä yksityiskohdissa. Jos ongelma toistuu, ota yhteys tukeen ja kerro alla oleva virhekoodi.';

	let error2 = this.props.error;

	if ( this.props.error == 'credentials' ) {
	    error1 = 'Valittu käyttäjä ja PIN-koodi eivät vastaa toisiaan. Jos ongelma toistuu, vaikka annat PIN-koodin varmasti oikein, ota yhteys tukeen.';
	    error2 = '';
	}
	if ( this.props.error.indexOf('NetworkError') >= 0 ) {
	    error1 = 'Onerva ei saa yhteyttä palvelimeen. Ongelman syy saattaa olla tietoverkkoyhteyksissä tai muissa teknisissä yksityiskohdissa. Jos ongelma toistuu hyvän tietoverkkoyhteyden alueella, ota yhteys tukeen ja kerro alla oleva virhekoodi.';
	    error2 = this.props.error;    
	}

	
	let error3 = (
	    <View>
	    <Text style={textStyle}>Tukeen saat yhteyden sähköpostilla</Text>
	    <Link style={[textStyle,{color: colors.darkGreen}]} href={'mailto:tuki@onervahoiva.fi'}>tuki@onervahoiva.fi</Link>
	    <View style={{display: 'flex', flexDirection: 'row'}}>
	    <Text style={textStyle}>tai soitamalla</Text>
	    <Link style={[textStyle,{color: colors.darkGreen}]} href={'tel:0456005991'}>&nbsp;045 6005 991</Link>
	    </View>
	    </View> );
	    
	return (
	    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', flex: 1}}>

	    <Header title={'Ongelma'} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />

	    <View style={{ margin: 0, overflowY: 'auto', flex: 1 }}>
	    
	    <View style={{ padding: pt2dp(20)}}>
	    <Text style={ textStyle }>
	    {error1}
	    </Text>	    
	    </View>
	    
	    <View style={{ padding: pt2dp(20) }}>
	    <Text style={{ lineHeight: pt2dp(11*1.3), fontSize: pt2dp(11), fontWeight: 'bold' }}>
	    {error2}
	    </Text>	    
	    </View>
	    
	    <View style={{ padding: pt2dp(20) }}>
	    { /*
		 <Text style={{ lineHeight: pt2dp(11*1.3), fontSize: pt2dp(11) }}> */ }
	    {error3}
	    { /* </Text>	   */ }
	    </View>
	    
	    </View>
	    
	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: colors.turquoise }}
	    onPress={() => { scene.props.onBack(scene.props.backScene) }}>
	    <Text style={{ fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
		       &lt; &nbsp; &nbsp; &nbsp; PALAA
	    </Text>
	    </Button>

	    </View>
	)

    }
}
    
