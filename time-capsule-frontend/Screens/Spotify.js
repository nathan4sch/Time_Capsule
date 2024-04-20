import React from "react";
import { Platform, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import { spotifyLogin } from "../utils/spotifyLogin";

const Spotify = ({ navigation }) => {
    const { getUser, setCurUser, curUser, emailExist, setUserEmail, setSpotify } = useGlobalContext();
    

    return (
        <GreenBackground>
            <Image style={styles.capsule} source={require('../icons/capsule-.png')} />
            <TouchableOpacity style={styles.container} onPress={() => spotifyLogin({ navigation, page: "MainTabs", setSpotify })} title=''>
                <Text style={styles.text}>Link Spotify</Text>
                <Image style={styles.spotify} source={require('../icons/spotify-.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.press} onPress={() => navigation.navigate('MainTabs')}>
                <Text style={styles.text2}>skip for now</Text>
            </TouchableOpacity>
        </GreenBackground>
    );
}

export default Spotify;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 442,
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
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
        left: '35%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    spotify: {
        position: 'absolute',
        width: 47,
        height: 47,
        left: '2%',
        top: '3%',
    },
    text2: {
        position: 'absolute',
        width: 318,
        height: 50,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    press: {
        position: 'absolute',
        left: 29,
        top: 765,
    },
    capsule: {
        position: 'absolute',
        width: 425,
        height: 183,
        left: -18,
        top: 56,
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
    }
});
