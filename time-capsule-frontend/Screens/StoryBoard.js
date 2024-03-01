import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import { commonStyles } from "../Components/FriendsPageStylings";

const StoryBoard = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getCapsule } = useGlobalContext();
    const [friendObj, setFriendObj] = useState([]);
    const [shownCapsule, setShownCapsule] = useState("");

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
    }, []);

    const getCapsuleSnapshot = async (capsuleID) => {
        const capsule = await getCapsule(capsuleID);
        setShownCapsule(capsule.snapshot);
    }

    const renderFriendCapsule = ({ item }) => {    
        let content;
        getCapsuleSnapshot(item.capsules[0]);
        content = (
            <TouchableOpacity activeOpacity={1} style={styles.container}>
                <TouchableOpacity activeOpacity={1} style={styles.listItemContainer}>
                    <Image
                      style={commonStyles.friendIcon}
                      source={{
                      uri: item.profileSettings.profilePicture,
                      }}
                      onError={(error) => console.error("Image load error:", error)}
                    />
                    <Text style={styles.usernameText}>{item.username}</Text>
                </TouchableOpacity>
                <Image style={styles.capsuleListItem} source={{ uri: shownCapsule}} />
            </TouchableOpacity>
        );
    
        return content;
    };

    return (
        <HistoryBackground>
            <PageNavBar onBackPress={() => navigation.goBack()} title="StoryBoard" />
            <FlatList
                style={styles.capsuleList}
                data={friendObj}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderFriendCapsule}
                ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
            />
        </HistoryBackground>
    );
};

export default StoryBoard;

const styles = StyleSheet.create({
    capsuleList: {
        position: "absolute",
        top: "15%",
        width: "100%",
        height: '80%',
    },
    capsuleListItem: {
        alignSelf: 'center',
        width: '75%',
        aspectRatio: 1,
        marginVertical: 15,
    },
    container: {
        width: '100%',
        height: 350,
        overflow: 'hidden', // This will clip the child elements that overflow the container
    },
    listItemContainer: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    usernameText: {
        fontSize: 20,
        top: '-40%',
        left: '15%',
        color: 'black',
      },
});