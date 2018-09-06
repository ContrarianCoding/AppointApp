import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableHighlight, Alert } from 'react-native';
import { Header, Card, CardItem, Button, LoginForm, Spinner, WeakView, Input } from './';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';

class FirebaseScheduler extends Component {
  state = { servers: [], clients: [], appointments: [], orders: [], chosenOrder: '', servCand: {}, clieCand: {}, ordCand: {}, error: '' }

  FirebaseScheduler(){
    console.log("FirebaseScheduler");
    // var serverlistref = firebase.database().ref('servers');
    // serverlistref.on('child_added', function(data) {
    //   var serverID = data.key;
    //   var serverName = data.val().name;
    //   var serverImage = data.val().pic;
    //   this.state.servers.push({ id: serverID, name: serverName, pic: serverImage });
    // });

    // serverlistref.on('child_changed', function(data) {
    //   var serverID = data.key;
    //   var serverName = data.val().name;
    //   var serverImage = data.val().pic;

    //   var index = findInList(data.key, this.state.servers);
    //   var start = this.state.servers.slice(0, index - 1);
    //   var end = this.state.servers.slice(index);
    //   start.push({ id: serverID, name: serverName, pic: serverImage });
    // });
  }

  //logic only
  loadAll() {
    console.log("loadAll");
    this.loadServers();
    this.loadClients();
    this.loadOrders();
    this.loadAppointments();
  }

  findInList(key, list){
    var curindex = 0;
    var index = -1;
    list.forEach(function(elem) {
      var thiskey = elem.id;
      if(thiskey == key) index = curindex;
      curindex = curindex + 1;
    });
    return index;
  }

  loadServers(){
    console.log("loadServers");
    var serverlistref = firebase.database().ref('servers').once('value').then((snapshot) => {
      var serverlist = [];
      snapshot.forEach(function(childSnapshot) {
        var serverID = childSnapshot.key;
        var serverName = childSnapshot.val().name;
        var serverImage = childSnapshot.val().pic;
        serverlist.push({ id: serverID, name: serverName, pic: serverImage });
      });
      this.state.servers = serverlist;
    });
    return this.state.servers;
  }

  getServers(){
    return this.state.servers;
  }

  loadClients(){
    var clientlistref = firebase.database().ref('clients/').once('value').then((snapshot) => {
      var clientlist = [];
      snapshot.forEach(function(childSnapshot) {
        var clientID = childSnapshot.key;
        var clientFirstName = childSnapshot.val().FirstName;
        var clientPhone = childSnapshot.val().phoneNum;
        clientlist.push({ id: clientID, name: clientFirstName, pic: clientPhone });
      });
      this.state.clients = clientlist;
      return clientlist;
    });
  }

  getClients(){
    return this.state.clients;
  }

  loadAppointments(){
    console.log("loadAppointments");
    var serverlistref = firebase.database().ref('appointments').once('value').then((snapshot) => {
      var serverlist = [];
      snapshot.forEach(function(childSnapshot) {
        var appID = childSnapshot.key;
        var appointmentClient = childSnapshot.val().clientID;
        var appointmentServer = childSnapshot.val().serverID;
        var appDate = new Date(childSnapshot.val().date);
        var appNote = childSnapshot.val().note;
        var appointmentLocation = childSnapshot.val().location;
        serverlist.push({ id: appID, client: appointmentClient, server: appointmentServer, loc: appointmentLocation, date: appDate, note: appNote });
      });
      this.state.appointments = serverlist;
    });
    return this.state.appointments;
  }

  getAppointments(){
    return this.state.appointments;
  }


  loadOrders(){
    console.log("loadOrders");
    var orderlistref = firebase.database().ref('orders/').once('value').then((snapshot) => {
      var orderlist = [];
      snapshot.forEach(function(childSnapshot) {
        var orderID = childSnapshot.key;
        var clientID = childSnapshot.val().clientID;
        var orderDate = new Date(childSnapshot.val().date);
        var orderLocation = childSnapshot.val().location;
        var orderNote = childSnapshot.val().note;
        orderlist.push({ id: orderID, client: clientID, date: orderDate, loc: orderLocation, note: orderNote });
      });
      this.state.orders = orderlist;
      return orderlist;
    });
  }

