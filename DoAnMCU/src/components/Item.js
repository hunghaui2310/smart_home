import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOn: false,
            colorLight: 'black',
            demDen: 0
        }
    }

    onAlarm(isOn) {
        var dem = this.state.demDen;
        dem += 1;
        if (dem % 2 == 0) {
            this.setState({
                isOn: !isOn,
                colorLight: 'black',
                demDen: dem
            })
        } else {
            this.setState({
                isOn: !isOn,
                colorLight: '#1aa3ff',
                demDen: dem
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.onAlarm(this.state.isOn)}>
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