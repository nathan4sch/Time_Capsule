import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, Keyboard } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import BlackBackground from "../Components/BlackBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";

const Main = ({ navigation }) => {
    const { curUser, getCapsule } = useGlobalContext();
    const [timer, setTimer] = useState(calculateTimeUntilNextMonth());
    const [shownCapsule, setShownCapsule] = useState("");

    useEffect(() => {
        const getCapsuleFunc = async () => {
            if (curUser.capsules.length !== 0) {
                const capsule = await getCapsule(curUser.capsules[0]);
                setShownCapsule(capsule.snapshot);
            }
        };
        getCapsuleFunc();
    }, []);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(calculateTimeUntilNextMonth());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    function calculateTimeUntilNextMonth() {
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);

        const timeDifference = nextMonth - now;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const padWithZero = (value) => (value < 10 ? `0${value}` : value);

        return `${padWithZero(days)}:${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(seconds)}`;
    }

    const handleOverlayButtonPress = () => {
        navigation.navigate('StoryBoard');
    };

    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
        >
            <BlackBackground>
                <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
                    <Image style={styles.profileIcon}
                        source={{
                            uri: curUser.profileSettings.profilePicture,
                        }}
                    />
                </TouchableOpacity>
                <View style={styles.tempTimeContainer}>
                    <Text style={styles.timerText}>{timer}</Text>
                    <Text style={styles.unitText}>day       hour       min       sec</Text>
                </View>
                <View style={styles.imageContainer}>
                    {shownCapsule ? (
                        <Image
                            style={styles.capsuleImage}
                            source={{ uri: shownCapsule }}
                        />
                    ) : (
                        // Render something else when shownCapsule is empty
                        <Text style={styles.overlayText}>No Capsule Available</Text>
                    )}
                    <TouchableOpacity style={styles.overlayButton} onPress={handleOverlayButtonPress}></TouchableOpacity>
                </View>
                <TextInput style={styles.momentButton}
                    placeholder="Enter Moment"
                    returnKeyType="done" />
                <View style={styles.capsuleList} />
            </BlackBackground>
        </TouchableOpacity>
    );
}

export default Main;

const styles = StyleSheet.create({
    profileContainer: {
        position: 'absolute',
        top: 115,
        left: 25,
        height: '13%',
        aspectRatio: 1,
        borderRadius: 80,
    },
    profileIcon: {
        position: 'absolute',
        left: '-5%',
        height: '100%',
        aspectRatio: 1,
        borderRadius: 100,
    },
    tempTimeContainer: {
        position: 'absolute',
        flexDirection: 'column',
        width: 230,
        height: 70,
        left: 150,
        top: 130,
    },
    timerText: {
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 40,
        lineHeight: 45,
        textAlign: 'center',
        color: 'white',
    },
    unitText: {
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 18,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    momentButton: {
        position: 'absolute',
        paddingLeft: 20,
        left: '10%',
        top: '87%',
        width: '80%',
        height: 31,
        backgroundColor: 'rgba(255, 255, 255, 0.67)',
        borderRadius: 10,
    },
    capsuleList: {
        position: 'absolute',
        top: '30%',
        width: '100%',
        height: '50%',
        backgroundColor: '#8E8E8E',
        borderRadius: 20,
    },
    imageContainer: {
        position: 'absolute',
        top: '30%',
        left: 0,
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'red',
        zIndex: 1,  
    },
    capsuleImage: {
        height: '65%',
        width: '80%'
    },
    overlayButton: {
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: '-70%',
        width: '80%',
        height: '65%',
        zIndex: 2,
    },
    overlayText: {
        color: 'black',
        fontWeight: 'bold',
    },
});