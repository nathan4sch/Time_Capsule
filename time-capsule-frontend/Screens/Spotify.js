import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text, Image, Linking } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import base64 from 'react-native-base64';
import * as WebBrowser from 'expo-web-browser';

const Spotify = ({ navigation }) => {
    const { getUser, setCurUser, curUser, emailExist, setUserEmail, setSpotify } = useGlobalContext();
    const base64encode = (input) => {
        return base64.encode(input)
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * possible.length);
            randomString += possible.charAt(randomIndex);
        }
        return randomString;
    };

    const client_id = '5a58784e6d234424b485e4add1ea7166';
    const client_secret = 'secret'; //TODO: need to probably store in Mongo and the request?s
    const redirect_uri = 'exp://localhost:19000/--/oauth2callback';
    const scope = 'user-read-private user-read-email';
    const state = generateRandomString(16);

    const skipToInsta = () => {
        //TODO: store null or something for refresh token because user didn't link spotify
        navigation.navigate('Instagram');
    }

    const spotifyLogin = async () => {
        let authUrl =
            `https://accounts.spotify.com/authorize?` +
            `client_id=${client_id}` +
            `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent(scope)}` +
            `&state=${state}`;

        let result = await WebBrowser.openAuthSessionAsync(authUrl, redirect_uri);

        if (result.type === 'success' && result.url) {
            const responseUrl = decodeURIComponent(result.url);
            const urlParams = new URLSearchParams(responseUrl.split('?')[1]);
            const code = urlParams.get('code');
            const returnedState = urlParams.get('state');

            if (returnedState !== state) {
                console.error('State mismatch!');
                return;
            }

            const base64Credentials = base64encode(`${client_id}:${client_secret}`);

            const authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${base64Credentials}`
                },
                body: `code=${code}&redirect_uri=${encodeURIComponent(redirect_uri)}&grant_type=authorization_code`
            };

            fetch(authOptions.url, {
                method: authOptions.method,
                headers: authOptions.headers,
                body: authOptions.body
            })
                .then(response => response.json())
                .then(data => {
                    //TODO: store the refresh token in MongoDB
                    setSpotify(data.refresh_token)
                    navigation.navigate('Instagram');
                })
                .catch(error => {
                    console.error(error);
                });

        };
    }

    return (
        <GreenBackground>
            <Image style={styles.capsule} source={require('../icons/capsule-.png')} />
            <TouchableOpacity style={styles.container} onPress={() => spotifyLogin()} title=''>
                <Text style={styles.text}>Link Spotify</Text>
                <Image style={styles.spotify} source={require('../icons/spotify-.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.press} onPress={() => skipToInsta()}>
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
