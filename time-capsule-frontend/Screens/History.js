import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import BackButton from "../Components/lightBackButton";
import ImageGrid from "../Components/ImageGrid"
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import ViewShot from "react-native-view-shot";



const History = ({ navigation }) => {
    const { curUser, getCapsuleUrl, BASE_S3_URL, getCapsule, replacePhoto, setSnapshotKey } = useGlobalContext();
    const [capsulesArray, setCapsules] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCapsule, setSelectedCapsule] = useState();
    const [imageLoading, setImageLoading] = useState(true);
    const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);
    const [addedImages, setAddedImages] = useState(Array(6).fill(null));

    const [songName, setSongName] = useState('');
    const [artist, setArtist] = useState('');

    const viewShotRef = useRef(null);

    const editButtons = [
        { id: 'btn1', label: 'Btn 1' },
        { id: 'btn2', label: 'Btn 2' },
        { id: 'btn3', label: 'Btn 3' },
        { id: 'btn4', label: 'Btn 4' },
        { id: 'btn5', label: 'Btn 5' },
        { id: 'btn6', label: 'Btn 6' },
    ];


    // handle image presses for enlarging the capsule
    const handleImagePress = async (imageUrl, index) => {
        console.log("Selected image index: ", index); // Example usage of index
        capsuleId = curUser.capsules[index]
        capsule = await getCapsule(capsuleId)
        setEditOverlayVisible(false)
        setSelectedCapsule(capsule);
        setSelectedImage(imageUrl);
        setAddedImages(Array(6).fill(null))
        setImageLoading(true);
        setModalVisible(true);
    };

    const handleEditPress = () => {
        setEditOverlayVisible(!isEditOverlayVisible);
    };

    const handleEditSpotify = () => {
        Alert.prompt(
            "Enter Song Name",
            null,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: (alertSongName) => {
                        if (alertSongName.trim() !== '') {
                            Alert.prompt(
                                "Enter Artist Name",
                                null,
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "OK",
                                        onPress: (alertArtist) => {
                                            if (alertArtist.trim() !== '') {
                                                // Both songName and artist are provided
                                                setSongName(alertSongName)
                                                setArtist(alertArtist)
                                            } else {
                                                // Artist name is empty
                                                Alert.alert("Error", "Please enter an artist name.");
                                            }
                                        }
                                    }
                                ],
                                "plain-text",
                                "",
                                "default"
                            );
                        } else {
                            // Song name is empty
                            Alert.alert("Error", "Please enter a song name.");
                        }
                    }
                }
            ],
            "plain-text",
            "",
            "default"
        );

    };


    const handleSavePress = async () => {
        console.log("save")
        setEditOverlayVisible(false)
        const uri = await viewShotRef.current.capture(); // Capture the layout as an image

        const formData = new FormData();
        formData.append("image", {
            uri: uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
        });

        try {
            //delete old photo from s3
            await axios.delete(`${BASE_S3_URL}api/del/${selectedCapsule.snapshotKey}`);
            //add new photo to s3
            const response = await axios.post(`${BASE_S3_URL}api/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            //get new photo name and url
            imageName = response.data.imageName

            //replace mongo data
            selectedCapsuleId = selectedCapsule._id
            await setSnapshotKey(selectedCapsuleId, imageName)

            //get url
            const urlRes = await axios.get(`${BASE_S3_URL}api/get/${imageName}`);
            const url = urlRes.data.url
            //update selectedCaspsule
            curCapsule = selectedCapsule
            curCapsule.snapshotKey = imageName
            curCapsule.snapshotUrl = url
            setSelectedCapsule(curCapsule)

            setSelectedImage(url)
            setAddedImages(Array(6).fill(null))

            getCapsulesFunc();
        } catch (error) {
            console.error('Upload error', error);
        }
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
                //delete old photo from s3
                if (selectedCapsule.usedPhotos[index].photoKey != "default1.png") {
                    await axios.delete(`${BASE_S3_URL}api/del/${selectedCapsule.usedPhotos[index].photoKey}`);
                }
                //add new photo to s3
                const response = await axios.post(`${BASE_S3_URL}api/posts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                //get new photo name and url
                imageName = response.data.imageName
                const urlRes = await axios.get(`${BASE_S3_URL}api/get/${imageName}`);
                const url = urlRes.data.url
                //add new photo to mongo and remove old
                //technically would replace if the user doesn't save, won't break anything
                await replacePhoto(selectedCapsule._id, imageName, url, index)
                newImages = [...addedImages]
                newImages[index] = url
                setAddedImages(newImages)
            } catch (error) {
                console.error('Upload error', error);
            }
        }
    }

    const getCapsulesFunc = async () => {
        const capsulesArray = await Promise.all(
            curUser.capsules.map(async (capsuleId) => {
                const capsuleUrl = await getCapsuleUrl(capsuleId);
                return capsuleUrl;
            })
        );
        setCapsules(capsulesArray);
    };

    useEffect(() => {
        getCapsulesFunc();
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
                                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
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
                                            <TouchableOpacity style={styles.editSpotifyButton} onPress={() => { handleEditSpotify() }}><Text>spotify</Text></TouchableOpacity>
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
                                    {modalVisible && (
                                        <ImageGrid images={addedImages} />
                                    )}
                                </ViewShot>

                            </TouchableOpacity>
                            {/* Buttons Container */}
                            {modalVisible && (
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => { handleEditPress() }}>
                                        <Text>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveButton} onPress={() => { handleSavePress() }}>
                                        <Text>Save Changes</Text>
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
        zIndex: 2,
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
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        top: 38,
        marginHorizontal: 0,
        zIndex: 1
    },
    editButtonWrapper: {
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
    },
});
