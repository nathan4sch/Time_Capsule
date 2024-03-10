import React, { useState } from "react";
import { StyleSheet, TextInput, Text, Platform, TouchableOpacity, Image, Keyboard, Alert } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import * as ImagePicker from 'expo-image-picker';

const Registration = ({ navigation }) => {
    const { userEmail, getUser, addUser, setCurUser } = useGlobalContext();
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const BASE_URL = "https://time-capsule-server.onrender.com/api/v1/";

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
        }
      };

    const handleSubmission = async () => {
        // Perform actions with the username, such as storing it
        const curUsername = username
        setUsername('');

        //check if username already exists, if so push error and try again
        if (curUsername.length == 0) {
            Alert.alert("Error", "You must type in a username");
        } else if (curUsername.length > 30) {
            Alert.alert("Error", "Username can not be more than 30 character");
        }
        else {
            const usernameExist = await getUser(curUsername)
            if (usernameExist !== null) {
                Alert.alert("Error", "Username already exists. Please choose another username.");
            } else {
                // Check if a profile image is selected
                if (profileImage) {
                    const formData = new FormData();
                    formData.append('image', {
                        uri: profileImage.uri,
                        type: profileImage.type,
                        name: 'profile_image.jpg',
                    });

                    // Call the server's post image function
                    fetch(`${BASE_URL}posts`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('Image uploaded successfully:', data);
                        })
                        .catch((error) => {
                            console.error('Error uploading image:', error);
                        });
                }
                await addUser(curUsername, userEmail)
                Alert.alert("Success", "Account Created");
                const findUser = await getUser(curUsername)
                setCurUser(findUser)
                navigation.navigate('Spotify');
            }
        }
    };

    return (
        <TouchableOpacity
            style={{ flex: 1 }} // Ensure the TouchableOpacity takes up the entire screen
            activeOpacity={1} // Ensure the TouchableOpacity is touchable
            onPress={() => Keyboard.dismiss()} // Dismiss the keyboard on press
        >
            <GreenBackground>
                <Image style={styles.image} source={require('../icons/profile-.png')} />
                <TouchableOpacity style={styles.press} onPress={pickImage}>
                    <Text style={styles.text2}>Set Profile Picture</Text>
                </TouchableOpacity>
                <Text style={styles.text1}>Create Username</Text>
                <TouchableOpacity style={[styles.container1, error && styles.errorBorder]} title=''>
                    <TextInput style={(error) ? styles.entry1 : styles.entry} placeholder="Enter username" onChangeText={setUsername} value={username} />
                </TouchableOpacity>
                <Text style={styles.text3}>{errorMsg}</Text>
                <TouchableOpacity style={styles.container2} onPress={() => handleSubmission()} title=''>
                    <Text style={styles.text}>Continue to link Social Media</Text>
                </TouchableOpacity>
            </GreenBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container1: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 415,
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
        borderColor: 'red',
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
    container2: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 695,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
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
        left: '7%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    text1: {
        position: 'absolute',
        width: 20,
        height: 5,
        left: 89,
        top: 372,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    text2: {
        position: 'absolute',
        width: 318,
        height: 50,
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },
    text3: {
        position: 'absolute',
        width: 318,
        height: 50,
        left: 47,
        top: 465,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 36,
        textAlign: 'left',
        color: '#FF0000',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    press: {
        position: 'absolute',
        left: 29,
        top: 238,
    },
    entry: {
        left: '10%',
        height: 50,
        width: 250,
        fontSize: 20,
        textAlignVertical: 'center',
    },
    image: {
        position: 'absolute',
        width: 212,
        height: 212,
        left: 82,
        top: 35,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    errorBorder: {
        borderWidth: 3, // Change border color to red in case of error
    },
    entry1: {
        left: '10%',
        height: 45,
        width: 250,
        fontSize: 20,
        textAlignVertical: 'center',
    },
});
export default Registration;
