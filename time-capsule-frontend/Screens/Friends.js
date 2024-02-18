import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import { useGlobalContext } from "../context/globalContext";
import { commonStyles } from "../Components/CommonStyles";

const Friends = ({ navigation }) => {
    const { curUser, getUserbyID } = useGlobalContext();
    const friendsID = curUser.friends;
    const friendRequests = curUser.friendRequests;
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

    const renderFriendRequestsItem = ({ item }) => (
        <View style={commonStyles.listItemContainer}>
            <Text style={commonStyles.usernameText}>{item}</Text>
            <TouchableOpacity style={commonStyles.rejectButton} onPress={() => navigation.navigate('TempMain')}>
            <Text style={commonStyles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.acceptButton} onPress={() => navigation.navigate('TempMain')}>
            <Text style={commonStyles.buttonText}>Accept</Text>
            </TouchableOpacity>
        </View>
    );

    const renderUsernamesItem = ({ item }) => (
        <View style={commonStyles.listItemContainer}>
            <Text style={commonStyles.usernameText}>{item.username}</Text>
            <TouchableOpacity style={commonStyles.removeButton} onPress={() => navigation.navigate('TempMain')}>
            <Text style={commonStyles.buttonText}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <BlackBackground>
            <TouchableOpacity style={commonStyles.backButtonTop} onPress={() => navigation.navigate('TempMain')}>
        {/*Fix Arrow */}
                <View style={commonStyles.arrowContainer}>
                <View style={commonStyles.arrowLine} />
                <View style={[commonStyles.arrowLine, { transform: [{ rotate: '180deg' }] }]} />
                </View>
            </TouchableOpacity>

            <View style={commonStyles.listContainer }>
            <View style={commonStyles.line} />
            <Text style={commonStyles.title}>Friend Requests</Text>
            <FlatList
                data={friendRequests}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderFriendRequestsItem}
                ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
            />



            <Text style={commonStyles.title}>Friends</Text>
            <FlatList
                data={friendObj}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderUsernamesItem}
                ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
            />

            </View>
        </BlackBackground>
    );
};

export default Friends;
/*
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
            <View style={styles.line}></View>
            <View style={styles.container}>
*/                {/* Friend Requests List */}
/*                <Text style={styles.title}>Friend Requests</Text>
                <FlatList
                    data={friendRequests}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderFriendRequestsItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
*/
                {/* Usernames from Objects List */}
                /*<Text style={styles.title}>Usernames from Objects</Text>
                <FlatList
                    data={friendObj}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderUsernamesItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>
*/
            {/* Back Button */}
            /*<TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('TempMain')}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </BlackBackground>
    );
};*/
/*
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
    line: {
        position: 'fixed',
        width: 360,
        height: 0,
        left: 0,
        top: 200,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
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
*/