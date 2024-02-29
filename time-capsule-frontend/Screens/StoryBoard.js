import React from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable, TouchableOpacity } from "react-native";
import StoryBoardBackground from "../Components/StoryBoardBackground";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";


const StoryBoard = ({ navigation }) => {
    // set up global context for friend list.

    return (
        <>
        <PageNavBar onBackPress={() => navigation.goBack()} title="Story Board"/>
        </>
    );  
}

export default StoryBoard;

const styles = StyleSheet.create({  
    container: {
        position: 'absolute',
        width: 296,
        height: 50,
        left: 47,
        top: 695, 
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        borderRadius: 10,
    },
    text: {
        position: 'absolute',
        left: '35%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
    },

});