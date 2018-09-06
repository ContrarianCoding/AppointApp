import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import { Header, Card, CardItem, Button, LoginForm, Spinner, WeakView, ProviderChooser } from './common';

class AppointApp extends Component {
  state = { signedIn: null, cleanerlist: [], skeg: [], weeksting: '', months: [{days: 31, name: 'Jan'}, {days: 28, name: 'Feb'}, {days: 31, name: 'Mar'}, {days: 30, name: 'Apr'}, {days: 31, name: 'May'}, {days: 30, name: 'Jun'}, {days: 31, name: 'Jul'}, {days: 31, name: 'Aug'}, {days: 30, name: 'Sep'}, {days: 31, name: 'Oct'}, {days: 30, name: 'Nov'}, {days: 31, name: 'Dec'}], today: {}, pro: '' };

  componentWillMount() {
  firebase.initializeApp({
      apiKey: 'AIzaSyDEdAKupwZ8eMsWGkaDcpeK_VlMmgDCLQA',
      authDomain: 'authenitication-f7688.firebaseapp.com',
      databaseURL: 'https://authenitication-f7688.firebaseio.com',
      projectId: 'authenitication-f7688',
      storageBucket: 'authenitication-f7688.appspot.com',
      messagingSenderId: '80966187186'
    });

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({ signedIn: true });
      } else {
        this.setState({ signedIn: false });
      }
    });

    var cleanerlistref = firebase.database().ref('AvivCleaning/cleaners/').once('value').then((snapshot) => {
      var cleanerlist = [];
      snapshot.forEach(function(childSnapshot) {
        var cleanerName = childSnapshot.val().Name;
        var cleanerImage = childSnapshot.val().Pic;
        cleanerlist.push({ name: cleanerName, pic: cleanerImage });
      });
      this.setState({ cleanerlist: cleanerlist });
    });
    console.log("componentWillMount");

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday'];

    var today = new Date();
    
    this.setState({ today: today });
  }

  findWeek(today){
    var startDate = -1;
    startDate = today.getDate() - today.getDay();
    var startMonth = today.getMonth();
    var startYear = today.getYear() - 100;
    if (startDate < 1){
      if(startMonth != 0){
        startDate += this.state.months[startMonth - 1].days;
      }
      else{
        startDate += this.state.months[11].days;
      }
      if(startMonth == 0) {
        startMonth = 11;
        startYear--;
      }
      else{
        startMonth--;
      }
    }

    var endDate = -1;
    endDate = today.getDate() - today.getDay() + 6;
    var endMonth = today.getMonth();
    var endYear = today.getYear() - 100;
    if (endDate > this.state.months[endMonth].days){
      endDate -= this.state.months[endMonth].days;
      endMonth++;
      if(endMonth == 11) {
        endMonth = 0;
        endYear++;
      }
    }
    var ret = { startDate, startMonth, startYear, endDate, endMonth, endYear };
    return ret;
  }

  onButtonPress() {
    console.log("onButtonPress");
    firebase.auth().signOut();
  }

  onSubmitPress() {
    console.log("onSubmitPress");
    var arr = this.state.skeg;
    arr.forEach((day) => {
      day.value[0].selected = false;
      day.value[1].selected = false;
    });
    this.setState({ skeg: arr });
  }

  WeekBack() {
    console.log("WeekBack");
    var today = this.state.today;
    for(let i = 0; i < 7; i++){
      today.setDate(today.getDate() - 1);
    }
    console.log('moving from date - ' + this.state.today.getDate() + '/' + this.state.today.getMonth() + '/' + this.state.today.getYear());
    console.log('moving to date - ' + today.getDate() + '/' + today.getMonth() + '/' + today.getYear());
    this.setState({ today: today, skeg: [] });
    this.loadWeek(this.state.pro, today);
  }
  
  WeekNext() {
    console.log("WeekNext");
    var today = this.state.today;
    for(let i = 0; i < 7; i++){
      today.setDate(today.getDate() + 1);
    }
    console.log('moving from date - ' + this.state.today.getDate() + '/' + this.state.today.getMonth() + '/' + this.state.today.getYear());
    console.log('moving to date - ' + today.getDate() + '/' + today.getMonth() + '/' + today.getYear());
    this.setState({ today: today, skeg: [] });
    this.loadWeek(this.state.pro, today);
  }

  loadWeek(pro, day){
    console.log("loadWeek");
    var { startDate, startMonth, startYear, endDate, endMonth, endYear } = this.findWeek(day);
    var startMonthNum = startMonth + 1;
    var endMonthNum = endMonth + 1;
    var weekstr = startDate + '/' + startMonthNum + '/' + startYear + '-' + endDate + '/' + endMonthNum + '/' + endYear;
    this.setState({ weekstring: weekstr });
    var firstName = pro.split(' ')[0];
    console.log(firstName + ' for the week ' + startDate + '/' + this.state.months[startMonth].name + '-' + endDate + '/' + this.state.months[endMonth].name);
    var readfrommonth = startMonth == endMonth ? startDate + 7: this.state.months[startMonth].days + 1;
    var index = 0;
    var skeg = [];
    var skegstring = 'AvivCleaning/cleaners/' + firstName + '/schedule/'
    var startmonthstring = '' + this.state.months[startMonth].name + startYear;
    var endmonthstring = '' + this.state.months[endMonth].name + endYear;
    var skeguleref = firebase.database().ref(skegstring);
    skeguleref.once('value').then((snapshot) => {
      if(!snapshot.child(endmonthstring).exists()){
        var startmonthref = firebase.database().ref(skegstring + '/' + endmonthstring + '/1');
        startmonthref.set({ Morning: 0, Evening: 0 });
      }   
    });
    var skegmonthstring = skegstring + startmonthstring;
    var skegref = firebase.database().ref(skegmonthstring).once('value').then((snapshot) => {
      if(snapshot.val() != null){
        for(let i = startDate; i < readfrommonth; i++){
          var daystring = '' + i;
          var dayref = firebase.database().ref(skegmonthstring + '/' + daystring);
          if(!snapshot.child(daystring).exists()){            
            dayref.set({ Morning: 0, Evening: 0 });
            console.log('logged new day: ' + i);
            var value = [{ occupied: false, selected: false }, { occupied: false, selected: false }];
            skeg.push({ value: value, day: index });
          }
          else{
            var morningHours = snapshot.child(daystring).val().Morning;
            var eveningHours = snapshot.child(daystring).val().Evening;
            var morningOccupied = (morningHours != 0);
            var eveningOccupied = (eveningHours != 0);
            var value = [{ occupied: morningOccupied, selected: false }, { occupied: eveningOccupied, selected: false }];
            skeg.push({ value: value, day: index });
            //console.log(i + '/' + startMonth);
            //console.log('Morning:' + value[0].occupied + ' Evening:' + value[1].occupied);
          }
          index++;
        }
        if(startMonth != endMonth){
          skegmonthstring = 'AvivCleaning/cleaners/' + firstName + '/schedule/' + endmonthstring;
          var skegref = firebase.database().ref(skegmonthstring).once('value').then((snapshot) => {
            for(let i = 1; i <= endDate; i++){
              var daystring = '' + i;
              var dayref = firebase.database().ref(skegmonthstring + '/' + daystring);
              if(!snapshot.child(daystring).exists()){            
                dayref.set({ Morning: 0, Evening: 0 });
                console.log('logged new day: ' + i);
                var value = [{ occupied: false, selected: false }, { occupied: false, selected: false }];
                skeg.push({ value: value, day: index });
              }
              else{
                var morningHours = snapshot.child(daystring).val().Morning;
                var eveningHours = snapshot.child(daystring).val().Evening;
                var morningOccupied = (morningHours != 0);
                var eveningOccupied = (eveningHours != 0);
                var value = [{ occupied: morningOccupied, selected: false }, { occupied: eveningOccupied, selected: false }];
                skeg.push({ value: value, day: index });
                //console.log(i + '/' + startMonth);
                //console.log('Morning:' + value[0].occupied + ' Evening:' + value[1].occupied);
              }
              index++;
            }
            this.setState({ skeg: skeg });
          });
        }
        else{
          this.setState({ skeg: skeg });
        }
      }
    });
    
    
  }

  chooseProvider(pro){
    console.log("chose provider");
    console.log(pro);
    if(pro != this.state.pro) this.setState({ pro: pro, skeg: [] });
    if(pro != ''){
      this.loadWeek(pro, this.state.today);
    }
  }

  renderBody() {
    console.log("renderBody");
    switch (this.state.signedIn) {
      case true:
        if(!this.state.pro){
          return(
            <View>
              {this.renderProviderList()}
              <View style={{ height: 60, paddingBottom: 10 }}>
                <Button
                  shit={'Log out'}
                  fontSize={20}
                  onPress={this.onButtonPress.bind(this)} />
              </View>
            </View>
          );
        }
        return(
          <View>
            <View style={{ height: 60, paddingBottom: 10 }}>
              <Button
                shit={'Back'}
                fontSize={20}
                onPress={() => this.chooseProvider('')} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Button 
                  shit={'>'} 
                  fontSize={40}
                  onPress={this.WeekNext.bind(this)} />
              </View>
              <View style={{ flex: 4 }}>
                <WeakView datestring={this.state.weekstring}>
                  <View>{this.renderScheduleButtons()}</View>
                </WeakView>
              </View>
              <View style={{ flex: 1 }}>
                <Button shit={'<'} 
                fontSize={40}
                onPress={this.WeekBack.bind(this)} />
              </View>
            </View>
            <View style={{ height: 60, paddingBottom: 10 }}>
              <Button
                shit={'Submit'}
                fontSize={20}
                onPress={this.onSubmitPress.bind(this)} />
            </View>
            <View style={{ height: 60, paddingBottom: 10 }}>
              <Button
                shit={'Log out'}
                fontSize={20}
                onPress={this.onButtonPress.bind(this)} />
            </View>
          </View>
        );
      case false:
        return(
          <View style={{ marginBottom: 10 }}>
            <View style={{ alignItems: 'center' }}></View>
            <LoginForm />
          </View>
        );
      default:
        return(
          <Spinner />
        );
    }
  }

  setSelected(_day, _index){
    console.log('setting selected index: ' + _index);
    console.log('for day: ' + _day);
    if(_day < 7 && _index < 2 && _day >= 0 && _index >= 0){
      var arr = this.state.skeg;
      arr[_day].value[_index].selected = !arr[_day].value[_index].selected;
      this.setState({ skeg: arr });
    }
  }

  
  renderScheduleButtons(){
    console.log('renderScheduleButtons');
    if(!this.state.skeg.length){
      return(
        <Spinner />
      );
    }
    return this.state.skeg.map(val =>
        <View key={val.day}>
          {this.renderDay(val.value, val.day)}
        </View>
    );
  }

  renderDay(val, day){
    console.log('renderDay');
    var bgCol1 = '#333333';
    var bgCol2 = '#333333';
    if(!val[0].occupied){
      if(val[0].selected){
        bgCol1 = '#f0ff00';
      }
      else{
        bgCol1 = '#444444';
      }
    }
    if(!val[1].occupied){
      if(val[1].selected){
        bgCol2 = '#f0ff00';
      }
      else{
        bgCol2 = '#444444';
      }
    }
    return (
      <View style={styles.dayStyle}>
        <View backgroundColor={bgCol2} style={{ marginRight: 2, marginBottom: 5 }}>
          <TouchableHighlight
            underlayColor={'red'}
            onPress={() => this.setSelected(day, 1)}>
            <Text style={styles.shiftStyle}>Evening</Text>
          </TouchableHighlight>
        </View>
        <View backgroundColor={bgCol1} style={{ marginLeft: 2, marginBottom: 5 }}>
          <TouchableHighlight
            underlayColor={'red'}
            onPress={() => this.setSelected(day, 0)}>
            <Text style={styles.shiftStyle}>Morning</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }


  render() {
    console.log("render");
    return (
      <View style={{ backgroundColor: '#000000', flex: 1 }}>
        <Header ht={'Aviv Cleaning'} bg={'#3f140e'} />
        <View style={{ alignItems: 'center' }}>
          <Image source={{uri: 'http://image.ibb.co/iuzMek/Aviv_Cleaning_Logo.jpg'}} style={styles.ImageStyle} />
        </View>
        <Card>{this.renderBody()}</Card>
      </View>
    );
  }

  renderProviderList(){
    console.log("renderProviderList");
    return(
      <Card>
        <View style={styles.containerStyle}>
          <Text style={styles.ProviderTitleStyle}>Choose Cleaner</Text>
          <View style={styles.listHolder}>
            {this.renderListBody()}
          </View>
        </View>
      </Card>
    );
  }

  renderListBody(){
    console.log("renderListBody");
    return this.state.cleanerlist.map(val =>
      <View key={val.name} style={styles.ListContainerStyle}>
        {this.renderProvider(val)}
      </View>
    , this);
  }

  renderProvider(val){
    console.log("renderProvider");
    return(
      <TouchableHighlight onPress={() => this.chooseProvider(val.name)} >
        <View style={styles.tabStyle}>
          <Text style={styles.textStyle}>{val.name}</Text>
          <Image source={{uri: val.pic}} style={styles.ImageSmallStyle} />
        </View>
      </TouchableHighlight>
    );
  }
}

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
    fontSize: 20,
    fontFamily: 'sans-serif-thin',
    color: '#E1FCFF'
  },

  nextlastWeakText: {
    fontSize: 30,
    fontFamily: 'sans-serif-thin',
    color: '#E1FCFF'
  },

  ProviderTitleStyle: {
    fontSize: 15,
    fontFamily: 'sans-serif-thin',
    color: '#E1FCFF',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },

  containerStyle: {
    height: 300,
    width: null,
    alignItems: 'center'
  },

  weekButtonStyle: {
    height: 110,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  ListContainerStyle: {
    height: null,
    width: 400,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderColor: '#E1FCFF',
    borderWidth: 2,
    borderTopWidth: 0
  },


  tabStyle: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5
  },

  ImageStyle: {
    marginTop: 15,
    marginBottom: 8,
    height: 120,
    width: 245,
    borderColor: '#E1FCFF',
    borderWidth: 2
  },

  ImageSmallStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    width: 40,
    borderColor: '#E1FCFF',
    borderWidth: 2

  },

  listHolder: {
    flexDirection: 'column', 
    alignItems: 'center',
    width: null,
  },

  dayStyle: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: 5,
    borderBottomColor: '#E1FCFF',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },

  shiftStyle: {
    fontSize: 15,
      fontFamily: 'sans-serif-thin',
      color: '#E1FCFF',
      marginTop: 3,
      marginBottom: 3,
      marginLeft: 10,
      marginRight: 10
  }
};

export default AppointApp;
