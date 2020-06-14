/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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

const App: () => React$Node = () => {
  return (
    <>
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='home' color="white"/>
            </Button>
          </Left>
          <Body>
            <Title>Nhà thông minh</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            <Image source={require ('./src/image/nha.jpg')} style={styles.engine}/>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Item nameIcon="lightbulb" />
            </View>
            <View style={styles.sectionContainer}>
              <Item nameIcon="door-open" />
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Item nameIcon="fire-extinguisher" />
            </View>
            <View style={styles.sectionContainer}>
              <Item nameIcon="radiation"/>
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
    justifyContent: "space-around"
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
