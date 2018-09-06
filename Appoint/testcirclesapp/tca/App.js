/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  render() {
    return (
    	<View style={styles.topcontainerow}>

			<TouchableOpacity style={styles.circlesmallright}></TouchableOpacity>

			<View style={styles.container}>

				<TouchableOpacity style={styles.circlesmalltop}></TouchableOpacity>

				<View style={styles.containerow}>
					<TouchableOpacity style={styles.circlemidsmall}></TouchableOpacity>
					<View style={styles.spacer}></View>
					<TouchableOpacity style={styles.circlemidsmall}></TouchableOpacity>
				</View>

				<TouchableOpacity style={styles.circlelarge}></TouchableOpacity>

				<View style={styles.containerow}>
					<TouchableOpacity style={styles.circlemidsmall}></TouchableOpacity>
					<View style={styles.spacer}></View>
					<TouchableOpacity style={styles.circlemidsmall}></TouchableOpacity>
				</View>

				<TouchableOpacity style={styles.circlesmallbottom}></TouchableOpacity>

			</View>

			<TouchableOpacity style={styles.circlesmallleft}></TouchableOpacity>
      	</View>
    );
  }
}

const styles = StyleSheet.create({
  topcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topcontainerow: {
  	flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerow: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  	circlelarge: {
	    width: 120,
	    height: 120,
	    borderRadius: 120/2,
	    backgroundColor: 'red'
	},
	circlesmallright: {
		left: 45,
		width: 70,
		height: 70,
		borderRadius: 70/2,
		backgroundColor: 'red'
	},
	circlesmallleft: {
		right: 45,
		width: 70,
		height: 70,
		borderRadius: 70/2,
		backgroundColor: 'red'
	},
	circlesmalltop: {
		top: 45,
		width: 70,
		height: 70,
		borderRadius: 70/2,
		backgroundColor: 'red'
	},
	circlesmallbottom: {
		bottom: 45,
		width: 70,
		height: 70,
		borderRadius: 70/2,
		backgroundColor: 'red'
	},
	spacer: {
		marginLeft: 22,
  		marginRight: 22,
		width: 50,
	},
	circlemidsmall: {
		marginBottom: 10,
  		marginTop: 10,
  		marginLeft: 10,
  		marginRight: 10,
		width: 70,
		height: 70,
		borderRadius: 70/2,
		backgroundColor: 'red'
	}
});
