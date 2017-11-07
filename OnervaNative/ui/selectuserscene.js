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


export default class SelectUserScene extends Component {
    constructor(props, context) {
	super(props, context);
    }

    render() {
	let scene = this;
	let dotColors = colors.rainbowList;
	let users = [];
	//console.log(scene.props.users);
	let alias_to_keys = {};
	let aliases = [];
	Object.keys(scene.props.users).map(function (key) { 
	   let alias = scene.props.users[key].alias;
	   alias_to_keys[alias] = key; 
	   aliases.push(alias); 
	});
	aliases.sort();
	aliases.map(function (alias) {
	  users.push(scene.props.users[alias_to_keys[alias]]);
	});
	//if ( scene.props.users ) {
	//    let keys = Object.keys(scene.props.users);
	//    keys.sort();
	//    keys.map(function (key) {
	//	users.push(scene.props.users[key])
	//    });
	//}
	//console.log(users);

	
	return (
	    <View style={[styles.flex100, styles.flexColumn, { backgroundColor: colors.background } ]}>
	    
	    <Header title={ users.length ? 'Kirjautuminen' : ''} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />
	    
	    <View style={[styles.flex110, styles.flexColumn, { flexGrow: 2, margin: 0, padding: mm2dp(7), backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', display: users.length ? 'none' : 'flex', justifyContent: 'flex-start' }]}>

	    <View style={[styles.flex110, styles.flexColumn, { alignItems: 'center', justifyContent: 'center' }]} >
	    <Image style={{ width: mm2dp(70), height: mm2dp(50) }} source={require('./imgs/splash.png')} />
	    </View>

	    <View style={[styles.flex110, styles.flexColumn, { alignItems: 'center', justifyContent: 'flex-start' }]} >
	    <Text style={{ fontSize: pt2dp(11), fontWeight: 'bold', marginTop: pt2dp(20), marginBottom: pt2dp(10) }}>OLE HYVÄ JA KIRJAUDU ALTA</Text>
	    </View>
	    
	    </View>
	    
	    
	    
	    <ScrollView style={styles.flex110}>
	    {
		users.map(function(item, index) {
		    let initial = item.alias[0];
		    return (
			<View key={'userView'+index} 
			style={{ width: '100%', margin: 0, padding: 0, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
			onPress={() => { scene.props.onSelect(item)}}>
			
			<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch'}}>
			
			<View style={{opacity: 0.8, margin: pt2dp(8), marginLeft: pt2dp(10), borderRadius: pt2dp(20), height: pt2dp(40), width: pt2dp(40), backgroundColor: dotColors[index % dotColors.length], alignItems: 'center', justifyContent: 'center', display: 'flex' }} >
			<Text style={{ color: '#ffffff', fontSize: pt2dp(18) }}>
			{initial}
			</Text>
			</View>

			<Button key={'userBtn'+index}
			style={[styles.flex110, styles.flexRow, { paddingLeft: pt2dp(20), textAlign: 'left', backgroundColor: colors.background, justifyContent: 'flex-start', alignItems: 'center' }]}
			onPress={() => { scene.props.onSelect(item)}}>
			<View>
			<Text style={{color: '#404040', fontSize: pt2dp(12) }}>
			{item.alias}
			</Text>
			</View>

			</Button>
			
			<View style={{ display: 'flex', alignItems: 'center', paddingRight: pt2dp(10), justifyContent: 'center' }}>
			<Image style={{ width: pt2dp(15), height: pt2dp(15) }} source={require('./imgs/next.png')} />
			</View>
			
			</View>
			
			</View>
		    )
		})
	    }
	    </ScrollView>


	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: colors.turquoise }}
	    onPress={() => { scene.props.onLogin() }}>
	    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
	    KIRJAUDU &nbsp; &nbsp; &nbsp; &gt;
	    </Text>
	    </Button>

	    </View>
	)
    }
}

