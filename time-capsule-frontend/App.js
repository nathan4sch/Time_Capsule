import { StyleSheet, Linking, Text, View } from 'react-native';
import Login from "./Screens/Login"
import { NavigationContainer } from '@react-navigation/native';
import TempMain from './Screens/TempMain';
import Registration from './Screens/Registration';
import Friends from './Screens/Friends';
import Profile from './Screens/Profile';
import Main from './Screens/Main';
import StoryBoard from './Screens/StoryBoard';
import History from './Screens/History';
import Spotify from './Screens/Spotify';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react'
import { GlobalProvider, useGlobalContext } from './context/globalContext';


const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    // Add event listener to handle deep linking
    const handleDeepLink = async (event) => {
      const { path, queryParams } = Linking.parse(event.url);
      // Check if the path matches your redirect URI
      if (path === '/oauthSpotify') {
        // Extract authorization code from query parameters
        const code = queryParams.code;
        // Call function to handle token exchange
        await getToken(code);
        // Navigate to the desired screen after successful login
        navigation.navigate('Spotify'); // Replace 'Home' with the name of your screen
      }
    };

    // Subscribe to deep linking events
    Linking.addEventListener('url', handleDeepLink);

    // Clean up event listener
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  const global = useGlobalContext()
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TempMain" component={TempMain} options={{ headerLeft: null }} />
          <Stack.Screen name="Login" component={Login} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="Registration" component={Registration} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="Spotify" component={Spotify} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="Friends" component={Friends} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="Main" component={Main} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="StoryBoard" component={StoryBoard} options={{ headerLeft: null, gestureEnabled: false }} />
          <Stack.Screen name="History" component={History} options={{ headerLeft: null, gestureEnabled: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});