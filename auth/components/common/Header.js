import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
  const { textStyle } = styles;
  const { viewStyle } = styles;
  return (
    <View style={viewStyle} backgroundColor={props.bg}>
      <Text style={textStyle}>{props.ht}</Text>
    </View>
  );
};

const styles = {
  viewStyle: {

    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    paddingTop: 15,
    elevation: 2,
    position: 'relative'
  },

  textStyle: {
    fontSize: 30,
    fontFamily: 'serif',
    color: '#ffcc00'
  }
};
export { Header };
