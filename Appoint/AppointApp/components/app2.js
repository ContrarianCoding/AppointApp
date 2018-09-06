import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableHighlight, Alert } from 'react-native';
import firebase from 'firebase';
import { Header, Card, CardItem, Button, LoginForm, Spinner, WeakView, ProviderChooser } from './common';

class AppointApp extends Component {
  state = { signedIn: null, cleanerlist: [], skeg: [], weeksting: '', months: [{days: 31, name: 'Jan'}, {days: 28, name: 'Feb'}, {days: 31, name: 'Mar'}, {days: 30, name: 'Apr'}, {days: 31, name: 'May'}, {days: 30, name: 'Jun'}, {days: 31, name: 'Jul'}, {days: 31, name: 'Aug'}, {days: 30, name: 'Sep'}, {days: 31, name: 'Oct'}, {days: 30, name: 'Nov'}, {days: 31, name: 'Dec'}], today: {}, thisday: {}, pro: '' };

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
        //TODO - register client
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
    
    this.setState({ thisday: today, today: today });
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
    cleanerlist.forEach((cleaner) => {
      var skegstring = 'AvivCleaning/cleaners/' + cleaner.split(' ')[0] + '/schedule';
      var { startDate, startMonth, startYear, endDate, endMonth, endYear } = this.findWeek(this.state.today);

      arr.forEach((day) => { 
        if(endMonth == startMonth){//all one month
          var todaydate = startDate + day.day;
          var daystring = this.state.months[endMonth].name + endYear + '/' + todaydate;
        }
        else{
          if(7 - endDate < day.day){//two months, day in second month
            var todaydate = day.day - (7 - endDate);
            var daystring = this.state.months[endMonth].name + endYear + '/' + todaydate;
          }
          else{//two months, day in first month
            var todaydate = startDate + day.day;
            var daystring = this.state.months[startMonth].name + startYear + '/' + todaydate;
          }
        }
        var dayref = firebase.database().ref(skegstring + '/' + daystring);
        
        if(day.value[0].selected){
          console.log('got ref: ' + skegstring + '/' + daystring);
          day.value[0].selected = false;
          var dayref = firebase.database().ref(skegstring + '/' + daystring);
          dayref.update({ Morning: { commitment: { client: firebase.auth().currentUser().displayName(), hours: day.value[0].order } } } });
        }
        if(day.value[1].selected){
          console.log('got ref: ' + skegstring + '/' + daystring);
          day.value[1].selected = false;
          var dayref = firebase.database().ref(skegstring + '/' + daystring);
          dayref.update({ Evening: day.value[1].order });
        }
      });
    });
    
    this.setState({ skeg: arr });
    this.loadWeek(this.state.pro, this.state.today);
  }

  parseDate(index){
    var datePieces = this.props.datestring.split('/');
    var day = Number.parseInt(datePieces[0], 10);
    var monthIndex = 1;
    day += index;
    if(day > this.state.months[Number.parseInt(datePieces[1], 10) - 1].days){
      day -= this.state.months[Number.parseInt(datePieces[1], 10) - 1].days;
      monthIndex = 3;
    }
    var res = day + '/' + datePieces[monthIndex];
    return(res);
  }

  WeekBack() {
    console.log("WeekBack");
    var today = this.state.today;
    for(let i = 0; i < 7; i++){
      today.setDate(today.getDate() - 1);
    }
    this.setState({ today: today, skeg: [] });
    this.loadWeek(this.state.pro, today);
  }
  
  WeekNext() {
    console.log("WeekNext");
    var today = this.state.today;
    for(let i = 0; i < 7; i++){
      today.setDate(today.getDate() + 1);
    }
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
    
    var skegstring = 'AvivCleaning/cleaners/' + firstName + '/schedule/'
    var startmonthstring = '' + this.state.months[startMonth].name + startYear;
    var endmonthstring = '' + this.state.months[endMonth].name + endYear;
    var skeguleref = firebase.database().ref(skegstring);
    skeguleref.once('value').then((snapshot) => {
      if(!snapshot.child(endmonthstring).exists()){
        var startmonthref = firebase.database().ref(skegstring + '/' + endmonthstring + '/1');
        startmonthref.set({ Morning: { commitment: { client: 'None', hours: 0 } }, Evening: { commitment: { client: 'None', hours: 0 } } });
      }
      if(!snapshot.child(startmonthstring).exists()){
        var startmonthref = firebase.database().ref(skegstring + '/' + startmonthstring + '/' + this.state.months[startMonth].days);
        startmonthref.set({ Morning: { commitment: { client: 'None', hours: 0 } }, Evening: { commitment: { client: 'None', hours: 0 } } });
      }
    });
    var skegmonthstring = skegstring + startmonthstring;
    var skegref = firebase.database().ref(skegmonthstring).on('value', (snapshot) => {
      var skeg = [];
      if(snapshot.val() != null){
        for(let i = startDate; i < readfrommonth; i++){
          var daystring = '' + i;
          var dayref = firebase.database().ref(skegmonthstring + '/' + daystring);
          if(!snapshot.child(daystring).exists()){            
            dayref.set({ Morning: { commitment: { client: 'None', hours: 0 } }, Evening: { commitment: { client: 'None', hours: 0 } } });
            console.log('logged new day: ' + i);
            var value = [{ occupied: false, selected: false, order: 0 }, { occupied: false, selected: false, order: 0 }];
            skeg.push({ value: value, day: index });
          }
          else{
            var morningHours = snapshot.child(daystring).child('Morning').child('commitment').child('hours').val();
            var eveningHours = snapshot.child(daystring).child('Evening').child('commitment').child('hours').val();
            var morningOccupied = (morningHours != 0);
            var eveningOccupied = (eveningHours != 0);
            var value = [{ occupied: morningOccupied, selected: false, order: 0 }, { occupied: eveningOccupied, selected: false, order: 0 }];
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
                dayref.set({ Morning: { commitment: { client: 'None', hours: 0 } }, Evening: { commitment: { client: 'None', hours: 0 } } });
                console.log('logged new day: ' + i);
                var value = [{ occupied: false, selected: false, order: 0 }, { occupied: false, selected: false, order: 0 }];
                skeg.push({ value: value, day: index });
              }
              else{
                var morningHours = snapshot.child(daystring).child('Morning').child('commitment').child('hours').val();
                var eveningHours = snapshot.child(daystring).child('Evening').child('commitment').child('hours').val();
                var morningOccupied = (morningHours != 0);
                var eveningOccupied = (eveningHours != 0);
                var value = [{ occupied: morningOccupied, selected: false, order: 0 }, { occupied: eveningOccupied, selected: false, order: 0 }];
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
        console.log('got snapshot');
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
                  fontSize={50}
                  onPress={this.WeekNext.bind(this)} />
              </View>
              <View style={{ flex: 4 }}>
                <WeakView datestring={this.state.weekstring}>
                  <View>{this.renderScheduleButtons()}</View>
                </WeakView>
              </View>
              <View style={{ flex: 1 }}>
                <Button shit={'<'} 
                fontSize={50}
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
      if(!arr[_day].value[_index].selected && !arr[_day].value[_index].occupied){
        Alert.alert(
          'Order Cleaning',
          'ordering a cleaning appointment on the chosen date, please choose the size of the building you would like cleaned. (large: 5 hours, small: 4 hours)',
          [
            {text: 'Nevermind', onPress: () => this.setSelected(_day, _index)},
            {text: 'Large', onPress: () => this.setOrder(_day, _index, 5), style: 'cancel'},
            {text: 'Small', onPress: () => this.setOrder(_day, _index, 4)},
          ],
          { cancelable: true }
        )
      }
      arr[_day].value[_index].selected = !arr[_day].value[_index].selected;
      this.setState({ skeg: arr });
    }
  }

  setOrder(_day, _index, hours){
    
    console.log('setting order index: ' + _index);
    console.log('for day: ' + _day);
    console.log('of ' + hours + ' hours');
    if(_day < 7 && _index < 2 && _day >= 0 && _index >= 0){
      var arr = this.state.skeg;
      arr[_day].value[_index].order = hours;
      this.setState({ skeg: arr });
    }
  }

  
  renderScheduleButtons(){
    console.log('renderScheduleButtons');
    if(!this.state.skeg.length){
      return(
        <Spinner style={{ marginLeft: 50, marginRight: 50 }} />
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
    var bgCol1 = '#892e3c';
    var bgCol2 = '#892e3c';
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
          <Image source={{uri: 'https://image.ibb.co/kRGCqb/unnamed.png'}} style={styles.ImageStyle} />
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
    width: 165,
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
