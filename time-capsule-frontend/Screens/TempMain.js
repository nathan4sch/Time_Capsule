import React from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable, TouchableOpacity } from "react-native";
import Background from "../Components/Background";

const Registration = ({ navigation }) => {
    return (
        <Background>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')} title=''>
                    <Text style={styles.text}>To Login Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')} title=''>
                    <Text style={styles.text}>To Profile Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Friends')} title=''>
                    <Text style={styles.text}>To Friends Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')} title=''>
                    <Text style={styles.text}>To Main Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StoryBoard')} title=''>
                    <Text style={styles.text}>To Story Board Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')} title=''>
                    <Text style={styles.text}>To History Page</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );  
}

export default Registration;

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    button: {
        width: 296,
        height: 50,
        marginBottom: 10, // Spacing between buttons
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
    text: {
        position: 'absolute',
        left: '15%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },

});








