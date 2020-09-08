/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  Dimensions,
  RefreshControl, StyleSheet, ScrollView, ProgressBarAndroid,
  View, Text, Image, TouchableOpacity, ToastAndroid, Vibration, TextInput
} from 'react-native';

import { Header, Button, Title, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SoundPlayer from 'react-native-sound-player';
import Dialog from "react-native-dialog";

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
      temperature: null,
      humidity: null,
      isMontion: false,
      isLight: false,
      refreshing: false,
      loadingBar: false,
      isSelected: false,
      dialogVisible: false,
      valueIP: null
    }
  }

  async openDialog() {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    if (this.state.valueIP != null && this.state.valueIP.trim() != '') {
      if (this.validateIP(this.state.valueIP)) {
        this.setState({ dialogVisible: false, refreshing: true });
        this.loadData().then(this.setState({ refreshing: false }));
      } else {
        ToastAndroid.show('IP không đúng định dạng IPv4', 200);
        this.setState({ dialogVisible: true });
      }
    } else {
      ToastAndroid.show('Bạn phải nhập địa chỉ IP', 200);
      this.setState({ dialogVisible: true });
    }
  };

  async componentDidMount() {
    if (this.state.valueIP == null) {
      this.openDialog().then(() => {
        setInterval(() => {
          this.loadData();
        }, 1000);
      });
    }

  }

  async loadData() {
    if (this.state.valueIP != null) {
      var url = 'http://' + this.state.valueIP.trim() + '/current-status';
      fetch(url, {
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
            isOnFan: data.fan,
            temperature: data.temp,
            humidity: data.humid,
            isLight: data.day,
            isMontion: data.motion
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
          this.setState({
            status: false
          })
        })
    }
  }

  stopVibration() {
    if (this.state.isOnWarning) {
      fetch('http://' + this.state.valueIP.trim() + '/update-component?component=warning&state=0', {
        method: 'GET'
      })
        .then((res) => res.text())
        .then((resJSON) => {
          if (resJSON == 'Success') {
            this.setState({ isOnWarning: false })
            if (!this.state.isOnWarning) {
              Vibration.cancel();
              SoundPlayer.stop();
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
            loadingBar: false,
            status: false
          })
        })
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
    fetch('http://' + this.state.valueIP.trim() + '/update-component?component=' + componentName + '&state=' + stateDevice, {
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
          loadingBar: false,
          status: false
        })
      })
  }

  onChangeText(text) {
    if (text !== '' && text !== null) {
      this.setState({
        valueIP: text
      })
    } else {
      ToastAndroid.show('Bạn phải nhập địa chỉ IP', 200);
      this.setState({ dialogVisible: true });
    }
  }

  validateIP = (IP) => {
    var re = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return re.test(IP);
  };

  render() {
    const refreshing = this.state.refreshing;
    const windowHeight = Dimensions.get('window').height;
    return (
      <>
        <ScrollView style={styles.scrollView} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }>
          <View>
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
            <View>
              <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Nhập địa chỉ IP</Dialog.Title>

                <Dialog.Input onChangeText={text => this.onChangeText(text)}
                  style={{ borderBottomColor: "#AAA", borderBottomWidth: .7 }}></Dialog.Input>
                <Dialog.Button label="OK" onPress={this.handleCancel} />
              </Dialog.Container>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
                <View style={{ width: '100%', height: windowHeight / 4 }}>
                  {this.state.isLight ? <Image source={require('./src/image/nha.jpg')} style={styles.engine} /> : 
                  <Image source={require('./src/image/anh_den.jpg')} style={styles.engine} />}
                </View>
                <View style={styles.tempurate}>
                  <View>
                    <Text style={styles.text20}>Nhiệt độ: {this.state.temperature} độ</Text>
                    <Text style={styles.text20}>Độ ẩm: {this.state.humidity} %</Text>
                  </View>
                  <View>
                    <Text style={styles.text20}>{this.state.isLight ? 'Ban đêm' : 'Ban ngày'}</Text>
                    <Text style={styles.text20}>Chuyển động: {this.state.isMontion ? 'Không' : 'Có'}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.body}>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.update('light', this.state.isOnLight)}>
                        <Icon name="lightbulb" size={100} color={this.state.isOnLight ? '#e6e600' : '#AAA'} />
                        <Text style={styles.devices}>Đèn: {this.state.isOnLight ? 'Bật' : 'Tắt'}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.update('door', this.state.isOnDoor)}>
                        {this.state.isOnDoor ? <Icon name="door-open" size={100} color='#1aa3ff' /> :
                          <Icon name="door-closed" size={100} color='#AAA' />}
                        <Text style={styles.devices}>Cửa: {this.state.isOnDoor ? 'Mở' : 'Đóng'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.body}>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.stopVibration()} disabled={!this.state.isOnWarning}>
                        <Icon name="fire-extinguisher" size={100} color={this.state.isOnWarning ? '#1aa3ff' : '#AAA'} />
                        <Text style={styles.devices}>Báo cháy: {this.state.isOnWarning ? 'Cảnh báo' : 'Tắt'}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => this.update('fan', this.state.isOnFan)}>
                        <Icon name="radiation" size={100} color={this.state.isOnFan ? '#1aa3ff' : '#AAA'} />
                        <Text style={styles.devices}>Quạt: {this.state.isOnFan ? 'Bật' : 'Tắt'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {this.state.loadingBar ? <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" /> : <View></View>}
        <TouchableOpacity style={styles.ipInfo} onPress={() => this.openDialog()}>
          <Text style={{ color: 'white' }}>IP: {this.state.valueIP}</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={{ color: 'white' }}>---Do An Tot Nghiep---</Text>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    opacity: .7,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    flex: 1
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tempurate: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20
  },
  devices: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 5
  },
  sectionContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  ipInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "#e066ff",
    padding: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "#0066ff",
    padding: 15
  },
  text20: {
    fontSize: 20
  }
});

export default App;
