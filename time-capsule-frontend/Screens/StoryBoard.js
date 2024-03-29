import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import BackButton from "../Components/lightBackButton";


const StoryBoard = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getCapsuleUrl } = useGlobalContext();
    const [friendObj, setFriendObj] = React.useState([]);
    const [capsuleList, setCapsuleList] = React.useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const updatedUser = await getUserbyID(curUser._id);
            setCurUser(updatedUser);

            const promises = updatedUser.friends.map(async (id) => {
                return await getUserbyID(id);
            });

            const friendData = await Promise.all(promises);

            // Filter friends based on the condition
            const filteredFriends = friendData.filter((friend) => friend.capsules.length !== 0);

            // Create a list with required information
            const friendInfoList = [];

            for (const friend of filteredFriends) {
                console.log(friend)
                if (friend.capsules.length > 0) {
                    const capsuleID = friend.capsules[0];
                    const capsule = await getCapsuleUrl(capsuleID);
                    if (capsule.published) {
                        friendInfoList.push({
                            username: friend.username,
                            profilePicture: friend.profileSettings.profilePictureUrl,
                            snapshot: capsule,
                        });
                    }
                }
            }

            setCapsuleList(friendInfoList);
        };

        fetchData();
    }, []);


    const renderFriendCapsule = (item) => {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.container} key={item.username}>
                <TouchableOpacity activeOpacity={1} style={styles.listItemContainer}>
                    <Image
                        style={commonStyles.friendIcon}
                        source={{ uri: item.profilePicture }}
                        onError={(error) => console.error("Image load error:", error)}
                    />
                    <Text style={styles.usernameText}>{item.username}</Text>
                </TouchableOpacity>
                <Image style={styles.capsuleListItem} source={{ uri: item.snapshot }} />
            </TouchableOpacity>
        );
    };

    return (
        <HistoryBackground>
            <BackButton onPress={() => navigation.goBack()} />
            {/* Add the rest of your components here */}
            {capsuleList.length > 0 ? (
                <FlatList
                    style={styles.capsuleList}
                    data={capsuleList}
                    keyExtractor={(item) => item.username}
                    renderItem={({ item }) => renderFriendCapsule(item)}
                    ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
                />
            ) : (
                <Text style={styles.overlayText}>Your friend's capsules will be displayed here</Text>
            )}
        </HistoryBackground>
    );
};

export default StoryBoard;

const styles = StyleSheet.create({
    capsuleList: {
        position: "absolute",
        top: "15%",
        width: "100%",
        height: "80%",
    },
    capsuleListItem: {
        alignSelf: "center",
        width: "75%",
        aspectRatio: 1,
        marginVertical: 15,
    },
    container: {
        width: "100%",
        height: 350,
        overflow: "hidden",
    },
    listItemContainer: {
        width: "100%",
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    usernameText: {
        fontSize: 20,
        top: "-40%",
        left: "15%",
        color: "black",
    },
    overlayText: {
        alignSelf: "center",
        color: "black",
        fontWeight: "bold",
        top: "35%",
    },
});
