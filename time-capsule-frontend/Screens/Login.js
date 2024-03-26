import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import * as Google from "expo-auth-session/providers/google";
import base64 from 'react-native-base64';
import { useGlobalContext } from "../context/globalContext";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '../env.js';
import axios from 'axios';

const BASE_URL = "https://time-capsule-server.onrender.com/";


const Login = ({ navigation }) => {
    const { getUser, setCurUser, curUser, emailExist, setUserEmail, setProfilePictureUrl, getUserbyID } = useGlobalContext();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        issuer: 'https://accounts.google.com',
        redirectUri: 'com.anonymous.timecapsule:/oauth2callback',
        // NOTE: For iOS, specify the scopes required
        scopes: ['email'],
    });

    React.useEffect(() => {
        const handleResponse = async () => {
            if (response?.type === 'success') {
                const { authentication } = response;
                const idToken = response.authentication.idToken;

                const tokenParts = idToken.split('.');
                const encodedPayload = tokenParts[1];

                const decodedPayload = base64.decode(encodedPayload);

                const payload = JSON.parse(decodedPayload.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''));
                const userEmail = payload.email; //contains email that is received, compare to mongo

                // Check if email is new or not
                const existResponse = await emailExist(userEmail);
                const newEmail = !existResponse.exists;
                setCurUser("")

                if (newEmail) {
                    setUserEmail(userEmail)
                    navigation.navigate('Registration');
                } else {
                    await setCurUser(existResponse.user)
                    //curUserHere = existResponse.user
                    //console.log(existResponse.user.profileSettings.profilePictureKey)
                    //console.log(existResponse.user.profileSettings.profilePictureUrl)
                    if (existResponse.user.profileSettings.profilePictureKey != "default") {
                        const urlRes = await axios.get(`${BASE_URL}api/get/${existResponse.user.profileSettings.profilePictureKey}`);
                        const url = urlRes.data.url
                        //console.log("New url: ", url)
                        //randomly breaks when the url expires
                        await setProfilePictureUrl(url);
                        user = await getUserbyID(existResponse.user._id)
                        await setCurUser(user)
                    }
                    navigation.navigate('Main');
                }
            }
        };

        handleResponse();
    }, [response]);

    return (
        <GreenBackground>
            <Image style={styles.capsule} source={require('../icons/capsule-.png')} />
            <TouchableOpacity style={styles.container} onPress={() => promptAsync()} title=''>
                <Text style={styles.text}>Sign in with Google</Text>
                <Image style={styles.google} source={require('../icons/google-.png')} />
            </TouchableOpacity>
        </GreenBackground>
    );
}

export default Login;

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
    container1: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 495,
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
    },
    text: {
        position: 'absolute',
        left: '25%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    google: {
        position: 'absolute',
        width: 35,
        height: 36,
        left: '3%',
        top: '13%',
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
/* Rectangle 1 */


