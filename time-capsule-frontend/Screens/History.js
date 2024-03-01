import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable, FlatList, TouchableOpacity } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";
import BlackBackground from "../Components/BlackBackground";

const History = ({ navigation }) => {
    const { curUser, getCapsule, } = useGlobalContext();
    const [reloadApp, setReloadApp] = useState(false);
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

    const handleOverlayButtonPress = () => {
        
    };
    
    return (
        <BlackBackground>
            <PageNavBar onBackPress={() => navigation.goBack()} title="History Page" />
            
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
            <View style={styles.capsuleList} />
        </BlackBackground>
    );  
}

export default History;

const styles = StyleSheet.create({
    imageContainer: {
        position: 'absolute',
        top: '20%',
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
    capsuleList: {
        position: 'absolute',
        top: '20%',
        width: '100%',
        height: '50%',
        backgroundColor: '#8E8E8E',
        borderRadius: 20,
    },
});