import React, { Component, StyleSheet } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    pt2dp
} from './react-onerva';

import Header from './header';

var styles = require('./styles');
var colors = require('./colors');


export default class GradesScene extends Component {
    constructor(props, context) {
	super(props, context);
	this.setMood = this.setMood.bind(this);
	this.setAbility = this.setAbility.bind(this);
    }

    setMood(mood) {
	this.props.onUpdateEntry({ type: 'visit', mood: mood });
    }
    setAbility(ability) {
	this.props.onUpdateEntry({ type: 'visit', ability: ability });
    }

    
    render() {
	let scene = this;
	let gradeColors = colors.gradeColors;
	let gradeDescs = ['', 'Huono', 'Välttävä', 'Kohtalainen', 'Hyvä', 'Erittäin hyvä'];

	let mood = this.props.entry.mood;
	let ability = this.props.entry.ability;
	
	let highlight = mood > 0 && ability > 0;
	
	return (
	    <View style={[styles.flex110,styles.flexColumn,{backgroundColor: colors.background2}]}>
	    
	    <Header title={scene.props.chat.alias} backScene={scene.props.backScene} onBack={scene.props.onBack} onLock={scene.props.onLock} />
	    
	    <View style={[styles.flex110, styles.flexRow, { margin: 0, backgroundColor: colors.background2 }]}>

	    <View style={[styles.flexColumn, { margin: pt2dp(5), flexGrow: 0.5, flexShrink: 0, flexBasis: 0, alignItems: 'stretch', justifyContent: 'flex-start'}]} >

	    <Text style={{ fontSize: pt2dp(10), margin: pt2dp(10), marginBottom: pt2dp(5) }}>MIELIALA</Text>
	    {
		[5,4,3,2,1].map(function(item,index) {
		    return (
			<Button key={'moodBtn'+item}
			style={[styles.flex110,styles.flexColumn,{ width: '100%', borderRadius: pt2dp(3), margin: pt2dp(2), padding: 0, alignItems: 'stretch', justifyContent: 'center', maxHeight: pt2dp(50) }]}
			underlayColor={colors.gray}
			onPress={() => { scene.setMood(item) }}
			>

			<View style={[styles.flex110,styles.flexRow, { justifyContent: 'center', alignItems: 'stretch', padding: 0, margin: 0, borderRadius: pt2dp(3), height: '100%', backgroundColor: mood == item ? gradeColors[item] : colors.background }]}>
			
			<View style={{ width: pt2dp(5), backgroundColor: gradeColors[item], borderBottomLeftRadius: pt2dp(3), borderTopLeftRadius: pt2dp(3), margin: 0 }} />
			
			<View style={[styles.flex110,styles.flexRow,{ alignItems: 'center', paddingLeft: pt2dp(15), paddingTop: pt2dp(10), paddingBottom: pt2dp(10) }]}>
			<Text style={{fontSize: pt2dp(12), color: mood == item ? colors.background : colors.darkGray}}>{gradeDescs[item]}</Text>
			</View>
			
			</View>

			</Button>
		    )
		})
	    }	    
	    </View>


	    
	    <View style={[styles.flexColumn, { margin: pt2dp(5), flexGrow: 0.5, flexShrink: 0, flexBasis: 0, alignItems: 'stretch', justifyContent: 'flex-start'}]} >

	    <Text style={{ fontSize: pt2dp(10), margin: pt2dp(10), marginBottom: pt2dp(5) }}>TOIMINTAKYKY</Text>
	    {
		[5,4,3,2,1].map(function(item,index) {
		    return (
			<Button key={'abilityBtn'+item}
			style={[styles.flex110,styles.flexColumn,{ width: '100%', borderRadius: pt2dp(3), margin: pt2dp(2), padding: 0, alignItems: 'stretch', justifyContent: 'center', maxHeight: pt2dp(50) }]}
			underlayColor={colors.gray}
			onPress={() => { scene.setAbility(item) }}
			>

			<View style={[styles.flex110,styles.flexRow, { justifyContent: 'center', alignItems: 'stretch', padding: 0, margin: 0, borderRadius: pt2dp(3), height: '100%', backgroundColor: ability == item ? gradeColors[item] : colors.background }]}>
			
			<View style={{ width: pt2dp(5), backgroundColor: gradeColors[item], borderBottomLeftRadius: pt2dp(3), borderTopLeftRadius: pt2dp(3), margin: 0 }} />
			
			<View style={[styles.flex110,styles.flexRow,{ alignItems: 'center', paddingLeft: pt2dp(15), paddingTop: pt2dp(10), paddingBottom: pt2dp(10) }]}>
			<Text style={{fontSize: pt2dp(12), color: ability == item ? colors.background : colors.darkGray}}>{gradeDescs[item]}</Text>
			</View>
			
			</View>

			</Button>
		    )
		})
	    }	    
	    </View>

	    </View>


	    <Button style={{ margin: pt2dp(8), padding: pt2dp(8), backgroundColor: highlight ? colors.turquoise : colors.gray }}
	    onPress={() => { scene.props.onNext(scene.props.nextScene)}}>
	    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: pt2dp(10), color: colors.background }}>
	    SEURAAVA &nbsp; &nbsp; &nbsp; &gt;
	    </Text>
	    </Button>

	    </View>
	)
    }
}
