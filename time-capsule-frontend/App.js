import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Routes, Link } from "react-router-native";
import Login from "./Login"
import Background from './Background';

export default function App() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <Background>
          <Login />
        </Background>
      </View>
    </NativeRouter>
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
