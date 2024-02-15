import React, { useState } from "react";
import { StyleSheet, TextInput, Text, Platform, TouchableOpacity, Image } from "react-native";
import GreenBackground from "../Components/GreenBackground";

const Registration = ({ navigation }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState(false); 
    const [errorMsg, setErrorMsg] = useState('');

    const saveUsername = () => {
        let valid = true;
        if (text.length == 0) {
            valid = false;
            setErrorMsg('You must enter a username');
        }
        else if (false) { //TODO check to see username exists and store in database
            setErrorMsg('This username has been taken');
            valid = false;
        }

        if (valid) {
            //TODO store username
            navigation.navigate('TempMain');
            console.log('username', text);
        }
        else {
            console.log(errorMsg)
            setError(true)
        }
        
    }

    return (
        <GreenBackground>
            <Image style={styles.image} source={require('../icons/profile-.png')} />
            <TouchableOpacity style={styles.press} onPress={() => console.log('Set Profile')}>
                <Text  style={styles.text2}>Set Profile Picture</Text>
            </TouchableOpacity>
            <Text style={styles.text1}>Create Username</Text>
            <TouchableOpacity style={[styles.container1, error && styles.errorBorder]} title=''>
                <TextInput style={ (error) ? styles.entry1 : styles.entry} placeholder="Enter username" onChangeText={setText} value={text} />
            </TouchableOpacity>
            <Text style={styles.text3}>{errorMsg}</Text>
            <TouchableOpacity style={styles.container2} onPress={() => saveUsername()} title=''>
                <Text style={styles.text}>Continue to link Social Media</Text>
            </TouchableOpacity>
        </GreenBackground>
    );  
}

export default Registration;

const styles = StyleSheet.create({  
    container1: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 415, 
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
        borderColor: 'red',
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
    },
    container2: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 695, 
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
    },
    text: {
        position: 'absolute',
        left: '7%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    text1: {
        position: 'absolute',
        width: 20,
        height: 5,
        left: 89,
        top: 372,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    text2: {
        position: 'absolute',
        width: 318,
        height: 50,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    text3: {
        position: 'absolute',
        width: 318,
        height: 50,
        left: 47,
        top: 465,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 36,
        textAlign: 'left',
        color: '#FF0000',
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
    },
    press: {
        position: 'absolute',
        left: 29,
        top: 238,
    },
    entry: {
        left: '10%',
        height: 50,
        width: 250, 
        fontSize: 20,
        textAlignVertical: 'center',
    },
    image: {
        position: 'absolute',
        width: 212,
        height: 212,
        left: 82,
        top: 35,
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
    },
    errorBorder: {
        borderWidth: 3, // Change border color to red in case of error
    },
    entry1: {
        left: '10%',
        height: 45,
        width: 250, 
        fontSize: 20,
        textAlignVertical: 'center',
    },
});