  getOrders(){
    return this.state.orders;
  }

  isServerAppointment(serverID){
    return ((app) => {
      return app.server == serverID;
    });
  }

  isDateAppointment(date){
    return ((app) => {
      return this.isSameDate(app.date)(date);
    });
  }

  isSameDate(date){
    return ((otherDate) => {
      var retval = true;
      retval = retval && date.getFullYear() == otherDate.getFullYear();
      retval = retval && date.getMonth() == otherDate.getMonth();
      retval = retval && date.getDate() == otherDate.getDate();
      return retval;
    });
  }

  getServerAppointment(servers, apps) {
    var servApps = [];
    servers.forEach((server) => {
      var servCur = apps.filter(this.isServerAppointment(server.id));
      servApps.push(servCur);
    });
    return servApps;
  }

  getDateApps(date, apps) {
    var dateApps = apps.filter(this.isDateAppointment(date));
    return dateApps;
  }

  isFree(date) {
    var servApps = this.getServerAppointment(this.state.servers, this.state.appointments);
    var res = false;
    servApps.forEach((serverApps, index) => {
      var servDayApps = serverApps.filter(this.isDateAppointment(date));
      if(servDayApps.length == 0) res = true;
    });
    return res;
  }
  
  createServer(phoneNum, name, password, title, email, pic, rating){
    phoneNum = phoneNum || '';
    name = name || '';
    password = password || '';
    title = title || '';
    email = email || '';
    pic = pic || '';
    rating = rating || '';
    var newPostKey = firebase.database().ref('servers/').push().key;
    firebase.database().ref('servers/' + newPostKey).set({
      phoneNum: phoneNum, 
      name: name, 
      password: password, 
      title: title, 
      email: email, 
      pic: pic, 
      rating: rating
    });
  }


  renderOrder(ord){
    return(
        <CardItem key={ord.key}>
            {this.renderButton(
              (() => {
                this.state.ordCand = ord;
                console.log("chose order");
                console.log(ord.id);
            }).bind(this),
            ord.date.getDate()
            )}
        </CardItem>
      );
  }

  renderServer(serv){
    return(
        <CardItem key={serv.key}>
            {this.renderButton(
              (() => {
                console.log("making appointment");
                console.log("with order");
                console.log(this.state.ordCand.date.getDate());
                console.log("and server");
                console.log(serv.name);
                this.createAppointment(this.state.ordCand, serv.id);
                this.state.ordCand = {};
            }).bind(this),
            serv.id
            )}
        </CardItem>
      );
  }

  renderOrderList(){
    return this.state.orders.map(val =>
       <View key={val.key} style={styles.containerDayStyle}>
        {this.renderOrder(val)}
      </View>
    );
  }

  renderServerList(){
    return this.state.servers.map(val =>
      <View key={val.key} style={styles.containerDayStyle}>
        {this.renderServer(val)}
      </View>
    );
  }

  managerAssignmentScreen(){
    console.log("managerAssignmentScreen");
    console.log(this.state.ordCand);
    console.log(this.state.orders.length);
    console.log(this.state.servers.length);
    if(Object.getOwnPropertyNames(this.state.ordCand).length > 0){
      return(
        <View>
          <Card>
            {this.renderServerList()}
          </Card>
        </View>
      );
    }
    else{
      return(
        <View>
          <Card>
            {this.renderOrderList()}
          </Card>
        </View>
      );
    }
  }

  renderButton(onPressMethod, text) {
    if(this.state.loading){
      return(<Spinner size="small" />);
    }
    return(
      <Button
        shit={text}
        onPress={onPressMethod.bind(this)}
        fontSize={20}
        />
      );
  }

