import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import PageNavBar from "../Components/PageNavBar";
import { buttonStyle } from "../Components/Button";
import { useGlobalContext } from "../context/globalContext";

const Profile = ({ navigation }) => {
    const { curUser } = useGlobalContext();

    const styles = StyleSheet.create({
        profileContainer: {
            top: '-5%',
            position: 'relative',
            alignItems: 'center',
            height: '30%',
            aspectRatio: 1,
            marginBottom: '15%',
        },
        username: {
            top: '10%',
            fontSize: 30,
            color: 'white',
        },
        profileIcon: {
            justifyContent: 'center', // Center content vertically
            alignItems: 'center', // Center content horizontally
            height: '80%',
            aspectRatio: 1,
            marginTop: 40
        },
        buttonContainer: {
            position: 'relative',
            width: '80%',
            height: '7.5%',
            marginBottom: '10%',
        },
        buttonText: {
            top: '30%',
            fontSize: 21,
            color: 'black',
        },
        icon: {
            position: 'absolute',
            left: '2%',
            top: '15%',
            width: 47,
            height: 47,
        },
        editPhotoText: {
            marginTop: 0,
            fontSize: 16,
            color: 'white',
        },
    });

    return (
        <>
            
            <BlackBackground>
            <PageNavBar
                onBackPress={() => navigation.goBack()}
            />
                <View style={styles.profileContainer}>
                <Text style={styles.username}>  {curUser.username}</Text>
                    <Image style={styles.profileIcon} source={require('../icons/profile-.png')} />
                    <Text style={styles.editPhotoText}>Edit Photo</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={buttonStyle.button}>
                        <Image style={styles.icon} source={require('../icons/spotify-.png')} />
                        <Text style={styles.buttonText}>   Link Spotify Account</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={buttonStyle.button}>
                        <Image style={styles.icon} source={require('../icons/instagram-.png')} />
                        <Text style={styles.buttonText}>   Link Instagram Account</Text>
                    </View>
                </View>
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
            </BlackBackground>
        </>
    );
}

export default Profile;
