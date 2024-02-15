import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";

const Registration = ({ navigation }) => {
    const { userEmail, getUser, addUser, setCurUser } = useGlobalContext();
    const [username, setUsername] = useState('');

    const handleSubmission = async () => {
        // Perform actions with the username, such as storing it
        const curUsername = username
        setUsername('');

        //check if username already exists, if so push error and try again
        const usernameExist = await getUser(curUsername)

        if (usernameExist !== null) {
            Alert.alert("Error", "Username already exists. Please choose another username.");
        } else {
            //create the user, for now go back to navigation screen
            await addUser(curUsername, userEmail)
            Alert.alert("Success", "Account Created");
            const findUser = await getUser(curUsername)
            setCurUser(findUser)
            navigation.navigate('TempMain');

        }
    };

    return (
        <GreenBackground>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmission}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('TempMain')}>
                    <Text style={styles.text}>Back to Temp Main</Text>
                </TouchableOpacity>
            </View>
        </GreenBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 20,
    },
    submitButton: {
        width: '80%',
        height: 50,
        backgroundColor: 'rgba(0, 128, 0, 0.8)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    backButton: {
        width: '80%',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
});

export default Registration;