  createClient(fName, lName, email, password, phoneNum){
    fName = fName || '';
    lName = lName || '';
    password = password || '';
    email = email || '';
    phoneNum = phoneNum || '';
    var myUserId = firebase.auth().currentUser.uid;
    firebase.database().ref('clients/' + myUserId).set({
      FirstName: fName,
      LastName: lName,
      email: email,
      password: password,
      phoneNum : phoneNum
    });
  }

  createAppointment(order, serverID){
    var orderref = firebase.database().ref('orders/' + order.id);
    var clientID = order.client;
    var date = order.date;
    var location = order.loc;
    var note = order.note;
    var id = order.id;
    orderref.remove();
    firebase.database().ref('appointments/' + id).set({
      clientID: id,
      date: date.toString(),
      location: location,
      note : note,
      serverID: serverID
    });
  }

  createOrder(date, location, note){
    date = date || '';
    location = location || '';
    note = note || '';
    var myUserId = firebase.auth().currentUser.uid;
    var newPostKey = firebase.database().ref('orders/').push().key;
    console.log('date is:');
    console.log(date);
    console.log('state is:');
    console.log(this.state.ordCand.note);
    console.log(newPostKey);
    firebase.database().ref('orders/' + newPostKey).set({
      clientID: myUserId,
      date: date.toString(),
      location: location,
      note : note
    });
  }


  createOrderAPI(){
    return(
    <View>
        <Card>
          <CardItem>
            <Input
            label='Note'
            value={this.state.ordCand.note}
            placeholder='pro note'
            onChangeText={text => {
              let ordCand = {...this.state.ordCand};
              ordCand.note = text;
              this.state.ordCand = ordCand;
            }}
            />
          </CardItem>
          <CardItem>
            <Input
            label='Days'
            value={this.state.ordCand.note}
            placeholder='pro note'
            onChangeText={text => {
              let ordCand = {...this.state.ordCand};
              ordCand.days = text;
              this.state.ordCand = ordCand;
            }}
            />
          </CardItem>
          <Text
          style={styles.errorStyle}>
          {this.state.error}
          </Text>
          <CardItem>
            {this.renderButton(
              (() => {
                var today = new Date();
                today.setDate(today.getDate() + parseInt(this.state.ordCand.days));
                this.createOrder(today, '2, -2', this.state.ordCand.note);
            }).bind(this),
            "Create order"
            )}
          </CardItem>
        </Card>
        <Prompt
            title="Confirm Phone Number"
            placeholder="Your SMS code"
            defaultValue="####"
            visible={false}
            onCancel={() => this.setState({ promptVisible: false })}
            onSubmit={(value) => this.setState({ promptVisible: false })}/>
    </View>
    );
  }

