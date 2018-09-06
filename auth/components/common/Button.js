import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
  var { height, fontSize } = props;
  if(!height)
    height = fontSize + 30;
  return (
    <TouchableOpacity
    onPress={props.onPress}
    style={[styles.buttonStyle, { height }]}>
      <Text style={[styles.textStyle,  { fontSize }]}>{props.shit}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#663500',
    borderWidth: 1,
    borderColor: '#708090',
    marginLeft: 5,
    marginRight: 5
  },

  textStyle: {
    flex: 1,
    alignSelf: 'center',
    color: '#ffcc00',
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

export { Button };
