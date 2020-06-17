import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const DATA = {
    status: 0,
    door: 0,
    warning: 0,
    light: 0,
    fan: 0
}

const URL = 'http://192.168.1.100'

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            colorLight: this.props.colorLight,
            demDen: 0,
            nameComponent: this.props.nameComponent
        }
    }

    loadData() {
        fetch(URL + '/current-status', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((resJSON) => {
                console.log(resJSON);
            })
            .catch((error) => {
                console.log('Đã xảy ra lỗi' + error);
            })
    }

    // ham thay doi trang thai thiet bi
    update(componentName) {
        var dem = this.state.demDen;
        dem += 1;
        // neu dem chan thi tat thiet bi
        if (dem % 2 == 0) {
            this.setState({
                colorLight: this.props.colorLight,
                demDen: dem
            })
            fetch(URL + '/update-component?component=' + componentName + '&status=0', {
                method: 'GET'
            })
                .then((res) => res.json())
                .then((resJSON) => {
                    console.log(resJSON);
                })
                .catch((error) => {
                    console.log('Đã xảy ra lỗi' + error);
                })
            
        }
        // neu dem le thi tat thiet bi 
        else {
            this.setState({
                colorLight: '#1aa3ff',
                demDen: dem
            })
            fetch(URL + '/update-component?component=' + componentName + '&status=1', {
                method: 'GET'
            })
                .then((res) => res.json())
                .then((resJSON) => {
                    console.log(resJSON);
                })
                .catch((error) => {
                    console.log('Đã xảy ra lỗi' + error);
                })
        
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.update(this.state.nameComponent)}>
                    <Icon name={this.props.nameIcon} size={100} color={this.state.colorLight} style={{ paddingBottom: 20 }} />
                </TouchableOpacity>
                {/* <ToggleSwitch
                    isOn={this.state.isOn}
                    onColor="#1aa3ff"
                    offColor="black"
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="large"
                    onToggle={() => this.onAlarm(this.state.isOn)}
                /> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 25,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Item;