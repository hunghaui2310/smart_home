import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const DATA = {
    status: 0,
    door: 0,
    warning: 0,
    light: 0,
    fan: 0
}

const URL = 'http://192.168.1.123'

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            colorLight: this.props.colorLight,
            isOn: this.props.isOn,
            nameComponent: this.props.nameComponent
        }
    }

    // ham thay doi trang thai thiet bi
    update(componentName) {
        // neu dem chan thi tat thiet bi
        if (this.state.isOn) {
            this.setState({
                colorLight: '#AAA',
                isOn: false
            })
            fetch(URL + '/update-component?component=' + componentName + '&state=0', {
                method: 'GET'
            })
                .then((res) => res.text())
                .then((resJSON) => {
                    console.log(resJSON);
                    if (resJSON == 'Success') {
                        ToastAndroid.show('Đã tắt thiết bị', 20);
                    } else {
                        ToastAndroid.show('Thay đổi trạng thái thất bại', 20);
                    }
                })
                .catch((error) => {
                    ToastAndroid.show('Đã xảy ra lỗi ' + error , 200);
                })
        } else {
            this.setState({
                colorLight: '#1aa3ff',
                isOn: true
            })
            fetch(URL + '/update-component?component=' + componentName + '&state=1', {
                method: 'GET'
            })
                .then((res) => res.text())
                .then((resJSON) => {
                    if (resJSON == 'Success') {
                        ToastAndroid.show('Đã bật thiết bị', 20);
                    } else {
                        ToastAndroid.show('Thay đổi trạng thái thất bại', 20);
                    }
                })
                .catch((error) => {
                    ToastAndroid.show('Đã xảy ra lỗi ' + error , 200);
                })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.update(this.state.nameComponent)}>
                    <Icon name={this.props.nameIcon} size={100} color={this.state.colorLight} style={{ paddingBottom: 20 }} />
                </TouchableOpacity>
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