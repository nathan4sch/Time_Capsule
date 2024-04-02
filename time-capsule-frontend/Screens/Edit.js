import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import BlackBackground from "../Components/BlackBackground";
import BackButton from "../Components/lightBackButton";

const EditPage = ({ navigation }) => {
    

    return (
        <BlackBackground>
            <BackButton onPress={() => navigation.goBack()} />
            <View style={{ flex: 1 }}>
                
            </View>
        </BlackBackground>
    );
};

export default EditPage;

const styles = StyleSheet.create({
    
});
