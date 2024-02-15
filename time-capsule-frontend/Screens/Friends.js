import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import { useGlobalContext } from "../context/globalContext";

const Friends = ({ navigation }) => {
    const { curUser, getUserbyID } = useGlobalContext();

    const friendsID = curUser.friends; // objectids
    const friendRequests = curUser.friendRequests; // contains usernames
    const [friendObj, setFriendObj] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const promises = friendsID.map(async (id) => {
                return await getUserbyID(id);
            });

            const friendData = await Promise.all(promises);
            setFriendObj(friendData);
        };

        fetchData();
    }, []);

    // Render Item for Friend Requests
    const renderFriendRequestsItem = ({ item }) => (
        <View style={styles.listItemContainer}>
            <Text style={styles.usernameText}>{item}</Text>
        </View>
    );

    // Render Item for Usernames from Objects
    const renderUsernamesItem = ({ item }) => (
        <View style={styles.listItemContainer}>
            <Text style={styles.usernameText}>{item.username}</Text>
        </View>
    );

    return (
        <BlackBackground>
            <View style={styles.container}>
                {/* Friend Requests List */}
                <Text style={styles.title}>Friend Requests</Text>
                <FlatList
                    data={friendRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderFriendRequestsItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />

                {/* Usernames from Objects List */}
                <Text style={styles.title}>Usernames from Objects</Text>
                <FlatList
                    data={friendObj}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderUsernamesItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('TempMain')}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </BlackBackground>
    );
};

export default Friends;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },

    listItemContainer: {
        backgroundColor: '#2c3e50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
    },

    usernameText: {
        fontSize: 16,
        color: 'white',
    },

    separator: {
        height: 1,
        backgroundColor: '#34495e',
        marginVertical: 10,
    },

    backButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },

    backButtonText: {
        fontSize: 16,
        color: 'white',
    },
});
