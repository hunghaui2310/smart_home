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
  StatusBar, Image
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

const URL = 'http://192.168.1.100';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      colorDoor: false,
      colorWarning: false,
      colorLight: false,
      colorFan: false
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch(URL + '/current-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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
        console.log(resJSON);
        var data = JSON.parse(resJSON);
        if (data.door == 1) {
          this.setState({
            colorDoor: true
          })
        }
        if (data.warning == 1) {
          this.setState({
            colorWarning: true
          })
        }
        if (data.light == 1) {
          this.setState({
            colorLight: true
          })
        }
        if (data.fan == 1) {
          this.setState({
            colorFan: true
          })
        }
      })
      .catch((error) => {
        console.log('Đã xảy ra lỗi' + error);
        this.setState({
          status: false
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
                <Icon name='home' color="white" />
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
                  <Item nameIcon="lightbulb" nameComponent="light"
                    colorLight={this.state.colorLight ? '#1aa3ff' : 'black'} />
                </View>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="door-open" nameComponent="door"
                    colorLight={this.state.colorDoor ? '#1aa3ff' : 'black'} />
                </View>
              </View>
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="fire-extinguisher" nameComponent="warning"
                    colorLight={this.state.colorWarning ? '#1aa3ff' : 'black'} />
                </View>
                <View style={styles.sectionContainer}>
                  <Item nameIcon="radiation" nameComponent="fan"
                    colorLight={this.state.colorFan ? '#1aa3ff' : 'black'} />
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
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
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
