import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text,Image } from "react-native";
import GoogleLogo from '../icons/google-.png';
import GreenBackground from "../Components/GreenBackground";
import * as Google from "expo-auth-session/providers/google";
import base64 from 'react-native-base64';
import AsyncStorage from "@react-native-async-storage/async-storage";
//const [userInfo, setUserInfo] = useState(null);

//client IDs from .env
// const config = {
//   androidClientId: Config.ANDROID_CLIENT_ID,
//   iosClientId: Config.IOS_CLIENT_ID,
//   webClientId: Config.WEB_CLIENT_ID,
// };

//const [request, response, promptAsync] = Google.useAuthRequest(config);



const Login = ({ navigation }) => {

    const ANDROID_CLIENT_ID='457222296603-f24r4dn3je9vsctojduvh8a55f01dcf5.apps.googleusercontent.com'
    const IOS_CLIENT_ID='457222296603-d9o7m2le03mov1r3h3o4ettlodekdkp9.apps.googleusercontent.com'
    const WEB_CLIENT_ID='457222296603-r8cej7d4qa3420a2du8gv59p9qkavc54.apps.googleusercontent.com'

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
        if (response?.type === 'success') {
          const { authentication } = response;
          const idToken = response.authentication.idToken;

          const tokenParts = idToken.split('.');
          const encodedPayload = tokenParts[1];

          const decodedPayload = base64.decode(encodedPayload);

          const payload = JSON.parse(decodedPayload.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''));

          const userEmail = payload.email;
          console.log('reponse', userEmail);
          navigation.navigate('Registration');

        }
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
