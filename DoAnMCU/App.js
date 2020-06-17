/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Image, TouchableOpacity, ToastAndroid
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Item from './src/components/Item';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

const DATA = {
  status: 0,
  door: 0,
  warning: 0,
  light: 0,
  fan: 0
}

const URL = 'http://192.168.1.123';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      colorDoor: '#AAA',
      colorWarning: '#AAA',
      colorLight: '#AAA',
      colorFan: '#AAA',
      isOnDoor: false,
      isOnWarning: false,
      isOnLight: false,
      isOnFan: false
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.loadData();
    }, 1000);
  }

  loadData() {
    fetch(URL + '/current-status', {
      method: 'GET',
    })
      .then(res => {
        if (res.status == 200) {
          this.setState({
            status: 1
          })
        }
        return res.text();
      })
      .then((resJSON) => {
        var data = JSON.parse(resJSON);
        if (data.door == 1) {
          // console.log('da cap nhat door', data.door);
          this.setState({
            colorDoor: '#1aa3ff',
            isOnDoor: true
          })
        }
        if (data.warning == 1) {
          this.setState({
            colorWarning: '#1aa3ff',
            isOnWarning: true
          })
        }
        if (data.light == 1) {
          this.setState({
            colorLight: '#1aa3ff',
            isOnLight: true
          })
        }
        if (data.fan == 1) {
          this.setState({
            colorFan: '#1aa3ff',
            isOnFan: true
          })
        }
      })
      .catch((error) => {
        ToastAndroid.show('Đã xảy ra lỗi ' + error, 200);
        this.setState({
          status: false,
        })
      })
  }

  render() {
    return (
      <>
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
            <View>
              <View>
                <Image source={require('./src/image/nha.jpg')} style={styles.engine} />
              </View>
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="lightbulb" nameComponent="light" isOn={this.state.isOnLight}
                    colorLight={this.state.colorLight}/>
                </View>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="door-open" nameComponent="door" isOn={this.state.isOnDoor}
                    colorLight={this.state.colorDoor} />
                </View>
              </View>
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="fire-extinguisher" nameComponent="warning" isOn={this.state.isOnWarning}
                    colorLight={this.state.colorWarning} />
                </View>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="radiation" nameComponent="fan" isOn={this.state.isOnFan}
                    colorLight={this.state.colorFan} />
                </View>
              </View>
            </View>
          </Content>
          <Footer>
            <FooterTab>
              <Button full>
                <Text style={{ color: "white" }}>-- Do An Tot Nghiep --</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
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
    padding: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  btnConnect: {
    padding: 8,
    backgroundColor: "#0000cc"
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
