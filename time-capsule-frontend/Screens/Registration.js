import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TextInput, Text, Platform, TouchableOpacity, Image, Keyboard, Alert } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'

const Registration = ({ navigation }) => {
    const { userEmail, getUser, addUser, setCurUser, setProfilePictureKey, setProfilePictureUrl, curUser, BASE_S3_URL } = useGlobalContext();
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    //const BASE_URL = "http://100.67.14.25:3000/api/v1/";
    //const BASE_URL = "https://time-capsule-server.onrender.com/api/v1/";

    const [profileUrl, setProfileUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png');
    const [profileKey, setProfileKey] = useState('');

    const curUserChangedReg = useRef(false);

    useEffect(() => {
        // This effect will run whenever curUser changes
        if (curUserChangedReg.current) {
            if (profileUrl != "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png") {
                //console.log("RegIst: ", profileKey, profileUrl)
                setProfilePictureKey(profileKey);
                setProfilePictureUrl(profileUrl);
                curUserChangedReg.current = false
            }
            curUserChangedReg.current = false
        }
    }, [curUser]);

    const pickImage = async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
        });

        if (!result.canceled) {
            //from react client, to express server, to s3 bucket
            const formData = new FormData();
            formData.append("image", {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            try {
                //const response = await axios.post(`https://time-capsule-server.onrender.com/api/posts`, formData, {
                const response = await axios.post(`${BASE_S3_URL}api/posts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setProfileKey(response.data.imageName)
                //await setProfilePictureKey(imageName)
                const urlRes = await axios.get(`${BASE_S3_URL}api/get/${response.data.imageName}`);
                setProfileUrl(urlRes.data.url)

                //let urlResponse = await setProfilePictureUrl(url);
                //curUser.profileSettings.profilePictureUrl = url
                //setCurUser(curUser)

                //setProfileImage(uri); // Update the state with the new image URI
            } catch (error) {
                console.error('Upload error', error);
                console.log(error)
            }
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

                await addUser(curUsername, userEmail)
                Alert.alert("Success", "Account Created");
                const findUser = await getUser(curUsername)
                if (profileUrl != "") {
                    findUser.profileSettings.profilePictureUrl = profileUrl
                    findUser.profileSettings.profilePictureKey = profileKey
                }
                curUserChangedReg.current = true
                await setCurUser(findUser)
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
                <Image
                    style={styles.image}
                    source={{
                        uri: profileUrl,
                    }}
                    onError={(error) => console.error("Image load error:", error)}
                />
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
        height: '20%',
        left: 105,
        top: 65,
        aspectRatio: 1,
        borderRadius: 100,
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
