import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {
  const [username, setUsername] = useState('');

  const addUser = () => {
    // Implement your addUser logic here
    console.log(`Adding user: ${username}`);
    
    // Clear the text input after adding the user
    setUsername('');
  };

  return (
    <View style={styles.container}>
      
      {/* Text Input for Username */}
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />

      {/* Button to Add User */}
      <Button
        title="Add User"
        onPress={addUser}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
});
