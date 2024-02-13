import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { GlobalProvider, useGlobalContext } from './context/globalContext';

export default function App() {
  const { addUser } = useGlobalContext(); // Access addUser from the global context
  const [username, setUsername] = useState('');

  const handleAddUser = () => {
    addUser({ username }); // Call addUser with the input value
    setUsername(''); // Clear the text input after adding the user
  };

  return (
    <View style={styles.container}>
      <GlobalProvider>

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
          onPress={handleAddUser}
        />

        <StatusBar style="auto" />
      </GlobalProvider>
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
