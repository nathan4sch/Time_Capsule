import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import { buttonStyle } from "../Components/Button";
import { useGlobalContext } from "../context/globalContext";
import { spotifyLogin } from "../utils/spotifyLogin";
import { instagramLogin } from "../utils/instagramLogin";


const Profile = ({ navigation }) => {
    const { curUser, setLDMode, setSpotify } = useGlobalContext();
    const [isDarkMode, setIsDarkMode] = useState(curUser.profileSettings.darkMode);
    const [showSpotifyButton, setShowSpotifyButton] = useState(curUser.profileSettings.spotifyAccount === "");
    const [showInstagramButton, setShowInstagramButton] = useState(curUser.profileSettings.instagramAccount === "");

    profilePicture = curUser.profileSettings.profilePicture;

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

    return (
        <>
            <BlackBackground>
                <TouchableOpacity style={commonStyles.backButtonTop} onPress={() => navigation.goBack()}>
                    <Image style={commonStyles.arrowIconContainer} source={require('../icons/tempbackarrow-.png')} />
                </TouchableOpacity>
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
                    <Text style={styles.editPhotoText}>Edit Photo</Text>
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
                <TouchableOpacity style={styles.buttonContainer} onPress={toggleDarkMode}>
                    <View style={buttonStyle.button}>
                        <Image style={styles.icon} source={require('../icons/history-.png')} />
                        <Text style={styles.buttonText}>{curUser.profileSettings.darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
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
