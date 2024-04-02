import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text , FlatList } from "react-native";
import GreenBackground from "../Components/GreenBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";
import BackButton from "../Components/lightBackButton";

const Friends = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, getAllMoments } = useGlobalContext();
    const [momentList, setMomentList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const updatedUser = await getUserbyID(curUser._id);
            setCurUser(updatedUser);
            setMomentList(await getAllMoments(curUser._id))
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
    }
   
    return (
            <GreenBackground>

            <BackButton onPress={() => navigation.goBack()} />
            <View style={commonStyles.listContainer}>
                <FlatList
                    data={momentList}
                    keyExtractor={(item) => Math.random().toString()}
                    renderItem={renderMoment}
                    ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
                    showsVerticalScrollIndicator={true} 
                    showsHorizontalScrollIndicator={false}                     
                />
            </View>

            </GreenBackground>
    );
};

export default Friends;

const styles = StyleSheet.create({
    momentContainer: {
        padding: 10,
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 12,
        color: 'white',
        paddingLeft: 15
    },
});