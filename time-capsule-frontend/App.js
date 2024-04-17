import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Login from "./Screens/Login";
import TempMain from './Screens/TempMain';
import Registration from './Screens/Registration';
import Friends from './Screens/Friends';
import Profile from './Screens/Profile';
import Main from './Screens/Main';
import StoryBoard from './Screens/StoryBoard';
import History from './Screens/History';
import Spotify from './Screens/Spotify';
import Instagram from './Screens/Instagram';
import Photos from './Screens/Photos';
import Moment from './Screens/Moment';

import { GlobalProvider } from './context/globalContext';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <GlobalProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Spotify" component={Spotify} />
            <Stack.Screen name="Instagram" component={Instagram} />
            <Stack.Screen name="Friends" component={Friends} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Photos" component={Photos} />
            <Stack.Screen name="Moment" component={Moment} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}

function MainTabs() {
  const [isSwiping, setSwiping] = useState(false);

  const handleSwipeStart = () => {
    console.log('Swipe started');
    setSwiping(true);
  };

  const handleSwipeEnd = () => {
    console.log('Swipe ended');
    setSwiping(false);
  };

  return (
    <Tab.Navigator
      initialRouteName="Main"
      onSwipeStart={handleSwipeStart}
      onSwipeEnd={handleSwipeEnd}
      tabBarOptions={{
        showLabel: false,
        style: { height: 0 },
      }}
    >
      <Tab.Screen name="History">
        {props => <History {...props} isSwiping={isSwiping} />}
      </Tab.Screen>
      <Tab.Screen name="Main">
        {props => <Main {...props} isSwiping={isSwiping} />}
      </Tab.Screen>
      <Tab.Screen name="StoryBoard">
        {props => <StoryBoard {...props} isSwiping={isSwiping} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
