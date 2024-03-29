import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, Modal, ActivityIndicator } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import BackButton from "../Components/lightBackButton";


const StoryBoard = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getCapsuleUrl } = useGlobalContext();
    const [friendObj, setFriendObj] = React.useState([]);
    const [capsuleList, setCapsuleList] = React.useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);


    // handle image presses for enlarging the capsule
    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageLoading(true);
        setModalVisible(true);
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
                    const capsuleID = friend.capsules[friend.capsules.length-1];
                    const capsule = await getCapsuleUrl(capsuleID);
                    if (capsule.published && capsuleYear === currentYear && capsuleMonth === currentMonth) {
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
        console.log(capsuleList)
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
                <TouchableOpacity onPress={() => handleImagePress(item.snapshot)}>
                <Image style={styles.capsuleListItem} source={{ uri: item.snapshot }} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <HistoryBackground>
            <BackButton onPress={() => navigation.goBack()} />
            {/* Add the rest of your components here */}
            {capsuleList.length > 0 ? (
                <>
                <FlatList
                    style={styles.capsuleList}
                    data={capsuleList}
                    keyExtractor={(item) => item.username}
                    renderItem={({ item }) => renderFriendCapsule(item)}
                    ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
                />
                <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                            <View style={styles.modalContent}>
                                <View style={styles.imageContainer}>
                                    {imageLoading && (
                                        <ActivityIndicator style={styles.activityIndicator} size="large" color="#000000" />
                                    )}
                                    <Image
                                        style={styles.enlargedImage}
                                        source={{ uri: selectedImage }}
                                        onLoad={() => setImageLoading(false)}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
                </>
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
    },modalOverlay: {
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
    },imageContainer: {
        width: 345,
        height: 460,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
