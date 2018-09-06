import React, { Component } from 'react';
import { View, Text } from 'react-native';
//import firebase from 'firebase';
import { Header, Card, CardItem, Button, LoginForm, Spinner } from '../components/common';

class App extends Component {
  state = { signedIn: null }
  componentWillMount() {
    // firebase.initializeApp( {
    //   apiKey: 'AIzaSyDEdAKupwZ8eMsWGkaDcpeK_VlMmgDCLQA',
    //   authDomain: 'authenitication-f7688.firebaseapp.com',
    //   databaseURL: 'https://authenitication-f7688.firebaseio.com',
    //   projectId: 'authenitication-f7688',
    //   storageBucket: 'authenitication-f7688.appspot.com',
    //   messagingSenderId: '80966187186'
    // });

    // firebase.auth().onAuthStateChanged((user) => {
    //   if(user) {
    //     this.setState({ signedIn: true });
    //   } else {
    //     this.setState({ signedIn: false });
    //   }
    // });
  }

  onButtonPress() {
    this.setState({ signedIn: false });
  }

  renderBody() {
    switch (this.state.signedIn) {
      case true:
      return(
        <Button
          shit={'Log out'}
          //onPress={() => firebase.auth().signOut()}
          fontSize={20}
          />
        );
      case false:
      return(
        <LoginForm />
      );


      default:
      return(
        <Spinner size='large' />
      );
    }
  }

  render() {
    return (
      <View
      style={{ backgroundColor: '#1a0d00', flex: 1}}>
        <Header ht={'Bar Sucks Cocks!'} bg={'#663500'} />
        {this.renderBody()}
      </View>
    );
  }
}

export default App;
