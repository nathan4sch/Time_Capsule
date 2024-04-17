import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { useGlobalContext } from "../context/globalContext";
import BackButton from "../Components/lightBackButton";

const Friends = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getAllMoments } = useGlobalContext();
    const [momentList, setMomentList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const updatedUser = await getUserbyID(curUser._id);
            setCurUser(updatedUser);
            setMomentList(await getAllMoments(curUser._id));
        };

        fetchData();
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate;
    };

    const renderMoment = ({ item }) => {
        return (
            <View style={styles.momentContainer}>
                <Text style={styles.description}>{item[0]}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(item[1])}</Text>
            </View>
        );
    };

    return (
        <GreenBackground>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Yearly Moments</Text>
            <View style={styles.listContainer}>
                <FlatList
                    data={momentList}
                    keyExtractor={(item) => Math.random().toString()}
                    renderItem={renderMoment}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </GreenBackground>
    );
};

export default Friends;

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
    momentContainer: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 5,
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1, 
        width: '100%'
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black'
    },
    timestamp: {
        fontSize: 14,
        color: 'gray',
        paddingLeft: 15
    },
    listContainer: {
        flex: 1, 
        paddingHorizontal: 10,
        paddingTop: 5,
        width: "100%"
    },
    separator: {
        height: 1, 
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginVertical: 5,
    }
});
