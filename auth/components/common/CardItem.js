import React from 'react';
import { View } from 'react-native';

const CardItem = (props) => {
  return (
    <View style={styles.ItemStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  ItemStyle: {
    padding: 5,
    backgroundColor: '#ffcc00',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    borderBottomWidth: 1
  }
};

export { CardItem };
