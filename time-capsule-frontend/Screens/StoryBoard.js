import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, BackHandler, Pressable, FlatList, TouchableOpacity } from "react-native";
import StoryBoardBackground from "../Components/StoryBoardBackground";
import PageNavBar from "../Components/PageNavBar";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";


const StoryBoard = ({ navigation }) => {
    // set up global context for friend list.
    const { setCurUser, curUser, getUserbyID, getUser, error } = useGlobalContext();
    const [friendObj, setFriendObj] = useState([]);
    const [reloadApp, setReloadApp] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            // Retrieve current user
            const updatedUser = await getUserbyID(curUser._id);
            setCurUser(updatedUser);

            const promises = updatedUser.friends.map(async (id) => {
                return await getUserbyID(id);
            });

            const friendData = await Promise.all(promises);
            setFriendObj(friendData);
        };

        fetchData();
    }, [reloadApp]);

    const renderFriendsCapsule = ({ item }) => (
        <View style={commonStyles.listItemContainer}>
            <Text style={commonStyles.usernameText}>{item.username}</Text>
        </View>
    );

    return (
        <>
        <PageNavBar onBackPress={() => navigation.goBack()} title="Story Board"/>

        <View style={styles.capsuleContainer}>
            {friendObj.length > 0 ? (
            <>
            <FlatList
                data={friendObj}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderFriendsCapsule}
                ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
            />
            </>
            ) : (
            <>            
            <Text style={styles.text}>No Friends...</Text>
            </>
            )}
        </View>
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
    capsuleContainer: {
        padding: 10,
    }

});