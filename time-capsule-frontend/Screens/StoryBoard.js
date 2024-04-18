import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, Text, TouchableOpacity, Image, FlatList, Modal, ActivityIndicator, RefreshControl } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import BackButton from "../Components/lightBackButton";
import BottomTab from "../Components/BottomTab";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import BlackBackground from "../Components/BlackBackground";



const StoryBoard = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getCapsuleUrl, getCapsule } = useGlobalContext();
    const [friendObj, setFriendObj] = React.useState([]);
    const [capsuleList, setCapsuleList] = React.useState([]);

    const [refreshing, setRefreshing] = React.useState(false);
    const [pageRefresh, setPageRefresh] = React.useState(0);

    const onRefresh = () => {
        setRefreshing(true);
        setPageRefresh(pageRefresh + 1)
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };


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


            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            // Create a list with required information
            const friendInfoList = [];
            for (const friend of filteredFriends) {

                if (friend.capsules.length > 0) {
                    const capsuleID = friend.capsules[friend.capsules.length - 1];
                    const capsule = await getCapsuleUrl(capsuleID);
                    const capsuleObj = await getCapsule(capsuleID)

                    const capsuleDate = new Date(capsuleObj.timestamp);
                    const capsuleYear = capsuleDate.getFullYear();
                    const capsuleMonth = capsuleDate.getMonth();


                    if (capsuleObj.published && capsuleYear === currentYear && capsuleMonth === currentMonth) {
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
        //console.log(capsuleList)
    }, [pageRefresh]);


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

        <View style={{ flex: 1 }}>
            <BlackBackground>
                <Text style={styles.title}>Story Board</Text>
                {capsuleList.length > 0 ? (
                    <>
                        <FlatList
                            style={styles.capsuleList}
                            data={capsuleList}
                            keyExtractor={(item) => item.username}
                            renderItem={({ item }) => renderFriendCapsule(item)}
                            ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
                            }
                        />
                    </>
                ) : (
                    <>
                        <FlatList
                            style={styles.defaultCapsuleList}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
                            }
                        />
                        <View style={styles.noFriends}>
                            <Text style={styles.noFrendsText}>No Friend's Capsules</Text>
                        </View>
                    </>
                )}
                <BottomTab navigation={navigation} state={{ index: 2 }} />

            </BlackBackground>
        </View>
    );
};

export default StoryBoard;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 70,
        marginBottom: 10,
        //top: "5%"
    },
    capsuleList: {
        position: "absolute",
        top: "13.5%",
        width: "100%",
        height: '90%',
    },
    defaultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultImage: {
        width: 200, // Adjust width as needed
        height: 200, // Adjust height as needed
    },
    defaultCapsuleList: {
        position: "absolute",
        top: "13.5%",
        width: "100%",
        height: '90%',
    },
    capsuleListItem: {
        alignSelf: 'center',
        width: '85%',
        aspectRatio: 3 / 4,
        marginVertical: 8,
        borderRadius: 10
    },
    container: {
        width: "100%",
        aspectRatio: 3 / 4,
        //height: 350,
        overflow: "hidden",
    },
    listItemContainer: {
        left: "5%",
        width: "90%",
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 20,
        backgroundColor: "rgba(255, 255, 255, 0.6)"
    },
    usernameText: {
        fontSize: 20,
        top: "-40%",
        left: "15%",
        color: "black",
    },
    overlayText: {
        alignSelf: "center",
        color: "white",
        fontWeight: "bold",
        top: "50%",
    }, modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        //margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 0,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    activityIndicator: { // loading thing for before image loads
        position: 'absolute',
    },
    enlargedImage: {
        // need to change width and height for specific capsule dimensions
        width: "100%",
        height: '100%',
        borderRadius: 20,
        resizeMode: 'contain',
    }, imageContainer: {
        width: 345,
        height: 460,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFriends: {
        position: "absolute",
        alignSelf: 'center',
        justifyContent: 'center',
        top: "44.5%",
        width: "50%",
        height: '5.25%',
        padding: '25px',
        backgroundColor: 'white',
        borderRadius: '10px',
    },
    noFrendsText: {
        alignSelf: 'center',
        color: 'black',
        fontWeight: 'bold',
    },
});
