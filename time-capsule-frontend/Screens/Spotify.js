import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text, Image, Linking } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import Sha256 from '../util/sha256.js';
import base64 from 'react-native-base64';
import * as WebBrowser from 'expo-web-browser';

const Spotify = ({ navigation }) => {
    const { getUser, setCurUser, curUser, emailExist, setUserEmail } = useGlobalContext();

    const spotifyLogin = async () => {
        // const generateRandomString = (length) => {
        //     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //     const values = crypto.getRandomValues(new Uint8Array(length));
        //     return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        //   }
        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * possible.length);
              randomString += possible.charAt(randomIndex);
            }
            return randomString;
          };
          
        const codeVerifier  = generateRandomString(64);

        const hash = Sha256.hash(codeVerifier)
        const codeChallenge = base64.encode(hash);
    
        const clientId = '5a58784e6d234424b485e4add1ea7166';
        const redirectUri = 'com.anonymous.timecapsule:/oauthSpotify';
    
        const scope = 'user-read-private user-read-email';
        const authUrl = new URL("https://accounts.spotify.com/authorize")
    
        // generated in the previous step
    
        const params =  {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        //const queryParams = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`;
        //Linking.openURL(`https://accounts.spotify.com/authorize?${queryParams}`);

        //const redirect = await Linking.getInitialURL('/');
        const queryParams = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`;
        const result = await WebBrowser.openAuthSessionAsync(`https://accounts.spotify.com/authorize?${queryParams}`);
        if (result.type === 'success') {
            const { code } = result.params;
            console.log('code: ')
            console.log(code);
            const tokens = await getToken(code, codeVerifier);
            this.setState(tokens);
        }
    
        // authUrl.search = new URLSearchParams(params).toString();
        // window.location.href = authUrl.toString();
    
        // const urlParams = new URLSearchParams(window.location.search);
        // let code = urlParams.get('code');

        //getToken(code, codeVerifier);

    }

    const getToken = async (code, codeVerifier) => {      
        const payload = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        }
      
        const body = await fetch(url, payload);
        const response =await body.json();
      
        console.log(response);
      }

    return (
        <GreenBackground>
            <Image style={styles.capsule} source={require('../icons/capsule-.png')} />
            <TouchableOpacity style={styles.container} onPress={() => spotifyLogin()} title=''>
                <Text style={styles.text}>Link Spotify</Text>
                <Image style={styles.spotify} source={require('../icons/spotify-.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.press} onPress={() => 1}>
                    <Text  style={styles.text2}>skip for now</Text>
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
/* Rectangle 1 */


