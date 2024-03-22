import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import { buttonStyle } from "../Components/Button";
import { useGlobalContext } from "../context/globalContext";
import { spotifyLogin } from "../utils/spotifyLogin";
import { instagramLogin } from "../utils/instagramLogin";
import BackButton from "../Components/lightBackButton";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

//const BASE_URL = "http://100.67.14.25:3000/"
const BASE_URL = "https://time-capsule-server.onrender.com/api/v1/";

const Profile = ({ navigation }) => {
    const { curUser, setLDMode, setSpotify, setCurUser, getUser, deleteAccount, setProfilePicture} = useGlobalContext();
    const [isDarkMode, setIsDarkMode] = useState(curUser.profileSettings.darkMode);
    const [showSpotifyButton, setShowSpotifyButton] = useState(curUser.profileSettings.spotifyAccount === "");
    const [showInstagramButton, setShowInstagramButton] = useState(curUser.profileSettings.instagramAccount === "");
    const [profileImage, setProfileImage] = useState(null);

    const pickImage = async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
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
                const response = await axios.post(`${BASE_URL}api/posts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Upload successful, Image Name:', response.data.imageName);
                imageName = response.data.imageName
                const urlRes = await axios.get(`${BASE_URL}api/get/${imageName}`);
                const url = urlRes.data.url
                console.log('URL: ', url)
                await setProfilePicture(url);
                setProfileImage(url);

                //setProfileImage(uri); // Update the state with the new image URI
            } catch (error) {
                console.error('Upload error', error);
            }
        }
    };

    useEffect(() => {
        const fetchData = async (name) => {
            const findUser = await getUser(name);
            setCurUser(findUser);
            setShowSpotifyButton(findUser.profileSettings.spotifyAccount === "");
            setShowInstagramButton(findUser.profileSettings.instagramAccount === "");
        };

        fetchData(curUser.username);
    }, []);


    const toggleDarkMode = () => {
        setLDMode();
        curUser.profileSettings.darkMode = !curUser.profileSettings.darkMode;
        setIsDarkMode(!isDarkMode)
    };

    const handleSpotifyLogin = async () => {
        await spotifyLogin({ navigation, page: "Profile", setSpotify });
        setShowSpotifyButton(false);
    };

    const handleInstagramLogin = async () => {
        await instagramLogin({ navigation, page: "Profile" });
        setShowInstagramButton(false);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => confirmDeleteAccount() },
            ],
            { cancelable: true }
        );
    };

    const confirmDeleteAccount = async () => {
        await deleteAccount(curUser._id);
        navigation.navigate('Login')
    }

    return (
        <>
            <BlackBackground>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.separator} />
                <View style={styles.profileContainer}>
                    <Text style={styles.username}>  {curUser.username}</Text>
                    <Image
                        style={styles.profileIcon}
                        source={{
                            uri: curUser.profileSettings.profilePicture,
                        }}
                        onError={(error) => console.error("Image load error:", error)}
                    />
                    <TouchableOpacity style={styles.press} onPress={pickImage}>
                        <Text style={styles.editPhotoText}>Edit Profile Picture</Text>
                    </TouchableOpacity>
                </View>
                {showSpotifyButton && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={buttonStyle.button} onPress={handleSpotifyLogin} title=''>
                            <Image style={styles.icon} source={require('../icons/spotify-.png')} />
                            <Text style={styles.buttonText}>   Link Spotify Account</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* Render Instagram button only if the field is empty */}
                {showInstagramButton && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={buttonStyle.button} onPress={handleInstagramLogin} title=''>
                            <Image style={styles.icon} source={require('../icons/instagram-.png')} />
                            <Text style={styles.buttonText}>   Link Instagram Account</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Friends')}>
                    <View style={buttonStyle.button}>
                        <Image style={styles.icon} source={require('../icons/friends-.png')} />
                        <Text style={styles.buttonText}>Friends</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('History')}>
                    <View style={buttonStyle.button}>
                        <Image style={styles.icon} source={require('../icons/history-.png')} />
                        <Text style={styles.buttonText}>History</Text>
                    </View>
                </TouchableOpacity>
                {/*<TouchableOpacity style={styles.buttonContainer} onPress={toggleDarkMode}>
                    <View style={buttonStyle.button}>
                        <Image style={styles.icon} source={require('../icons/history-.png')} />
                        <Text style={styles.buttonText}>{curUser.profileSettings.darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
                    </View>
                </TouchableOpacity>*/}
                <TouchableOpacity style={styles.buttonContainer} onPress={handleDeleteAccount}>
                    <View style={{ ...buttonStyle.button, backgroundColor: '#ff5a50' }}>
                        <Text style={{ ...styles.buttonText, color: 'white' }}>Delete Account</Text>
                    </View>
                </TouchableOpacity>
            </BlackBackground>
        </>
    );
}

const styles = StyleSheet.create({
    separator: {
        marginVertical: 50,
    },
    profileContainer: {
        top: '-5%',
        position: 'relative',
        alignItems: 'center',
        height: '30%',
        aspectRatio: 1,
        marginBottom: '12%',
    },
    username: {
        top: '10%',
        fontSize: 30,
        color: 'white',
    },
    profileIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        aspectRatio: 1,
        marginTop: 40,
        borderRadius: 100,
    },
    buttonContainer: {
        position: 'relative',
        width: '80%',
        height: '6.5%',
        marginBottom: '7%',
    },
    buttonText: {
        top: '30%',
        fontSize: 21,
        color: 'black',
    },
    icon: {
        position: 'absolute',
        left: '2%',
        top: '11%',
        width: 47,
        height: 47,
    },
    editPhotoText: {
        marginTop: 15,
        fontSize: 16,
        color: 'white',
    },
});

export default Profile;
