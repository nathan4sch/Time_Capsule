import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import { useGlobalContext } from "../context/globalContext";
import BlackBackground from "../Components/BlackBackground";


const History = ({ navigation }) => {
    const { curUser, getCapsule } = useGlobalContext();
    const [capsules, setCapsules] = useState([]);

    useEffect(() => {
        const getCapsulesFunc = async () => {
            const capsulesArray = await Promise.all(
                curUser.capsules.map(async (capsuleId) => {
                    const capsule = await getCapsule(capsuleId);
                    return capsule.snapshot; // Assuming snapshot is the image URI
                })
            );
            setCapsules(capsulesArray);
        };
        getCapsulesFunc();
    }, [curUser.capsules]);

    return (
        <BlackBackground>
            <PageNavBar onBackPress={() => navigation.goBack()} title="History Page" />
            <FlatList
                style={styles.capsuleList}
                data={capsules}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image style={styles.capsuleListItem} source={{ uri: item }} />
                )}
            />
        </BlackBackground>
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
    },
});