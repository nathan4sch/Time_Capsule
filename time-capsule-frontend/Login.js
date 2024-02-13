import React from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable } from "react-native";
import { Image } from "react-native";
import GoogleLogo from './icons/google-.png';

export default () => {
    return (
        <Pressable style={styles.container} onPress={() => console.log("hello")} title=''>
            <Text style={styles.text}>Sign in with Google</Text>
            <Image source={require('./icons/google-.png')} />
        </Pressable>
    );  
}

const styles = StyleSheet.create({  
    container: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 695, 
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
    },
    text: {
        position: 'absolute',
        left: '35%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    google: {
        backgroundImage: `url(${GoogleLogo})`,
      },
});








