import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import GoogleLogo from '../icons/google-.png';
import GreenBackground from "../Components/GreenBackground";
import * as Google from "expo-auth-session/providers/google";
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

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        // NOTE: For iOS, specify the scopes required
        scopes: ['email'],
      });
    
      React.useEffect(() => {
        // Handle authentication response
        if (response?.type === 'success') {
          const { id_token } = response.params;
          // Store the ID token in AsyncStorage or wherever you want
          AsyncStorage.setItem('google_id_token', id_token);    
        }
      }, [response]);
      console.log(response)
	return (
        <GreenBackground>
            <TouchableOpacity style={styles.container1} onPress={() => navigation.navigate('Registration')} title=''>
                <Text style={styles.text}>To Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => promptAsync()} title=''>
                <Text style={styles.text}>Sign in with Google</Text>
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








