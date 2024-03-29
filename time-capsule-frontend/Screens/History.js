import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import HistoryBackground from "../Components/HistoryBackground";
import BackButton from "../Components/lightBackButton";


const History = ({ navigation }) => {
    const { curUser, getCapsuleUrl } = useGlobalContext();
    const [capsulesArray, setCapsules] = useState([]);

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
        console.log("capsule array", capsulesArray)
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
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleImagePress(item)}>
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
        aspectRatio: 1,
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
});
