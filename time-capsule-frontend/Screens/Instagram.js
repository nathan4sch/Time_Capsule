import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text, Image, Linking } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import * as WebBrowser from 'expo-web-browser';
import { INSTAGRAM_SECRET } from '../env.js';


const Instagram = ({ navigation }) => {
    const { getUser, setCurUser, curUser, emailExist, setUserEmail } = useGlobalContext();

    const handleInstagramLogin = async () => {
        console.log("here");
        let redirectUrl = 'exp://localhost:19000/--/oauth2callback'; // Get the redirect URL
        let authUrl =
            `https://api.instagram.com/oauth/authorize` +
            `?client_id=956916255292975` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
            `&scope=user_profile,user_media` +
            `&response_type=code`;
    
        let result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
    
        if (result.type === 'success') {
            // Handle the authentication response here
            if (result.params.error) {
                console.error('Authentication error:', result.params.error);
            } else {
                // Extract the access token from the result
                let { code } = result.params;
                console.log(code);
                handleTokenRequest('956916255292975', INSTAGRAM_SECRET, redirectUrl, code);
                // Use the code to make further API calls or perform other tasks
            }
        }
    };
    
    const handleTokenRequest = async (clientId, clientSecret, redirectUri, code) => {
        try {
            const response = await fetch('https://api.instagram.com/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                    code: code,
                }).toString(),
            });
    
            const responseData = await response.json();
            const access_token = responseData.access_token;
            // Handle the response data
            console.log(access_token);
            handleTokenExchange(INSTAGRAM_SECRET, access_token);
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
        }
    };
     
    const handleTokenExchange = async (appSecret, shortLivedAccessToken) => {
        try {
            const response = await fetch(
                `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedAccessToken}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const responseData = await response.json();
            const longLivedAccessToken = responseData.access_token;
            // Handle the response data
            console.log(longLivedAccessToken);
            navigation.navigate("TempMain");
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
        }
    };

    return (
        <GreenBackground>
            <Image style={styles.capsule} source={require('../icons/capsule-.png')} />
            <TouchableOpacity style={styles.container} onPress={() => handleInstagramLogin()} title=''>
                <Text style={styles.text}>Link Instagram</Text>
                <Image style={styles.spotify} source={require('../icons/instagram-.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.press} onPress={() => navigation.navigate("TempMain")}>
                <Text style={styles.text2}>skip for now</Text>
            </TouchableOpacity>
        </GreenBackground>
    );
}

export default Instagram;

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
        left: '30%',
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