  createServerAPI(){
    return(
    <View>
        <Card>
          <CardItem>
            <Input
            label='Name'
            value={this.state.servCand.name}
            placeholder='pro name'
            onChangeText={text => {
              let servCand = {...this.state.servCand};
              servCand.name = text;
              this.setState({ servCand });
            }}
            />
          </CardItem>
          <CardItem>
            <Input
            label='Password'
            value={this.state.servCand.password}
            placeholder='pro pass'
            onChangeText={text => {
              let servCand = {...this.state.servCand};
              servCand.password = text;
              this.setState({ servCand });
            }}
            />
          </CardItem>
          <CardItem>
            <Input
            label='Phone #'
            value={this.state.servCand.phoneNum}
            placeholder='pro phone'
            onChangeText={text => {
              let servCand = {...this.state.servCand};
              servCand.phoneNum = text;
              this.setState({ servCand });
            }}
            />
          </CardItem>
          <CardItem>
            <Input
            label='Email'
            value={this.state.servCand.email}
            placeholder='pro email'
            onChangeText={text => {
              let servCand = {...this.state.servCand};
              servCand.email = text;
              this.setState({ servCand });
            }}
            />
          </CardItem>
          <CardItem>
            <Input
            label='Title'
            value={this.state.servCand.title}
            placeholder='pro title'
            onChangeText={text => {
              let servCand = {...this.state.servCand};
              servCand.title = text;
              this.setState({ servCand });
            }}
            />
          </CardItem>
          <CardItem>
            <Input
            label='Picture'
            value={this.state.servCand.pic}
            placeholder='pro pic'
            onChangeText={text => {
              let servCand = {...this.state.servCand};
              servCand.pic = text;
              this.setState({ servCand });
            }}
            />
          </CardItem>
          <Text
          style={styles.errorStyle}>
          {this.state.error}
          </Text>
          <CardItem>
            {this.renderButton(
              (() => {
                this.createServer(this.state.servCand.phoneNum, this.state.servCand.name, this.state.servCand.password, this.state.servCand.title, this.state.servCand.email, this.state.servCand.pic, 10);
            }).bind(this),
            "Create server"
            )}
          </CardItem>
        </Card>
        <Prompt
            title="Confirm Phone Number"
            placeholder="Your SMS code"
            defaultValue="####"
            visible={false}
            onCancel={() => this.setState({ promptVisible: false })}
            onSubmit={(value) => this.setState({ promptVisible: false })}/>
    </View>
    );
  }

  //match order to server

  renderPC(){
    return(
      <View style={styles.containerPCStyle}>
        <Text style={styles.titlePCStyle}>
          Choose Cleaner
        </Text>
        <CardItem>
          {this.renderPCBody()}
        </CardItem>
      </View>
    );
  }

  renderPCBody(){
    return this.state.servers.map(val =>
      {this.renderProvider(val)}
    );
  }

  renderProvider(val){
    console.log(val.name);
    console.log(val.pic);
    return(
      <TouchableHighlight
      underlayColor={'red'}
      onPress={() => {
        this.createAppointment(val.id, this.state.orderID);
      }}>
        <View key={val.name} style={styles.tabStyle} >
          <Image source={{uri: val.pic}} style={styles.ImageStyle} />
          <Text style={styles.titleStyle}>
          {val.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderBlock(occupied, selected){
    var bgCol = '#444444';
    if(!occupied){
      if(selected){
        bgCol = '#f0ff00';
      }
      else{
        bgCol = '#333333';
      }
    }
    return(
      <View style={styles.blockStyle} backgroundColor={bgCol} width={this.state.width} height={this.state.height/36}>
      </View>
    );
  }

  
  renderDay(){
    return this.state.skeg.map(val =>
      <View key={val.index} style={styles.containerDayStyle}>
        {this.renderBlock(val.occupied, val.selected)}
      </View>
    );
  }

  renderDays(){
    return(
      <View style={styles.containerDayStyle}>
        <Text style={styles.titleDayStyle}>
          {this.state.date}
        </Text>
        <View style={styles.containerDayStyle}>
          {this.renderDay()}
        </View>
      </View>
    );
  }
}

const styles = {

  containerPCStyle: {
    height: 100,
    width: null,
    alignItems: 'center'
  },

  tabStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
      marginBottom: 5,
      marginTop: 5
  },

  titlePCStyle: {
    fontSize: 15,
    fontFamily: 'sans-serif-thin',
    color: '#E1FCFF',
    marginBottom: 5
  },

  ImageStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    height: 30,
    width: 30,
    borderColor: '#E1FCFF',
    borderWidth: 2
  },

  containerDayStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  blockStyle: {
    height: null,
    width: null,
    marginBottom: 1,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 1
  },

  titleDayStyle: {
    fontSize: 15,
    fontFamily: 'sans-serif-thin',
    color: '#E1FCFF',
    marginBottom: 2
  },

  markTextStyle: {
    fontSize: 7,
    fontFamily: 'sans-serif-thin',
    color: '#E1FCFF',
    marginTop: 4,
    marginBottom: 4
  },

  errorStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};

export { FirebaseScheduler };