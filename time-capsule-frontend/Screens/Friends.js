import React, { useEffect, useState } from "react";
import {View, Image, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";

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
                <View style={commonStyles.arrowContainer}>
                <Image style={commonStyles.arrowIconContainer} source={require('../icons/tempbackarrow-.png')} />
                </View>
            </TouchableOpacity>

            <View style={commonStyles.searchContainer }>
                <View style={commonStyles.searchBar} />
                <Image style={commonStyles.searchIconContainer} source={require('../icons/search-.png')} />
                <TextInput style={commonStyles.searchTextContainer} placeholder="Type here..."/>
            </View>


            <View style={commonStyles.listContainer }>

            <Text style={commonStyles.title}>Friend Requests</Text>
            <View style={commonStyles.line} />
            <FlatList
                data={friendRequests}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderFriendRequestsItem}
                ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
            />

            <Text style={commonStyles.title}>Friends</Text>
            <View style={commonStyles.line} />
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