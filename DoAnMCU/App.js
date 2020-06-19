/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  RefreshControl, StyleSheet, ScrollView, ProgressBarAndroid,
  View, Text, Image, TouchableOpacity, ToastAndroid, Vibration
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Container, Header, Title, Content, Button, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SoundPlayer from 'react-native-sound-player';

const URL = 'http://192.168.1.164';
const ONE_SECOND_IN_MS = 1000;
const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      isOnDoor: false,
      isOnWarning: false,
      isOnLight: false,
      isOnFan: false,
      refreshing: false,
      loadingBar: false,
      isSelected: false
    }
  }

  // componentDidMount() {
  //   setInterval(() => {
  //     this.loadData();
  //   }, 3000);
  // }

  // componentWillUnmount() {
  //   this.loadData();
  // }

  async loadData() {
    console.log('Dang cap nhat...');
    fetch(URL + '/current-status', {
      method: 'GET',
    })
      .then(res => res.text())
      .then((resJSON) => {
        console.log(resJSON);
        var data = JSON.parse(resJSON);
        this.setState({
          status: true,
          isOnDoor: data.door,
          isOnLight: data.light,
          isOnWarning: data.warning,
          isOnFan: data.fan
        })
        if (data.warning == 1) {
          Vibration.vibrate(PATTERN, true);
          SoundPlayer.playSoundFile('chuong', 'mp3');
        } else {
          Vibration.cancel();
          SoundPlayer.stop();
        }
      })
      .catch((error) => {
        console.log('Lỗi ' + error);
      })
  }

  stopVibration() {
    if (this.state.isOnWarning) {
      Vibration.cancel();
      SoundPlayer.stop();
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadData().then(this.setState({ refreshing: false }));
  }

  update(componentName, isOn) {
    this.setState({
      loadingBar: true
    })
    var stateDevice;
    if (isOn) {
      stateDevice = 0;
    } else {
      stateDevice = 1;
    }
    fetch(URL + '/update-component?component=' + componentName + '&state=' + stateDevice, {
      method: 'GET'
    })
      .then((res) => res.text())
      .then((resJSON) => {
        if (resJSON == 'Success') {
          if (componentName == 'light') {
            this.setState({ isOnLight: !isOn });
          } else if (componentName == 'door') {
            this.setState({ isOnDoor: !isOn });
          } else if (componentName == 'warning') {
            this.setState({ isOnWarning: !isOn });
          } else {
            this.setState({ isOnFan: !isOn });
          }
          if (isOn) {
            ToastAndroid.show('Đã tắt thiết bị', 20);
          } else {
            ToastAndroid.show('Đã bật thiết bị', 20);
          }
        } else {
          ToastAndroid.show('Thay đổi trạng thái thất bại', 20);
        }
        this.setState({
          loadingBar: false
        })
      })
      .catch((error) => {
        ToastAndroid.show('' + error, 200);
        this.setState({
          loadingBar: false
        })
      })
  }

  render() {
    const refreshing = this.state.refreshing;
    return (
      <>
        <ScrollView style={styles.scrollView} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }>
          <Container>
            <Header>
              <Left>
                <Button transparent>
                  <Icon name='home' color="white" size={20} />
                </Button>
              </Left>
              <Body>
                <Title>Nhà thông minh</Title>
              </Body>
              <Right>
                <Text style={{ color: "white" }}>{this.state.status ? 'Đã kết nối' : 'Chưa kết nối'}</Text>
              </Right>
            </Header>
            <Content>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
                <View style={{ flex: 1 }}>
                  <Image source={require('./src/image/nha.jpg')} style={styles.engine} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.body}>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.update('light', this.state.isOnLight)}>
                        <Icon name="lightbulb" size={100} color={this.state.isOnLight ? '#1aa3ff' : '#AAA'} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.update('door', this.state.isOnDoor)}>
                        <Icon name="door-open" size={100} color={this.state.isOnDoor ? '#1aa3ff' : '#AAA'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.body}>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.stopVibration()} disabled={!this.state.isOnWarning}>
                        <Icon name="fire-extinguisher" size={100} color={this.state.isOnWarning ? '#1aa3ff' : '#AAA'} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.update('fan', this.state.isOnFan)}>
                        <Icon name="radiation" size={100} color={this.state.isOnFan ? '#1aa3ff' : '#AAA'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Content>
          </Container>
        </ScrollView>
        {this.state.loadingBar ? <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" /> : <View></View>}
        <View style={styles.footer}>
          <Text style={{ color: 'white' }}>---Do An Tot Nghiep---</Text>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    opacity: .8
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sectionContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "#0066ff",
    padding: 15
  },
});

export default App;
