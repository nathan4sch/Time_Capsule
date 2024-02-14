import React from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable, TouchableOpacity } from "react-native";
import StoryBoardBackground from "../Components/StoryBoardBackground";

const StoryBoard = ({ navigation }) => {
    return (
        <StoryBoardBackground>
            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('TempMain')} title=''>
                <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
        </StoryBoardBackground>
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