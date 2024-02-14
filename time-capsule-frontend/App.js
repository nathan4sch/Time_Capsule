import { StyleSheet, Switch, Text, View } from 'react-native';
import Login from "./Screens/Login"
import {NavigationContainer} from '@react-navigation/native';
import TempMain from './Screens/TempMain';
import Registration from './Screens/Registration';
import Friends from './Screens/Friends';
import Profile from './Screens/Profile';
import Main from './Screens/Main';
import StoryBoard from './Screens/StoryBoard';
import History from './Screens/History';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react'


const Stack = createNativeStackNavigator();

export default function App() {
  const [username, setUsername] = useState('');

  const addUser = () => {
    // Implement your addUser logic here
    console.log(`Adding user: ${username}`);
    
    // Clear the text input after adding the user
    setUsername('');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TempMain" component={TempMain} options={{ headerLeft: null }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerLeft: null, gestureEnabled: false }}/>
        <Stack.Screen name="Registration" component={Registration} options={{ headerLeft: null, gestureEnabled: false }}/>
        <Stack.Screen name="Friends" component={Friends} options={{ headerLeft: null, gestureEnabled: false }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ headerLeft: null, gestureEnabled: false }}/>
        <Stack.Screen name="Main" component={Main} options={{ headerLeft: null, gestureEnabled: false }}/>
        <Stack.Screen name="StoryBoard" component={StoryBoard} options={{ headerLeft: null, gestureEnabled: false }}/>
        <Stack.Screen name="History" component={History} options={{ headerLeft: null, gestureEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
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
