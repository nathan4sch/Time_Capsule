import React from "react";
import { View, Text, Image, BackHandler, Pressable, TouchableOpacity } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import BackButton from '../Components/lightBackButton';
import { commonStyles } from "../Components/ProfilePageStyling";
import { buttonStyle } from "../Components/Button";

const Profile = ({ navigation }) => {
    return (
        <BlackBackground>
            <BackButton onPress={() => navigation.navigate('TempMain')} />
            <View style={commonStyles.profileContainer}>
                <Text style={commonStyles.username}>phenwood</Text>
                <View style={commonStyles.profileIconContainer}>
                    <Image style={commonStyles.icon} resizeMode="cover" source={require('../icons/profile-.png')} />
                </View>
            </View>
            <View style={commonStyles.tempMargin}></View>
            <View style={commonStyles.buttonContainer}>
                <View style={buttonStyle.button}>
                    <Image style={commonStyles.icon} source={require('../icons/spotify-.png')} />
                    <Text style={commonStyles.buttonText}>   Link Spotify Account</Text>
                </View>
            </View>
            <View style={commonStyles.buttonContainer}>
                <View style={buttonStyle.button}>
                    <Image style={commonStyles.icon} source={require('../icons/instagram-.png')} />
                    <Text style={commonStyles.buttonText}>   Link Instagram Account</Text>
                </View>
            </View>
            <TouchableOpacity style={commonStyles.buttonContainer} onPress={() => navigation.navigate('Friends')}>
                <View style={buttonStyle.button}>
                    <Image style={commonStyles.icon} source={require('../icons/friends-.png')} />
                    <Text style={commonStyles.buttonText}>Friends</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.buttonContainer} onPress={() => navigation.navigate('History')}>
                <View style={buttonStyle.button}>
                    <Image style={commonStyles.icon} source={require('../icons/history-.png')} />
                    <Text style={commonStyles.buttonText}>History</Text>
                </View>
            </TouchableOpacity>

        </BlackBackground>
    );  
}

export default Profile;