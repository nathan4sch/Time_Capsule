import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable, FlatList, TouchableOpacity } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";

const History = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getUser, error } = useGlobalContext();
    const [reloadApp, setReloadApp] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            // Retrieve current user
            const updatedUser = await getUserbyID(curUser._id);
            setCurUser(updatedUser);
        };

        fetchData();
    }, [reloadApp]);

    const renderCapsule = ({ item }) => (
        // TODO 
        //   We will finish implementing this method once we figure out how we plan on doing the capusle.
        //   Right now this is just set to display the timestamp and snapshot, I don't have styling
        //   for this yet since we don't have capsule data to test with.
        <View style={commonStyles.listItemContainer}>
            <Text style={commonStyles.usernameText}>{item.timestamp}</Text>
            <Image style={commonStyles.icon} source={item.snapshot} />
        </View>
    );
    
    return (
        <>
        <PageNavBar onBackPress={() => navigation.goBack()} title="History"/>
        
        <View style={styles.capsuleContainer}>
            {curUser.capsules.length > 0 ? (
            <>
            <FlatList
                data={curUser.capsules}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCapsule}
                ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
            />
            </>
            ) : (
            <>            
            <Text style={styles.text}>No Capsules...</Text>
            </>
            )}
        </View>
        </>
    );  
}

export default History;

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
        left: '32%',
        top: '10%',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'center',
        color: '#000000',
        padding: 15,
    },
    capsuleContainer: {
        padding: 10,
    },
});