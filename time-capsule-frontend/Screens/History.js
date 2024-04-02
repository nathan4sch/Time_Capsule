import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import BackButton from "../Components/lightBackButton";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';


const History = ({ navigation }) => {
    const { curUser, getCapsuleUrl, BASE_S3_URL } = useGlobalContext();
    const [capsulesArray, setCapsules] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);

    const editButtons = [
        { id: 'btn1', label: 'Btn 1' },
        { id: 'btn2', label: 'Btn 2' },
        { id: 'btn3', label: 'Btn 3' },
        { id: 'btn4', label: 'Btn 4' },
        { id: 'btn5', label: 'Btn 5' },
        { id: 'btn6', label: 'Btn 6' },
    ];


    // handle image presses for enlarging the capsule
    const handleImagePress = (imageUrl, index) => {
        console.log("Selected image index: ", index); // Example usage of index
        setSelectedImage(imageUrl);
        setImageLoading(true);
        setModalVisible(true);
    };

    const handleEditPress = () => {
        setEditOverlayVisible(!isEditOverlayVisible);
    };

    const handleSavePress = () => {

    };

    const handleEditImagePress = async (index) => {
        console.log("button: ", index)
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
        });

        if (!result.canceled) {
            //from react client, to express server, to s3 bucket
            const formData = new FormData();
            formData.append("image", {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            try {
                //if (curUser.profileSettings.profilePictureKey != "default") {
                //    await axios.delete(`${BASE_S3_URL}api/del/${curUser.profileSettings.profilePictureKey}`);
                //}
                const response = await axios.post(`${BASE_S3_URL}api/posts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                //console.log('Upload successful, Image Name:', response.data.imageName);
                /*imageName = response.data.imageName
                await setProfilePictureKey(imageName)
                const urlRes = await axios.get(`${BASE_S3_URL}api/get/${imageName}`);
                const url = urlRes.data.url
                //console.log('URL: ', url)
                let urlResponse = await setProfilePictureUrl(url);
                curUser.profileSettings.profilePictureUrl = url
                setCurUser(curUser)
                setReload(!reload)*/
                //console.log(urlResponse)

                //setProfileImage(uri); // Update the state with the new image URI
            } catch (error) {
                console.error('Upload error', error);
            }
        }
    }

    useEffect(() => {
        const getCapsulesFunc = async () => {
            const capsulesArray = await Promise.all(
                curUser.capsules.map(async (capsuleId) => {
                    const capsuleUrl = await getCapsuleUrl(capsuleId);
                    return capsuleUrl;
                })
            );
            setCapsules(capsulesArray);
        };
        getCapsulesFunc();
        //console.log("capsule array", capsulesArray)
    }, [curUser.capsules]);

    return (
        <HistoryBackground>
            <BackButton onPress={() => navigation.goBack()} />
            {capsulesArray.length > 0 ? (
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={styles.capsuleList}
                        data={capsulesArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => handleImagePress(item, index)}>
                                <Image style={styles.capsuleListItem} source={{ uri: item }} />
                            </TouchableOpacity>
                        )}
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
                                {isEditOverlayVisible && (
                                    <View style={styles.editOverlay}>
                                        {/* Row 1 */}
                                        <TouchableOpacity style={styles.editSpotifyButton}><Text>spotify</Text></TouchableOpacity>
                                        <View style={styles.editButtonContainer}>
                                            {editButtons.map((button, index) => (
                                                <TouchableOpacity
                                                    key={button.id}
                                                    style={styles.editButtonWrapper}
                                                    onPress={() => handleEditImagePress(index)}
                                                >
                                                    <Image style={styles.transparentImage} source={require('../icons/editOverlay.jpg')} />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                            {/* Buttons Container */}
                            {modalVisible && (
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => { handleEditPress() }}>
                                        <Text>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveButton} onPress={() => { handleSavePress() }}>
                                        <Text>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Modal>
                </View>
            ) : (
                <View style={styles.noPastCapsulesContainer}>
                    <Text style={styles.overlayText}>No Past Capsules</Text>
                </View>
            )}
        </HistoryBackground>
    );
};

export default History;

const styles = StyleSheet.create({
    capsuleList: {
        position: "absolute",
        top: "15%",
        width: "100%",
        height: '85%',
    },
    capsuleListItem: {
        alignSelf: 'center',
        width: '75%',
        aspectRatio: 3 / 4,
        marginVertical: 15,
        borderRadius: 10
    },
    modalOverlay: {
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
        borderWidth: 2,
        borderColor: 'white',
        resizeMode: 'contain',
    },
    imageContainer: {
        width: 345,
        height: 460,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBox: {
        position: "absolute",
        alignSelf: 'center',
        top: "45%",
        width: "50%",
        height: '5%',
    },
    overlayText: {
        alignSelf: 'center',
        color: 'black',
        fontWeight: 'bold',
    },
    noPastCapsulesContainer: {
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 10,
    },
    editButton: {
        backgroundColor: 'lightblue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: 'lightgreen',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    editOverlay: {
        position: 'absolute',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: '88%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    editOverlayButton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        top: 10,
        marginHorizontal: 0,
        backgroundColor: "white"
    },
    editButtonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        top: 38,
        marginHorizontal: 0,
    },
    editButtonWrapper: {
        borderWidth: 2,
        borderTopWidth: 3,
        borderColor: 'red',
        width: 115.2,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editSpotifyButton: {
        width: '100%',
        height: 80,
        borderWidth: 4,
        borderColor: "red",
        top: 30
    },
    transparentImage: {
        width: '100%',
        height: '100%',
        opacity: 0.5
    }
});
