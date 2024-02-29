import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, FlatList, Keyboard} from "react-native";
import PageNavBar from "../Components/PageNavBar";
import BlackBackground from "../Components/BlackBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";

const Main = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={{ flex: 1 }} // Ensure the TouchableOpacity takes up the entire screen
            activeOpacity={1} // Ensure the TouchableOpacity is touchable
            onPress={() => Keyboard.dismiss()} // Dismiss the keyboard on press
        >
            <BlackBackground>
                <PageNavBar onBackPress={() => navigation.goBack()} title="Main Page"/>
                <View style={styles.tempTimeContainer}>
                    <Text style={styles.timerText}>28:17:50:39</Text>
                    <Text style={styles.unitText}>day       hour       min       sec</Text>
                </View>
                <View style={styles.capsuleList}/>
                <TextInput style={styles.momentButton}
                        placeholder="Enter Moment"
                        returnKeyType="done"/>
            </BlackBackground>
        </TouchableOpacity>
    );  
}

export default Main;

const styles = StyleSheet.create({
    tempTimeContainer: {
        position: 'absolute',
        flexDirection: 'column',
        width: 230,
        height: 70,
        left: 180,
        top: 130,
      },
    timerText: {
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 40,
        lineHeight: 45,
        textAlign: 'center',
        color: 'white',
      },
    unitText: {
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 18,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    momentButton: {
        position: 'absolute',
        left: '10%',
        top: '87%',
        width: '80%',
        height: 31,
        backgroundColor: 'rgba(255, 255, 255, 0.67)',
        borderRadius: 10,
    },
    capsuleList: {
        position: 'absolute',
        top: '30%',
        width: '100%',
        height: '50%',
        backgroundColor: '#8E8E8E',
        borderRadius: 20,
      },
});